'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'skillpathkids_sound_enabled';

type UiSoundTone = 'tap' | 'success' | 'soft';

const TONES: Record<UiSoundTone, { frequency: number; duration: number; volume: number }> = {
  tap: { frequency: 520, duration: 0.055, volume: 0.035 },
  success: { frequency: 720, duration: 0.085, volume: 0.045 },
  soft: { frequency: 420, duration: 0.07, volume: 0.028 },
};

function readStoredPreference() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(STORAGE_KEY) !== 'false';
}

function shouldSkipSound(enabled: boolean) {
  if (!enabled || typeof window === 'undefined' || typeof document === 'undefined') return true;
  if (document.visibilityState !== 'visible') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function useUiSound() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    setIsSoundEnabled(readStoredPreference());
  }, []);

  const playTone = useCallback((tone: UiSoundTone) => {
    if (shouldSkipSound(isSoundEnabled)) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const config = TONES[tone];
      const now = context.currentTime;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(config.frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(config.volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + config.duration + 0.02);

      oscillator.onended = () => {
        void context.close();
      };
    } catch {
      // Sound is decorative. Audio errors should never interrupt the UI.
    }
  }, [isSoundEnabled]);

  const playTap = useCallback(() => playTone('tap'), [playTone]);
  const playSuccess = useCallback(() => playTone('success'), [playTone]);
  const playSoft = useCallback(() => playTone('soft'), [playTone]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((current) => {
      const next = !current;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

  return { playTap, playSuccess, playSoft, isSoundEnabled, toggleSound };
}
