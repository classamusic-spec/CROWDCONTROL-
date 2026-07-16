import { useCallback } from 'react';

import { soundSources, type SoundId } from '@/data/audio';
import { useSettings } from '@/hooks/useSettings';

/**
 * Sound playback that respects the Settings > Sound toggle. Placeholder audio
 * is not yet bundled (see docs/AUDIO_GENERATION_QUEUE.md); when a source is
 * null this is a no-op. When real files are added, this loads and plays them
 * with expo-audio. Kept guarded so the app never crashes on missing audio.
 */
export function useAudio() {
  const { settings } = useSettings();

  const play = useCallback(
    (id: SoundId) => {
      if (!settings.sound) return;
      const source = soundSources[id];
      if (source == null) return; // placeholder not yet available
      try {
        // Lazy require so the app has no hard dependency on audio being present.
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const { createAudioPlayer } = require('expo-audio') as {
          createAudioPlayer: (s: unknown) => { play: () => void; remove: () => void };
        };
        const player = createAudioPlayer(source);
        player.play();
      } catch {
        // ignore playback errors — audio is non-essential
      }
    },
    [settings.sound],
  );

  return { play };
}
