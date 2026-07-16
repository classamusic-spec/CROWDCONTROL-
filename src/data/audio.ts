/**
 * Sound effect registry. Audio files are placeholders queued for production
 * (see docs/AUDIO_GENERATION_QUEUE.md). Until real files are dropped into
 * assets/audio/, sources are null and playback is a guarded no-op — settings
 * (sound/music) still gate it, so the wiring is complete and testable.
 *
 * To enable a sound: add the file at assets/audio/sfx_<id>.m4a and change its
 * entry below to `require('../../assets/audio/sfx_<id>.m4a')`.
 */

export type SoundId =
  | 'button'
  | 'exit'
  | 'blocked'
  | 'undo'
  | 'restart'
  | 'hint'
  | 'starreveal'
  | 'levelcomplete'
  | 'dailystreak'
  | 'rewardunlock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const soundSources: Record<SoundId, any | null> = {
  button: null,
  exit: null,
  blocked: null,
  undo: null,
  restart: null,
  hint: null,
  starreveal: null,
  levelcomplete: null,
  dailystreak: null,
  rewardunlock: null,
};

export const ALL_SOUND_IDS: SoundId[] = Object.keys(soundSources) as SoundId[];
