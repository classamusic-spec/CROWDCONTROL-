import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { AnimatedSplash } from '@/components/branding/AnimatedSplash';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

/**
 * Standalone route that replays the animated splash (e.g. from Settings) and
 * returns home when it finishes. Reduced motion shows the final composition and
 * finishes quickly (handled inside AnimatedSplash).
 */
export default function SplashRoute() {
  const router = useRouter();
  const reducedMotion = useReducedMotionPref();

  const handleDone = useCallback(() => {
    router.replace('/home' as never);
  }, [router]);

  return <AnimatedSplash reducedMotion={reducedMotion} onDone={handleDone} />;
}
