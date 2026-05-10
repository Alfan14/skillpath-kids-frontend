'use client';

import { useState } from 'react';
import type { ChildProfile } from '@/types';

/**
 * useChildProfile — returns the active child's profile.
 *
 * Currently returns a hardcoded default.
 * Replace the `useState` initial value with a real fetch
 * once auth + a user API endpoint are wired up:
 *
 *   const [profile, setProfile] = useState<ChildProfile | null>(null);
 *   useEffect(() => { fetch('/api/user/profile').then(...) }, []);
 */
export function useChildProfile() {
  const [profile] = useState<ChildProfile>({
    id: 'demo-child-001',
    name: 'Si Kecil',
    ageMonths: 42, // 3.5 years
    avatarUrl: undefined,
  });

  return { profile };
}
