'use client';

/**
 * Sound service — lazy-loads audio only after first user interaction.
 * Safe to import in Next.js client components (guarded by typeof window).
 */

const SOUNDS = {
  CLICK:   'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1115/1115-preview.mp3',
  UNLOCK:  'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  POP:     'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
} as const;

export type SoundKey = keyof typeof SOUNDS;

class SoundService {
  private muted = false;
  private cache: Partial<Record<SoundKey, HTMLAudioElement>> = {};
  private ready = false;

  /**
   * Call this once on the first user gesture (click / keydown).
   * Pre-warms the audio cache so subsequent plays are instant.
   */
  prime() {
    if (this.ready || typeof window === 'undefined') return;
    this.ready = true;
    for (const [key, url] of Object.entries(SOUNDS) as [SoundKey, string][]) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.load();
      this.cache[key] = audio;
    }
  }

  setMuted(isMuted: boolean) {
    this.muted = isMuted;
  }

  isMuted() {
    return this.muted;
  }

  play(key: SoundKey) {
    if (this.muted || typeof window === 'undefined') return;

    // Lazy-prime on first play if prime() was never called explicitly
    if (!this.ready) this.prime();

    try {
      const audio = this.cache[key];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Browser blocked autoplay — user hasn't interacted yet; ignore silently.
        });
      }
    } catch {
      // Non-critical; never let audio errors crash the UI.
    }
  }
}

// Singleton — safe because 'use client' ensures this only runs in the browser
export const soundService = new SoundService();
