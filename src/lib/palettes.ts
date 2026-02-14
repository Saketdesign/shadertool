
import { Palette } from "@/types";

export const PRESET_PALETTES: Palette[] = [
    {
        name: "1-bit B&W",
        colors: [
            { r: 0, g: 0, b: 0 },
            { r: 1, g: 1, b: 1 },
        ],
    },
    {
        name: "Gameboy",
        colors: [
            { r: 15 / 255, g: 56 / 255, b: 15 / 255 },
            { r: 48 / 255, g: 98 / 255, b: 48 / 255 },
            { r: 139 / 255, g: 172 / 255, b: 15 / 255 },
            { r: 155 / 255, g: 188 / 255, b: 15 / 255 },
        ],
    },
    {
        name: "CGA (Mode 4 Palette 1 High)",
        colors: [
            { r: 0, g: 0, b: 0 },
            { r: 1, g: 0.33, b: 1 }, // Magenta
            { r: 0.33, g: 1, b: 1 }, // Cyan
            { r: 1, g: 1, b: 1 },    // White
        ],
    },
    {
        name: "Macintosh II",
        colors: [
            { r: 1, g: 1, b: 1 },
            { r: 1, g: 1, b: 0 },
            { r: 1, g: 0.6, b: 0 },
            { r: 0.86, g: 0.08, b: 0.23 },
            { r: 1, g: 0, b: 1 },
            { r: 0.4, g: 0, b: 0.8 },
            { r: 0, g: 0, b: 1 },
            { r: 0, g: 0.6, b: 1 },
            { r: 0, g: 1, b: 0 },
            { r: 0, g: 0.6, b: 0 },
            { r: 0.6, g: 0.4, b: 0.2 },
            { r: 0.4, g: 0.2, b: 0 },
            { r: 0.8, g: 0.8, b: 0.8 },
            { r: 0.5, g: 0.5, b: 0.5 },
            { r: 0, g: 0, b: 0 }
        ]
    },
    {
        name: "Cyberpunk Neon",
        colors: [
            { r: 0.05, g: 0.05, b: 0.1 },
            { r: 1.0, g: 0.0, b: 0.5 }, // Hot Pink
            { r: 0.0, g: 1.0, b: 1.0 }, // Cyan
            { r: 0.5, g: 0.0, b: 1.0 }, // Purple
            { r: 1.0, g: 0.9, b: 0.0 }, // Yellow
        ]
    }
];
