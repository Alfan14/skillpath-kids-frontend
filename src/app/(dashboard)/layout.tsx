'use client';

import { AppShell } from '@/components/layout/app-shell';
import { ReactNode, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

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

  const isTeacher = session.role === 'TEACHER';

  return (
    <AppShell>
      {isTeacher && (
        <div className="bg-secondary-container text-on-secondary-container p-3 text-center text-xs font-bold rounded-card mb-6 shadow-soft">
          Mode Guru Aktif — Anda sedang melihat dashboard versi Orang Tua.
          <Link
            href="/teacher/dashboard"
            className="underline text-primary ml-1"
          >
            Kembali ke Dashboard Guru
          </Link>
        </div>
      )}
      {children}
    </AppShell>
  );
}