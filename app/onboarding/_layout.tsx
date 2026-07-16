import { Stack } from 'expo-router';

import { palette } from '@/data/theme';

/** Onboarding stack — no headers, navy background so there is never a white flash. */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.primaryNavy },
        animation: 'fade',
      }}
    />
  );
}
