'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export function useAuth( requiredRole?: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    if (
      requiredRole &&
      session.role !== requiredRole
    ) {
      router.push('/');
      return;
    }

    setUser(session);
    setLoading(false);
  }, [requiredRole, router]);

  return {
    user,
    loading,
  };
}