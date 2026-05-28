'use client';

import { AppShell } from '@/components/layout/app-shell';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: LayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const user = getSession();

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role === 'ADMINISTRATOR') {
      router.push('/administrator/dashboard');
      return;
    }

    if (user.role === 'TEACHER') {
      router.push('/teacher/dashboard');
      return;
    }

    setSession(user);
    setLoading(false);
  }, [router]);

  if (loading || !session) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
