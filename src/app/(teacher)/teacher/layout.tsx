'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  Lightbulb,
  LogOut,
} from 'lucide-react';

import { getSession, logout } from '@/lib/auth';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', href: '/teacher/dashboard', icon: Home },
  { label: 'Assessment', href: '/teacher/assessment', icon: ClipboardCheck },
  { label: 'Results', href: '/teacher/results', icon: BarChart3 },
  { label: 'Tips', href: '/teacher/tips', icon: Lightbulb },
  { label: 'Files', href: '/worksheets', icon: FileText },
];

export default function TeacherLayout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const user = getSession();

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'TEACHER') {
      router.push('/');
      return;
    }

    setSession(user);
    setLoading(false);
  }, [router]);

  if (loading || !session) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/teacher/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-white">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-base font-black italic text-primary">SkillPath Teacher</h1>
              <p className="text-[11px] font-bold text-on-surface-variant">Advanced assessment mode</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-full text-error hover:bg-error-container"
            aria-label="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 flex flex-col gap-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-black transition-colors',
                    active
                      ? 'bg-primary text-white shadow-[0_4px_0_0_#004883]'
                      : 'bg-white text-on-surface-variant hover:bg-primary-container hover:text-primary',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-6">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/30 bg-white md:hidden">
        <div className="grid grid-cols-5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-bold',
                  active ? 'text-primary' : 'text-on-surface-variant',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
