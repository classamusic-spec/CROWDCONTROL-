# Phase 0 — Repository & Planning

## Objective

Establish the complete written foundation for the project before any product
code is written: operating guide, product spec, master plan, art bible, asset
manifest/queue, capability detection, decisions log, status tracking, and one
detailed doc per phase. Everything downstream must be traceable to these
documents.

## Scope

- Author all repository-level planning and reference docs.
- Detect and record the asset-generation capabilities of the environment.
- Define the phase graph, dependencies, and acceptance criteria.
- Establish status/decision/known-issue tracking that later phases update.
- Explicitly **not** implement any runtime product code.

## Files expected to change

- `AGENTS.md`
- `docs/PRODUCT_SPEC.md`
- `docs/MASTER_PLAN.md`
- `docs/ART_BIBLE.md`
- `docs/ASSET_CAPABILITIES.md`
- `docs/ASSET_GENERATION_QUEUE.md`
- `docs/DECISIONS.md`
- `docs/STATUS.md`
- `docs/KNOWN_ISSUES.md`
- `docs/MANUAL_VISUAL_QA.md`
- `docs/phases/phase-00-planning.md` … `docs/phases/phase-10-polish-release.md`

## Dependencies

None. This is the root phase. No npm packages installed yet.

## Implementation tasks

1. Write `AGENTS.md` with golden rules, repo layout, standard commands, and the
   per-phase workflow.
2. Write `docs/PRODUCT_SPEC.md`: identity, core loop, authoritative rules,
   scoring, levels, daily, environments, screens, cosmetics, storage, a11y,
   non-goals.
3. Write `docs/ART_BIBLE.md`: character/environment systems, arrows/icons,
   palette tokens, direction color+shape mapping, formats, disallowed list.
4. Run capability detection (image tooling, `OPENAI_API_KEY`, sharp, simulator)
   and record results in `docs/ASSET_CAPABILITIES.md`; conclude Asset Mode.
5. Write `docs/MASTER_PLAN.md` with the execution order table and dependencies.
6. Author the 11 phase docs in `docs/phases/` with all required sections.
7. Seed `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`,
   `docs/ASSET_GENERATION_QUEUE.md`, and `docs/MANUAL_VISUAL_QA.md`.
8. Cross-check every cross-reference: no doc points at a file that the plan
   does not create in some phase.

## Tests required

No automated tests (no toolchain yet). Verification is a documentation
consistency review:

- Every phase referenced in `MASTER_PLAN.md` has a matching file in
  `docs/phases/`.
- Every acceptance criterion in the directive maps to exactly one phase doc.
- No path referenced in a phase doc contradicts the repo layout in `AGENTS.md`.

## Visual checks required

N/A — non-UI phase. This phase produces only markdown; there is no rendered
surface to inspect.

## Acceptance criteria

- All planning files exist and are non-empty.
- Scope is internally consistent across all docs (no contradictions).
- No product code is prematurely implemented (only docs present).

## Exit conditions

- The 11 phase docs, all reference docs, and status tracking are committed.
- `docs/STATUS.md` shows Phase 0 complete and Phase 1 as the next action.
- A clean git checkpoint exists before Phase 1 begins.

## Rollback notes

Docs are additive and carry no runtime risk. Rollback = `git revert` of the
planning commit. No build artifacts, no installed dependencies, no schema or
storage impact. Safe to iterate freely.
