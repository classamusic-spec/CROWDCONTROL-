import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { AnimatedSplash } from '@/components/branding/AnimatedSplash';
import { useAppState } from '@/hooks/AppState';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

/**
 * Boot gate. Shows the animated splash while persisted state loads, then routes
 * to onboarding (first run) or home (returning user). The native splash stays
 * up until this screen's first frame, so there is no white flash anywhere.
 */
export default function Index() {
  const router = useRouter();
  const { ready, onboarding } = useAppState();
  const reducedMotion = useReducedMotionPref();
  const [splashDone, setSplashDone] = useState(false);

  const handleDone = useCallback(() => setSplashDone(true), []);

  // Route once BOTH the splash animation finished AND state is ready.
  useEffect(() => {
    if (splashDone && ready) {
      const target = onboarding.onboardingComplete ? '/home' : '/onboarding';
      router.replace(target as never);
    }
  }, [splashDone, ready, onboarding.onboardingComplete, router]);

  return <AnimatedSplash reducedMotion={reducedMotion} onDone={handleDone} />;
}
