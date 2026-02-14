"use client"

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { DitherConfig } from "@/types"
import { vertexShader, fragmentShader } from "@/lib/shaders"

export interface DitherCanvasRef {
    download: (filename?: string) => void;
}

interface DitherCanvasProps {
    imageSrc: string | null
    config: DitherConfig
    className?: string
}

export const DitherCanvas = forwardRef<DitherCanvasRef, DitherCanvasProps>(({ imageSrc, config, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gl, setGl] = useState<WebGL2RenderingContext | null>(null)
    const [program, setProgram] = useState<WebGLProgram | null>(null)
    const [texture, setTexture] = useState<WebGLTexture | null>(null)
    const requestRef = useRef<number>()
    const startTimeRef = useRef<number>(Date.now())
    const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 })

    useImperativeHandle(ref, () => ({
        download: (filename = "dithered-image.png") => {
            const canvas = canvasRef.current;
            if (canvas) {
                const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                const link = document.createElement('a');
                link.download = filename;
                link.href = image;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },
    }));

    // Mouse Handling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: 1.0 - (e.clientY - rect.top) / rect.height // Flip Y
            };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Initialize WebGL
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("webgl2", { preserveDrawingBuffer: true })
        if (!context) {
            console.error("WebGL 2 not supported")
            return
        }
        setGl(context)

        const compileShader = (source: string, type: number) => {
            const shader = context.createShader(type)
            if (!shader) return null
            context.shaderSource(shader, source)
            context.compileShader(shader)
            if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                console.error("Shader compile error:", context.getShaderInfoLog(shader))
                context.deleteShader(shader)
                return null
            }
            return shader
        }

        const vShader = compileShader(vertexShader, context.VERTEX_SHADER)
        const fShader = compileShader(fragmentShader, context.FRAGMENT_SHADER)

        if (!vShader || !fShader) return

        const prog = context.createProgram()
        if (!prog) return
        context.attachShader(prog, vShader)
        context.attachShader(prog, fShader)
        context.linkProgram(prog)

        if (!context.getProgramParameter(prog, context.LINK_STATUS)) {
            console.error("Program link error:", context.getProgramInfoLog(prog))
            return
        }

        setProgram(prog)
        context.useProgram(prog)

        const positionBuffer = context.createBuffer()
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW)

        const positionAttribute = context.getAttribLocation(prog, "position")
        context.enableVertexAttribArray(positionAttribute)
        context.vertexAttribPointer(positionAttribute, 2, context.FLOAT, false, 0, 0)

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, [])

    // Load Texture
    useEffect(() => {
        if (!gl || !program) return

        if (config.sourceType === 'image' && imageSrc) {
            const img = new Image()
            img.src = imageSrc
            img.onload = () => {
                const canvas = canvasRef.current
                if (canvas) {
                    canvas.width = img.width
                    canvas.height = img.height
                }
                const tex = gl.createTexture()
                gl.bindTexture(gl.TEXTURE_2D, tex)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
                setTexture(tex)

                // Once texture is loaded, restart loop if needed? 
                // The main loop handles rendering, but texture needs to be bound.
            }
        } else if (config.sourceType === 'generator') {
            const canvas = canvasRef.current
            if (canvas) {
                // Set to a reasonable resolution for generators. 
                // If pixelScale is high, we don't need huge res.
                // But for "Lines" rendering we might want it.
                canvas.width = 800;
                canvas.height = 800;
            }
            setTexture(null);
        }

    }, [gl, program, imageSrc, config.sourceType])

    // Render Loop
    useEffect(() => {
        if (!gl || !program) return

        const render = () => {
            gl.useProgram(program)

            // Time
            const time = (Date.now() - startTimeRef.current) / 1000.0;
            const uTime = gl.getUniformLocation(program, "u_time");
            gl.uniform1f(uTime, time);

            // Mouse
            const uMouse = gl.getUniformLocation(program, "u_mouse");
            gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

            // Source Config
            const uUseImage = gl.getUniformLocation(program, "u_use_image");
            gl.uniform1i(uUseImage, config.sourceType === "image" ? 1 : 0);

            const uGenType = gl.getUniformLocation(program, "u_gen_type");
            let genTypeVal = 0;
            if (config.generator.type === "noise") genTypeVal = 1;
            if (config.generator.type === "grid") genTypeVal = 2;
            gl.uniform1i(uGenType, genTypeVal);

            // Generator Params
            gl.uniform1f(gl.getUniformLocation(program, "u_gen_speed"), config.generator.speed);
            gl.uniform1f(gl.getUniformLocation(program, "u_gen_direction"), config.generator.direction);
            gl.uniform1f(gl.getUniformLocation(program, "u_gen_scale"), config.generator.scale);
            gl.uniform1f(gl.getUniformLocation(program, "u_gen_imp1"), config.generator.octaves);

            // Dither
            gl.uniform1f(gl.getUniformLocation(program, "u_pixel_scale"), Math.max(1.0, config.pixelScale));
            gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), gl.canvas.width, gl.canvas.height);
            gl.uniform1f(gl.getUniformLocation(program, "u_dither_amount"), config.ditherAmount);

            let ditherMethodVal = 0;
            if (config.ditherMethod === "random") ditherMethodVal = 1;
            if (config.ditherMethod === "lines") ditherMethodVal = 2;
            if (config.ditherMethod === "halftone") ditherMethodVal = 3;
            gl.uniform1i(gl.getUniformLocation(program, "u_dither_method"), ditherMethodVal);

            gl.uniform1f(gl.getUniformLocation(program, "u_render_lines"), config.render.lines);
            gl.uniform1f(gl.getUniformLocation(program, "u_render_weight"), config.render.weight);

            // Color & Effects
            gl.uniform1f(gl.getUniformLocation(program, "u_brightness"), config.brightness);
            gl.uniform1f(gl.getUniformLocation(program, "u_contrast"), config.contrast);
            gl.uniform1f(gl.getUniformLocation(program, "u_saturation"), config.saturation);
            gl.uniform1f(gl.getUniformLocation(program, "u_vignette"), config.effects.vignette);
            gl.uniform1f(gl.getUniformLocation(program, "u_glow"), config.effects.glow);
            gl.uniform1f(gl.getUniformLocation(program, "u_warp"), config.effects.mouse > 0 ? config.effects.warp * 0.5 + (mouseRef.current.x * config.effects.mouse) : config.effects.warp);

            // Palette
            const uPalette = gl.getUniformLocation(program, "u_palette")
            const uPaletteSize = gl.getUniformLocation(program, "u_palette_size")
            const paletteData = new Float32Array(16 * 3);
            config.palette.colors.forEach((c, i) => {
                if (i < 16) {
                    paletteData[i * 3] = c.r;
                    paletteData[i * 3 + 1] = c.g;
                    paletteData[i * 3 + 2] = c.b;
                }
            });
            gl.uniform3fv(uPalette, paletteData);
            gl.uniform1i(uPaletteSize, Math.min(16, config.palette.colors.length));

            // Texture
            const uImage = gl.getUniformLocation(program, "u_image");
            if (texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(uImage, 0);
            }

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            gl.drawArrays(gl.TRIANGLES, 0, 6)

            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }

    }, [gl, program, texture, config])

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    )
})
DitherCanvas.displayName = "DitherCanvas";
