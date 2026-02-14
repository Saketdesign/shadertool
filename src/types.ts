
export type DitherMethod = "ordered" | "random" | "blue-noise" | "lines" | "halftone" | "contour";

export type SourceType = "image" | "generator";
export type GeneratorType = "spiral" | "noise" | "grid";

export interface PaletteColor {
    r: number;
    g: number;
    b: number;
}

export interface Palette {
    name: string;
    colors: PaletteColor[];
}

export interface GeneratorConfig {
    type: GeneratorType;
    speed: number;
    direction: number; // 0-360
    scale: number;
    octaves: number; // for noise
    threshold: number; // for noise
    warp: number; // distortion
}

export interface EffectsConfig {
    vignette: number;
    glow: number;
    warp: number;
    mouse: number; // mouse influence
}

export interface RenderConfig {
    mode: DitherMethod;
    lines: number; // for line/contour dither
    weight: number; // line weight
}

export interface DitherConfig {
    sourceType: SourceType;
    pixelScale: number; // 1 to ... (higher means more pixelated)

    ditherMethod: DitherMethod;
    ditherAmount: number; // 0.0 to 1.0 mixture

    render: RenderConfig;

    palette: Palette;
    brightness: number; // -1.0 to 1.0
    contrast: number; // 0.0 to 2.0
    saturation: number; // 0.0 to 2.0

    generator: GeneratorConfig;
    effects: EffectsConfig;
}

export const presets: Palette[] = [
    {
        name: "Gameboy",
        colors: [
            { r: 15 / 255, g: 56 / 255, b: 15 / 255 },
            { r: 48 / 255, g: 98 / 255, b: 48 / 255 },
            { r: 139 / 255, g: 172 / 255, b: 15 / 255 },
            { r: 155 / 255, g: 188 / 255, b: 15 / 255 },
        ]
    },
    {
        name: "CGA",
        colors: [
            { r: 0, g: 0, b: 0 },
            { r: 0, g: 1, b: 1 },
            { r: 1, g: 0, b: 1 },
            { r: 1, g: 1, b: 1 },
        ]
    },
    {
        name: "Macintosh II",
        colors: [
            { r: 1, g: 1, b: 1 },
            { r: 0, g: 0, b: 0 },
            { r: 240 / 255, g: 10 / 255, b: 10 / 255 },
            { r: 10 / 255, g: 240 / 255, b: 10 / 255 },
            { r: 10 / 255, g: 10 / 255, b: 240 / 255 },
        ]
    },
    {
        name: "Cyberpunk Neon",
        colors: [
            { r: 0.1, g: 0.05, b: 0.2 },
            { r: 1.0, g: 0.0, b: 0.5 },
            { r: 0.0, g: 1.0, b: 1.0 },
            { r: 1.0, g: 1.0, b: 0.0 },
        ]
    },
    {
        name: "Monochrome",
        colors: [
            { r: 0, g: 0, b: 0 },
            { r: 1, g: 1, b: 1 },
        ]
    }
];
