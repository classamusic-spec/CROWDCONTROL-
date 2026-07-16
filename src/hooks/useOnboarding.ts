import { useAppState } from '@/hooks/AppState';

/** Onboarding + tutorial completion state and setters. */
export function useOnboarding() {
  const { onboarding, completeOnboarding, completeTutorial } = useAppState();
  return { onboarding, completeOnboarding, completeTutorial };
}
