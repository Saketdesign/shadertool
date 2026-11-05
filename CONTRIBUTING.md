# contributing to shadertool

thanks for contributing.

## development setup

```bash
git clone https://github.com/Saketdesign/shadertool.git
cd shadertool
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000) to inspect the local app.

run linting and build:
```bash
npm run lint
npm run build
```

## guidelines

- shader code and glsl uniforms should stay performant on mobile and low-end gpus.
- issues and pull requests are reviewed within 24 hours.
