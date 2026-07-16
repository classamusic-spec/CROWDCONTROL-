import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

import { useSettings } from '@/hooks/useSettings';

export type HapticKind = 'light' | 'medium' | 'success' | 'warning' | 'error';

/**
 * Haptic feedback that respects the Settings > Haptics toggle. All calls are
 * fire-and-forget and never throw (Haptics is unavailable on some devices).
 */
export function useHaptics() {
  const { settings } = useSettings();
  const enabled = settings.haptics;

  const trigger = useCallback(
    (kind: HapticKind) => {
      if (!enabled) return;
      try {
        switch (kind) {
          case 'light':
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'success':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      } catch {
        // ignore — haptics are non-essential
      }
    },
    [enabled],
  );

  return { trigger };
}
