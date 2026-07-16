import { getJSON, setJSON } from '@/storage/base';
import { STORAGE_KEYS, defaultOnboarding } from '@/storage/defaults';
import type { OnboardingState } from '@/types/storage';

export function reviveOnboarding(raw: unknown): OnboardingState {
  const r = (raw ?? {}) as Partial<OnboardingState>;
  return {
    onboardingComplete:
      typeof r.onboardingComplete === 'boolean' ? r.onboardingComplete : false,
    tutorialComplete:
      typeof r.tutorialComplete === 'boolean' ? r.tutorialComplete : false,
  };
}

export async function loadOnboarding(): Promise<OnboardingState> {
  return getJSON(STORAGE_KEYS.onboarding, defaultOnboarding, reviveOnboarding);
}

export async function saveOnboarding(state: OnboardingState): Promise<boolean> {
  return setJSON(STORAGE_KEYS.onboarding, state);
}
