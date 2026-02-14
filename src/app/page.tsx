
"use client"

import React, { useRef, useState } from "react"
import { ImageUpload } from "@/components/core/ImageUpload"
import { DitherCanvas, DitherCanvasRef } from "@/components/core/DitherCanvas"
import { ControlPanel } from "@/components/core/ControlPanel"
import { DitherConfig, presets } from "@/types"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

export default function Home() {
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    const [config, setConfig] = useState<DitherConfig>({
        sourceType: 'image',
        pixelScale: 6,
        ditherMethod: "ordered",
        ditherAmount: 0.5,
        render: {
            mode: "ordered",
            lines: 50,
            weight: 0.5
        },
        palette: presets[0], // Gameboy default
        brightness: 0.0,
        contrast: 1.0,
        saturation: 1.0,
        generator: {
            type: 'spiral',
            speed: 1.0,
            direction: 0,
            scale: 10.0,
            octaves: 4,
            threshold: 0.5,
            warp: 0.0
        },
        effects: {
            vignette: 0.2,
            glow: 0.0,
            warp: 0.0,
            mouse: 0.0
        }
    })

    const canvasRef = useRef<DitherCanvasRef>(null)

    const handleImageSelect = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setImageSrc(e.target?.result as string)
            // Switch config to image mode if user uploads
            setConfig(prev => ({ ...prev, sourceType: 'image' }))
        }
        reader.readAsDataURL(file)
    }

    const handleDownload = () => {
        if (canvasRef.current) {
            canvasRef.current.download("dither-shade-export.png");
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">

            {/* Sidebar Controls */}
            <ControlPanel config={config} setConfig={setConfig} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative bg-zinc-950">

                {/* Header / Top Bar */}
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-sm z-10 absolute top-0 w-full">
                    <div className="flex items-center space-x-4">
                        {/* Maybe breadcrumbs or status? */}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs uppercase tracking-wider">
                            <Download className="mr-2 h-3 w-3" /> Export
                        </Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">

                    {/* Background Grid Pattern (Aesthetic) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {(imageSrc || config.sourceType === 'generator') ? (
                        <div className="relative shadow-2xl border border-white/10">
                            <DitherCanvas
                                ref={canvasRef}
                                imageSrc={imageSrc}
                                config={config}
                                className="max-h-[85vh] max-w-full block" // block to remove inline spacing
                            />
                        </div>
                    ) : (
                        <div className="max-w-md w-full">
                            <ImageUpload onImageSelect={handleImageSelect} />
                            <div className="mt-8 text-center">
                                <p className="text-zinc-500 text-sm mb-2">OR</p>
                                <Button variant="outline" onClick={() => setConfig(prev => ({ ...prev, sourceType: 'generator' }))}>
                                    Start with Generator
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
