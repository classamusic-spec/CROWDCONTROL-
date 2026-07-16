# UI Integration Contract (for screen authors)

Import alias: `@/` → `src/`. Router: `expo-router` (`useRouter().replace('/path')`,
`useRouter().push({ pathname: '/game', params: { level: '3' } })`,
`useLocalSearchParams()`). All screens are default-exported React components in
`app/`. TypeScript strict + `noUncheckedIndexedAccess`.

## Layout & theme
- `import { palette, theme } from '@/data/theme'` — colors + spacing/radius/
  shadow/typography/motion tokens. Never hardcode hex; use `palette`.
- Wrap every screen in `<ScreenBackground environmentId={id}>…</ScreenBackground>`
  (`@/components/navigation/ScreenBackground`). Optional props: `edges`,
  `contentStyle`, `subtleDecoration`. It provides the env backdrop + safe area.
- Never render a plain/white screen. Use `Panel` for cards.

## Components (props)
- `Button` `@/components/buttons/Button` — `{ label, onPress?, variant?: 'primary'|'secondary'|'success'|'danger'|'ghost', size?: 'sm'|'md'|'lg', icon?: IconName, disabled?, fullWidth?, style? }`
- `IconButton` `@/components/buttons/IconButton` — `{ icon: IconName, onPress?, label, caption?, disabled?, tint?, size? }`
- `Panel` `@/components/cards/Panel` — `{ tone?: 'panel'|'warm'|'navy', padded?, style?, children }`
- `Icon` `@/components/icons` — `{ name: IconName, size?, color?, strokeColor? }`. `IconName` is exported. Valid names: star, heart, arrow, timer, remaining, mistakes, restart, undo, hint, settings, home, levels, stats, customize, share, calendar, streak, lock, trophy, reward, sound, music, haptics, reducedmotion, theme, replay, continue, pause, close, back.
- `StarRow` `@/components/feedback/StarRow` — `{ earned: number, size?, animate? }`
- `HudPill` `@/components/stats/HudPill` — `{ icon: IconName, value: string, label?, tint? }`
- `BottomNav` `@/components/navigation/BottomNav` — no props; renders the 5-tab bar. Put it at the bottom of hub screens (home/levels/daily/stats/settings).
- `Logo` `@/components/branding/Logo` — `{ size?: 'sm'|'md'|'lg', showEmblem? }`
- `Emblem` `@/components/branding/Emblem` — `{ size? }`
- `CrowdSprite` `@/components/game/CrowdSprite` — `{ variant: string, size?, facing?: 'front'|'back' }`

## Hooks (all require the app to be wrapped in AppStateProvider, which it is)
- `useSettings()` → `{ settings: { sound, music, haptics, reducedMotion, theme }, updateSettings(patch) }`
- `useProgress()` → `{ progress, statistics, recordLevelResult(input), setSelectedEnvironment(id), unlockCosmetic(id), equipCosmetic(slot,id), addPlayTime(ms), resetProgress() }`
  - `progress`: `{ levels: Record<number, {stars,completed,bestTimeMs,bestMoves,fewestMistakes,perfect}>, highestUnlocked, totalStars, charactersCleared, playTimeMs, cosmetics: string[], equipped: Record<string,string>, selectedEnvironment }`
  - `statistics`: `{ levelsCompleted, perfectLevels, totalMistakes, gamesPlayed }`
- `useOnboarding()` → `{ onboarding: { onboardingComplete, tutorialComplete }, completeOnboarding(), completeTutorial() }`
- `useDailyChallenge(dateString?)` → `{ date, level, official, completed, currentStreak, longestStreak, history, recordDailyResult(entry) }`
- `useReducedMotionPref()` → boolean
- `useAppState()` → everything above combined (use the specific hooks instead when possible).

## Data
- `onboardingPages` `@/data/onboarding` — `{ id, headline, copy }[]` (5).
- `cosmetics`, `getCosmetic`, `DEFAULT_EQUIPPED`, `FREE_COSMETICS` `@/data/cosmetics`.
- `environments`, `getEnvironment`, `unlockedEnvironments(highestLevel)` `@/data/environments` — `{ id, name, unlockLevel, top, bottom, accent, decoration }`.
- `characterVariants`, `getCharacterVariant(id)` `@/data/characters`.
- `bundledLevels`, `getLevelByNumber(n)` `@/data/bundledLevels`.
- `formatTime(ms)` `@/utils/formatting`; `buildDailyShareText(data)` `@/utils/shareText`.

## Accessibility
Every touchable needs `accessibilityRole` + `accessibilityLabel`. Min touch
target 44pt. Direction never by color alone. Respect `useReducedMotionPref()`
for non-essential animation.

## Navigation map (routes that exist or will)
`/home`, `/game?level=N`, `/daily`, `/tutorial`, `/levels`, `/results`,
`/stats`, `/customize`, `/settings`, `/about`, `/privacy`, `/onboarding`.
Use `router.push`/`router.replace`. Do not invent routes not in this list.
