import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSettings } from '@/hooks/useSettings';

/**
 * The effective reduced-motion preference: true if EITHER the OS accessibility
 * setting or the in-app Settings toggle asks to reduce motion.
 */
export function useReducedMotionPref(): boolean {
  const osReduced = useReducedMotion();
  const { settings } = useSettings();
  return osReduced || settings.reducedMotion;
}
