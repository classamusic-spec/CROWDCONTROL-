# Phase 1 — Foundation

## Objective

Stand up a launchable Expo React Native + TypeScript app with strict typing,
file-based routing, a theme/design-token system, asset loading, and the full
quality toolchain (ESLint, Jest, EAS skeleton). This is the scaffold every
later phase builds on.

## Scope

- Initialize the Expo (managed) project and `app/` router shell.
- Configure TypeScript strict mode and path aliases.
- Implement the theme provider and design tokens from the Art Bible palette.
- Wire ESLint, Prettier, and Jest with a smoke test.
- Add EAS build config skeleton and native splash foundation.
- Deliver a navigable (if mostly empty) shell — no gameplay yet.

## Files expected to change

- `package.json`, `tsconfig.json`, `app.json`/`app.config.ts`, `eas.json`
- `.eslintrc.cjs`, `.prettierrc`, `jest.config.js`, `babel.config.js`
- `app/_layout.tsx`, `app/index.tsx`, `app/+not-found.tsx`
- `src/data/theme.ts` (tokens), `src/components/theme/ThemeProvider.tsx`
- `src/hooks/useTheme.ts`
- `src/utils/assets.ts` (asset loading helper)
- `src/tests/smoke.test.ts`
- `assets/splash-placeholder.png`, `assets/icon.png` (temporary)

## Dependencies

- Phase 0 (planning docs).
- Packages: `expo`, `expo-router`, `react-native`, `typescript`,
  `expo-splash-screen`, `react-native-safe-area-context`, `eslint`, `jest`,
  `@testing-library/react-native`, `prettier`.

## Implementation tasks

1. Scaffold the Expo managed project; pin SDK and React Native versions.
2. Enable `strict: true` (plus `noUncheckedIndexedAccess`) in `tsconfig.json`
   and add `@/*` path aliases.
3. Create the Expo Router root layout and an index route rendering a themed
   placeholder screen.
4. Implement `src/data/theme.ts` exporting color tokens, spacing, radii, and
   typography scale derived from the Art Bible.
5. Build `ThemeProvider` + `useTheme` with light/dark-safe token access.
6. Configure ESLint (typescript + react-native + import rules) and Prettier.
7. Configure Jest with the RN preset and RNTL; add a smoke test that renders
   the index route.
8. Add `eas.json` with development/preview/production profile skeletons.
9. Configure native splash via `expo-splash-screen` (foundation only).
10. Add `npm` scripts: `typecheck`, `lint`, `test`, `start`.

## Tests required

- `smoke.test.ts`: index route renders without throwing.
- Theme token test: `theme.ts` exports every palette color referenced by the
  Art Bible and values are valid hex strings.
- `npm run typecheck` exits 0; `npm run lint` exits 0.

## Visual checks required

- App boots to the index screen in Expo without a red-box error.
- Themed placeholder uses palette colors (navy background, correct text token).
- Safe-area insets respected on a notched device frame.

## Acceptance criteria

- App launches.
- `npm run typecheck` passes.
- `npm run lint` passes.
- Test runner works (`npm test` green).
- Navigation shell works (index route reachable via router).

## Exit conditions

- All four quality scripts run and pass on a clean checkout.
- Router renders at least one real route and a not-found fallback.
- STATUS updated; commit recorded.

## Rollback notes

Foundation is isolated: no engine, storage, or gameplay yet. Rollback = revert
the scaffold commit and delete `node_modules`/lockfile. No persisted user data
exists to migrate. Keep `package-lock.json` under version control so a revert
restores exact dependency versions.
