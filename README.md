# COSMO

Radar de Oportunidades & Validação Empírica — a React 19 + TypeScript + Vite single-page application implementing the COSMO methodology.

**Status**: exploratory testing, not production-ready. See [`docs/STATUS.md`](docs/STATUS.md) for the current inventory, known risks and gate results.

## Prerequisites

- Node.js 24 (major `24`)
- npm 11 (major `11`)

The repository pins these with `.nvmrc`, `engines` in `package.json` and `engine-strict=true` in `.npmrc`; an unsupported runtime is rejected before install.

## Install

```
npm ci
```

`npm ci` installs strictly from the committed `package-lock.json` and never mutates the manifest. It is the only supported install path.

## Run locally

```
npm run dev
```

The dev server serves the app at `http://localhost:3000`.

## Quality gates

| Command | What it runs |
| ------- | ------------- |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest test suite |
| `npm run build` | Production Vite build |
| `npm run check` | Full local gate: typecheck, test, production dependency audit, build |

`npm run check` is the same gate enforced in CI (`.github/workflows/ci.yml`) on every pull request targeting `main` and every push to `main`.

## Data and persistence

The app persists its state to browser `localStorage`. There is no backend and no authentication layer; all data lives client-side in the browser running it.
