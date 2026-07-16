# Master Plan — Crowd Control Daily

Build order and dependencies. Each phase has a detailed doc in `docs/phases/`.
A phase is complete only when its acceptance criteria (tests + runtime checks)
pass. Phases were reordered slightly from the directive's numbering for
dependency safety (pure logic before UI), but all directive phases are covered.

## Execution order

| # | Phase | Depends on | Key deliverables |
|---|-------|-----------|------------------|
| 0 | Repository & planning | — | All docs, manifests, phase docs |
| 1 | Foundation | 0 | Expo app, TS strict, router shell, theme, lint, jest, EAS skeleton |
| 4 | Core engine | 1 | Types + pure rules + tests |
| 7 | Generator/solver/daily | 4 | Seeded gen, solver, 60 levels, daily, validation script |
| 2 | Asset pipeline | 1 | SVG lib, manifest, capability, procedural art |
| 3 | Splash & onboarding | 1,2 | Native+animated splash, 5 onboarding pages, persistence |
| 5 | First playable & tutorial | 4,2 | Board, interaction, animations, tutorial |
| 6 | Levels & progression | 7,5 | Level select, stars, unlocking, results, storage |
| 8 | Remaining screens | 5,6 | Home, stats, customize, settings, about, privacy |
| 9 | Full art production | 2,8 | Complete asset set, effects, store art, audio queue |
| 10| Polish & release | all | A11y/perf/visual QA, docs, EAS profiles, final checks |

> Rationale: engine (4) and generator/daily (7) are pure TypeScript, fully
> testable headlessly, and everything else depends on them — so they come
> right after foundation. Asset pipeline (2) runs in parallel conceptually but
> is sequenced after foundation. UI phases (3,5,6,8) consume the tested logic.

## Definition of done

See directive §24. Tracked as a live checklist in `docs/STATUS.md`.

## Quality gates (run before each stable commit)

```
npm run typecheck && npm run lint && npm test
npm run validate:levels   # when engine/levels change
npm run assets:verify     # when assets change
```
