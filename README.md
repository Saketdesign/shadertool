# shadertool

[![license: mit](https://img.shields.io/badge/license-mit-yellow.svg)](LICENSE)
[![live demo](https://img.shields.io/badge/demo-shadertool--eight.vercel.app-blue.svg)](https://shadertool-eight.vercel.app)
[![ci](https://github.com/Saketdesign/shadertool/actions/workflows/ci.yml/badge.svg)](https://github.com/Saketdesign/shadertool/actions/workflows/ci.yml)

browser playground for realtime webgl dithering and custom glsl shaders.

## live demo

try the shader playground in your browser:  
👉 **[shadertool-eight.vercel.app](https://shadertool-eight.vercel.app)**

## what it does

- realtime glsl dithering: interactive webgl canvas powered by three.js and react three fiber
- color palettes: switch and preview color quantization palettes on the fly
- image upload: drop in any image to test dither filters immediately
- controls: adjust threshold, pixelation density, spread, and contrast in realtime

## quickstart

```bash
git clone https://github.com/Saketdesign/shadertool.git
cd shadertool
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## build & lint

```bash
npm run lint
npm run build
```

## tech stack

- framework: next.js (app router)
- 3d / webgl: three.js, `@react-three/fiber`, `@react-three/drei`
- ui & styling: tailwind css 4, radix ui primitives, lucide icons
- language: typescript

## community & support

- issue sla: bug reports, questions, and feature requests are reviewed within 24 hours.
- discussions: join our [github discussions](https://github.com/Saketdesign/shadertool/discussions).

## license

[mit](LICENSE) © 2026 Saket Joshi
