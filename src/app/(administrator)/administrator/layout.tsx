'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  HelpCircle,
  Lightbulb,
  FileText,
  LogOut,
  Users,
  ClipboardCheck,
} from 'lucide-react';

import { getSession, logout } from '@/lib/auth';

interface LayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

export default function TeacherLayout({
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

    if (user.role !== 'ADMINISTRATOR') {
      router.push('/');
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
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-outline-variant/30 flex-col">
        <div className="p-6 border-b border-outline-variant/30">
          <h1 className="text-xl font-black italic text-primary">
            SkillPath Admin
          </h1>

          <p className="text-xs text-on-surface-variant font-bold mt-1">
            Mode Administrator
          </p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/administrator/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/administrator/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <Users className="w-5 h-5" />
            Kelola Users
          </Link>

          <Link
            href="/administrator/assessments"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <ClipboardCheck className="w-5 h-5" />
            Hasil Asesmen
          </Link>

          <Link
            href="/administrator/questions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Kelola Pertanyaan
          </Link>

          <Link
            href="/administrator/tips"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <Lightbulb className="w-5 h-5" />
            Kelola Tips
          </Link>

          <Link
            href="/administrator/files"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-primary-container hover:text-primary-on-container font-bold transition-colors"
          >
            <FileText className="w-5 h-5" />
            Kelola Files
          </Link>
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
              {session.name.charAt(0)}
            </div>

            <div>
              <p className="text-sm font-bold text-on-surface">
                {session.name}
              </p>

              <p className="text-xs text-on-surface-variant">
                {session.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-outline-variant/30 bg-white shadow-sm flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">
            SkillPath Admin
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
