# Phase 10 — Polish & Release

## Objective

Bring the app to a shippable state: device-size review, accessibility review,
performance review, full visual QA, store documentation, privacy policy,
README, EAS production profiles, and a final green run of every quality gate.
No known release-blocking issues remain.

## Scope

- Cross-device layout review (small phone → large phone/tablet).
- Accessibility pass (roles, labels, touch targets, contrast, text scaling,
  reduced motion, direction-by-shape).
- Performance pass (startup, animation smoothness, memory, re-renders).
- Visual QA across all screens and flows.
- Release docs (README, store listing, privacy policy) and EAS production build
  profiles.
- Final full test + validation run.

## Files expected to change

- `README.md`
- `docs/STORE_LISTING.md`, `docs/PRIVACY_POLICY.md`, `docs/RELEASE_CHECKLIST.md`
- `docs/MANUAL_VISUAL_QA.md` (completed), `docs/KNOWN_ISSUES.md` (triaged)
- `eas.json` (production profiles finalized)
- `app.config.ts` (version, build number, icons, splash finalized)
- `src/components/**` (a11y/perf fixes as needed)
- `src/tests/a11y/` (accessibility assertions), `src/tests/perf/` (if added)

## Dependencies

- All prior phases (0–9). This phase integrates and hardens the whole app.
- Packages: EAS CLI config; no new runtime deps expected beyond fixes.

## Implementation tasks

1. Review layouts on multiple device sizes; fix overflow, safe-area, and scaling
   issues on the smallest and largest supported frames.
2. Accessibility pass: verify roles/labels on all interactive elements, ≥44pt
   targets, high-contrast text, text scaling, reduced-motion path, and
   direction conveyed by arrow shape (not color alone).
3. Performance pass: measure cold-start, ensure 60fps animations where feasible,
   remove unnecessary re-renders, verify memory stays bounded during play.
4. Visual QA every screen and the full core flow (splash → onboarding →
   tutorial → play → results → daily → customize/settings).
5. Write `README.md` (setup, commands, architecture summary).
6. Write `PRIVACY_POLICY.md` (offline, no data collection, local storage only)
   and `STORE_LISTING.md` (copy, keywords, screenshots list).
7. Finalize `eas.json` production profiles and `app.config.ts` versioning,
   icons, and splash.
8. Triage `KNOWN_ISSUES.md`: confirm no release-blocking issues remain.
9. Run the full gate: typecheck, lint, test, and validate:levels; fix failures.

## Tests required

- Full suite green: `npm run typecheck && npm run lint && npm test`.
- `npm run validate:levels` passes (bundled + ≥2000 boards).
- Accessibility tests: key screens expose expected roles/labels; interactive
  elements meet the minimum touch-target contract.
- Core-flow integration/smoke: the primary path renders and advances without
  errors.

## Visual checks required

- All screens reviewed on small and large device frames; no clipping/overflow.
- High-contrast and scaled-text renders remain legible and unbroken.
- Reduced-motion run completes the core flow without animation dependency.
- Store screenshots captured (or queued in `MANUAL_VISUAL_QA.md` for the user).

## Acceptance criteria

- Typecheck, lint, tests, and validation all pass.
- App launches.
- Core flow is complete end to end.
- Build config (EAS production profiles) exists.
- No known release-blocking issues.

## Exit conditions

- All quality gates green on a clean checkout.
- Release docs written; EAS production profiles finalized.
- `KNOWN_ISSUES.md` shows no blockers; STATUS marks the project release-ready.
- Final commit recorded.

## Rollback notes

This phase is mostly hardening, docs, and config — low structural risk. Roll
back individual fixes if a change regresses tests; keep `eas.json` and
`app.config.ts` version bumps in a dedicated commit so a release can be reverted
cleanly without touching feature code. Never ship a store/privacy doc that
misrepresents the app's offline, no-collection behavior.
