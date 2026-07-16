# AGENTS.md — Operating Guide for Crowd Control Daily

This file is the entry point for any agent (human or AI) working on this
repository. Read it first, then `docs/PRODUCT_SPEC.md`, `docs/MASTER_PLAN.md`,
and `docs/STATUS.md`.

## What this project is

**Crowd Control Daily** is a premium, offline, cross-platform mobile puzzle
game built with Expo React Native + TypeScript. Players clear a grid of chibi
crowd characters; each character faces a direction and can only leave when the
straight path to that edge is empty.

## Golden rules

1. **Phase discipline.** Work one phase at a time. Do not implement a later
   phase before the earlier phase's acceptance criteria pass. Phases are defined
   in `docs/MASTER_PLAN.md` and detailed in `docs/phases/`.
2. **A phase is done only when tests + runtime validation + acceptance criteria
   pass** — not when code is merely written.
3. **No fakes.** No dead routes, no commented-out substitutes, no fake success
   states, no partially wired buttons.
4. **Engine is pure.** All gameplay rules live in `src/engine/` as pure
   functions with no React/UI imports. Storage lives behind typed modules in
   `src/storage/`. Routes in `app/` stay thin.
5. **Offline first.** No network required at runtime. No auth, no ads, no IAP.
6. **No secrets committed.** API keys are read only from the environment.
7. **Update docs continuously.** `docs/STATUS.md` is the authoritative status.

## Repository layout

- `app/` — Expo Router routes (thin screens).
- `src/engine/` — pure game logic (path checking, moves, generator, solver).
- `src/data/` — static data (levels, characters, environments, theme tokens).
- `src/components/` — reusable UI components grouped by domain.
- `src/hooks/` — React hooks (game, progress, settings, audio…).
- `src/storage/` — typed AsyncStorage wrappers + migrations.
- `src/types/` — shared TypeScript types.
- `src/utils/` — pure helpers (seeded RNG, dates, formatting).
- `src/tests/` — Jest tests grouped by domain.
- `assets/` — branding, characters, environments, icons, audio, generated.
- `scripts/` — level validation, asset generation/verification/optimization.
- `docs/` — specs, plans, status, phase docs.

## Standard commands

```bash
npm install            # install dependencies
npm run typecheck      # tsc --noEmit (strict)
npm run lint           # eslint .
npm test               # jest
npm run validate:levels# run bundled + generated levels through the solver
npm run assets:verify  # verify asset manifest vs files on disk
```

Before completing any stable phase, run `typecheck`, `lint`, and `test`. Run
`validate:levels` when engine/levels change.

## Workflow per phase

1. Read `AGENTS.md`, `docs/PRODUCT_SPEC.md`, the current phase doc, `STATUS.md`.
2. Inspect existing code before changing it.
3. Verify a clean git checkpoint.
4. Implement only the current phase's scope.
5. Add/update tests. Run all phase-required checks. Fix every failure.
6. Update docs. Commit. Record the commit in `docs/STATUS.md`.
7. Advance only after acceptance criteria pass.

## Resume command

> Read AGENTS.md, docs/PRODUCT_SPEC.md, docs/MASTER_PLAN.md, and docs/STATUS.md.
> Resume from the recorded current phase and next action. Do not redo completed
> work.
