'use client';

import { useCallback, useEffect, useState } from 'react';
import { soundService, type SoundKey } from '@/lib/sound-service';

/**
 * useSound — access the sound service from any client component.
 *
 * Usage:
 *   const { play, isMuted, toggleMute } = useSound();
 *   <button onClick={() => play('CLICK')}>...</button>
 */
export function useSound() {
  const [isMuted, setIsMuted] = useState(false);

  // Prime audio cache on first user gesture (runs once on mount)
  useEffect(() => {
    const prime = () => soundService.prime();
    window.addEventListener('pointerdown', prime, { once: true });
    return () => window.removeEventListener('pointerdown', prime);
  }, []);

  const play = useCallback((key: SoundKey) => {
    soundService.play(key);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !soundService.isMuted();
    soundService.setMuted(next);
    setIsMuted(next);
    if (!next) soundService.play('POP');
  }, []);

  return { play, isMuted, toggleMute };
}
