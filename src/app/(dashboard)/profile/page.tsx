'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, ShieldCheck, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSession, logout, type User as AuthUser } from '@/lib/auth';

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || 'Pengguna';
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getRoleLabel(role?: AuthUser['role']) {
  if (role === 'PARENT') return 'Parent';
  if (role === 'STUDENT') return 'Student';
  return role ?? '-';
}

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthUser | null>(null);

  useEffect(() => {
    const user = getSession();

    if (!user) {
      router.push('/login');
      return;
    }

    setSession(user);
  }, [router]);

  if (!session) {
    return (
      <div className="rounded-[24px] border border-[#d4e3ff] bg-white p-6 text-sm font-bold text-on-surface-variant">
        Memuat profil...
      </div>
    );
  }

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="rounded-[28px] border border-[#d4e3ff] bg-white p-6 shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#d4e3ff] text-xl font-black text-[#004883]">
              {getInitials(session.name, session.email)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Profil Akun</p>
              <h1 className="truncate text-2xl font-black text-on-surface">{session.name || 'Pengguna'}</h1>
              <p className="truncate text-sm font-semibold text-on-surface-variant">{session.email || '-'}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="danger"
            icon={LogOut}
            className="rounded-[16px] px-5 font-black"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-[#d4e3ff] bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#d4e3ff] text-[#004883]">
            <UserCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-black uppercase tracking-wide text-on-surface-variant">Nama</p>
          <p className="mt-1 text-sm font-black text-on-surface">{session.name || 'Pengguna'}</p>
        </div>

        <div className="rounded-[22px] border border-[#d4e3ff] bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#ffe173] text-[#0f1d24]">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-black uppercase tracking-wide text-on-surface-variant">Email</p>
          <p className="mt-1 truncate text-sm font-black text-on-surface">{session.email || '-'}</p>
        </div>

        <div className="rounded-[22px] border border-[#d4e3ff] bg-white p-5 sm:col-span-2">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#96f89f] text-[#00531d]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-black uppercase tracking-wide text-on-surface-variant">Role</p>
          <p className="mt-1 text-sm font-black text-on-surface">{getRoleLabel(session.role)}</p>
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            Halaman ini hanya menampilkan informasi akun dari sesi login. Edit profil belum tersedia.
          </p>
        </div>
      </div>
    </section>
  );
}
