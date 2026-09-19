# Continuum — Build Plan & Progress

This document captures the plan, task breakdown, and progress snapshot at the time
of this push. The build is **in progress**; this is an intermediate checkpoint.

## Plan

Build a Vite + React + TypeScript particle-universe engine per `AGENT.md`, honoring
the non-negotiables:

- Strict TypeScript, modular architecture (no monolithic files).
- Deterministic, seeded simulation with a fixed-timestep clock.
- Typed-array particle storage (structure-of-arrays) for performance.
- Spatial hash for neighbor queries (forces, blast, healing).
- Extensible shape system + registry with the 6 required presets.
- WebGL2 renderer with capability detection and a Canvas2D fallback.
- Four independent controls: Hand, Pencil, Random, Canon.
- Zustand state, IndexedDB persistence, theme via CSS variables.

## Task Breakdown (todos)

1. **[in-progress]** Scaffold Vite + React + TS project with strict config, theme CSS
   variables, and dependencies.
2. **[todo]** Build simulation engine (seeded RNG, typed-array particles,
   fixed-timestep clock, spatial hash, forces, blast, healing).
3. **[todo]** Build shape system and 6 required presets with extensible registry.
4. **[todo]** Build WebGL2 renderer with capability detection, grid, instanced
   particles, and Canvas2D fallback + camera.
5. **[todo]** Build UI: four independent controls (Hand/Pencil/Random/Canon), Pencil
   config panel, Canon menu, hints, Zustand state, IndexedDB storage.
6. **[todo]** Wire everything in App, verify in browser, and sync Git.

## Progress Snapshot

Completed so far:

- Project scaffold: `package.json`, `tsconfig.json`, `vite.config.ts`,
  `vitest.config.ts`, `index.html`, `src/main.tsx`.
- Theme: `src/styles/theme.css` (CSS-variable design tokens).
- Math: `src/math/random.ts` (seeded RNG), `src/math/constants.ts`,
  `src/math/vectors.ts`.
- Engine foundation: `src/engine/types.ts`, `src/engine/particles.ts`
  (typed-array buffer), `src/engine/spatialHash.ts`, `src/engine/camera.ts`.
- Shapes: `src/shapes/generators.ts`, `src/shapes/catalog.ts`.
- Presets: `src/presets/index.ts` (6 required presets + registry).

Remaining:

- Engine step/forces/blast/healing + fixed-timestep clock loop.
- WebGL2 renderer + Canvas2D fallback.
- UI (controls, panels, hints), Zustand store, IndexedDB persistence.
- App wiring and browser verification.
