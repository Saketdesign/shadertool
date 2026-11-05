# Shadertool

> Interactive WebGL dither shader and palette studio built with Next.js, Three.js, and React Three Fiber.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-shadertool--eight.vercel.app-blue.svg)](https://shadertool-eight.vercel.app)
[![CI](https://github.com/Saketdesign/shadertool/actions/workflows/ci.yml/badge.svg)](https://github.com/Saketdesign/shadertool/actions/workflows/ci.yml)

## Live Demo

Try the interactive shader tool in your browser:  
👉 **[shadertool-eight.vercel.app](https://shadertool-eight.vercel.app)**

## Features

- **Real-Time GLSL Dithering:** Interactive dithering canvas powered by Three.js and custom fragment shaders.
- **Palette Presets:** Explore and switch color quantization palettes on the fly.
- **Custom Image Upload:** Drop in your own imagery and see it transformed through dither filters instantly.
- **Parameter Controls:** Sliders for threshold, pixelation density, spread, and contrast.

## Quickstart

```bash
# Clone the repository
git clone https://github.com/Saketdesign/shadertool.git
cd shadertool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Tech Stack

- **Framework:** Next.js (App Router)
- **3D / WebGL:** Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **UI & Styling:** Tailwind CSS 4, Radix UI primitives, Lucide Icons
- **Language:** TypeScript

## Community & Support

- **Issue SLA:** Bug reports, questions, and feature requests are reviewed within 24 hours.
- **Discussions:** Ideas and shader feedback are welcome in [GitHub Discussions](https://github.com/Saketdesign/shadertool/discussions).
