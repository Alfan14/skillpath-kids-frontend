'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAdminUsers } from '@/actions/admin-actions';
import type { AdminUsersData } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getToken, logout } from '@/lib/auth';

type AdminUser = AdminUsersData['users'][number];

const ROLE_OPTIONS = [
  { value: 'Semua', label: 'Semua Role' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'ADMINISTRATOR', label: 'Administrator' },
];

const ROLE_STYLES: Record<string, { badge: string; avatar: string; label: string }> = {
  ADMINISTRATOR: {
    badge: 'bg-[#ffd6d6] text-[#ba1a1a]',
    avatar: 'bg-[#ffd6d6] text-[#ba1a1a]',
    label: 'Administrator',
  },
  TEACHER: {
    badge: 'bg-[#d4e3ff] text-[#004883]',
    avatar: 'bg-[#d4e3ff] text-[#004883]',
    label: 'Teacher',
  },
  PARENT: {
    badge: 'bg-[#ffe173] text-[#0f1d24]',
    avatar: 'bg-[#ffe173] text-[#0f1d24]',
    label: 'Parent',
  },
  STUDENT: {
    badge: 'bg-[#96f89f] text-[#00531d]',
    avatar: 'bg-[#96f89f] text-[#00531d]',
    label: 'Student',
  },
};

const UNKNOWN_ROLE_STYLE = {
  badge: 'bg-[#e5e7eb] text-[#374151]',
  avatar: 'bg-[#e5e7eb] text-[#374151]',
  label: 'Unknown',
};

function getRoleStyle(role: string | null | undefined) {
  return ROLE_STYLES[String(role ?? '').toUpperCase()] ?? UNKNOWN_ROLE_STYLE;
}

function getInitial(user: AdminUser) {
  const source = user.name?.trim() || user.email?.trim() || 'U';
  return source.charAt(0).toUpperCase();
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function UserIdentity({ user }: { user: AdminUser }) {
  const roleStyle = getRoleStyle(user.role);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${roleStyle.avatar}`}>
        {getInitial(user)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-black leading-tight text-on-surface">{user.name || '-'}</p>
        <p className="truncate text-xs font-medium text-on-surface-variant">{user.email || '-'}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const roleStyle = getRoleStyle(role);

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${roleStyle.badge}`}>
      {roleStyle.label}
    </span>
  );
}

export function UsersClient() {
  const router = useRouter();

  const [data, setData] = useState<AdminUsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [role]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        logout();
        router.push('/login');
        return;
      }
      const response = await getAdminUsers(
        { role, search: debouncedSearch, page, limit },
        token
      );
      setData(response);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('sesi') || err.message.toLowerCase().includes('unauthorized')) {
        logout();
        router.push('/login');
      } else if (err.message.includes('403') || err.message.toLowerCase().includes('forbidden')) {
        setError('Akses ditolak. Anda tidak memiliki izin.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat memuat users.');
      }
    } finally {
      setLoading(false);
    }
  }, [role, debouncedSearch, page, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const defaultPagination = {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };
  const users = data?.users ?? [];
  const pagination = data?.pagination ?? defaultPagination;
  const activeRoleLabel = ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                User Management
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Role-based Access
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883]">
              Kelola Users
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Pantau akun Parent, Student, Teacher, dan Administrator dalam satu halaman.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4e3ff] text-[#004883]">
                    <Users className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#0f1d24]">{pagination.total}</p>
                    <p className="text-[11px] font-bold text-on-surface-variant">Total hasil</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#96f89f] text-[#00531d]">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#0f1d24]">{users.length}</p>
                    <p className="text-[11px] font-bold text-on-surface-variant">Ditampilkan</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe173] text-[#0f1d24]">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0f1d24]">{activeRoleLabel}</p>
                    <p className="text-[11px] font-bold text-on-surface-variant">Filter role</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminUsersManagement}
            alt="Ilustrasi manajemen users administrator"
            width={340}
            height={270}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[200px] shrink-0 motion-reduce:animate-none sm:max-w-[240px] lg:mx-0 lg:max-w-[320px]"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari nama atau email user..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#d4e3ff] bg-surface-container-lowest py-3 pl-9 pr-4 text-sm outline-none transition-all focus:border-[#004883] focus:ring-2 focus:ring-[#004883]/15"
            />
          </div>
          <div className="relative w-full shrink-0 sm:w-56">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full appearance-none rounded-xl border border-[#d4e3ff] bg-surface-container-lowest py-3 pl-9 pr-9 text-sm font-bold outline-none transition-all focus:border-[#004883] focus:ring-2 focus:ring-[#004883]/15"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-on-surface-variant" aria-hidden="true" />
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#ffd6d6] bg-white p-8 text-center shadow-[0_16px_40px_rgba(186,26,26,0.06)]">
          <Image
            src={APP_IMAGES.adminEmptyState}
            alt="Ilustrasi error data users"
            width={220}
            height={180}
            className="mb-4 h-auto w-full max-w-[190px]"
          />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-lg font-black text-on-surface">Gagal Memuat Data</h3>
          <p className="mb-6 max-w-md text-sm text-on-surface-variant">{error}</p>
          <Button onClick={fetchData} variant="outline" icon={RefreshCw}>
            Coba Lagi
          </Button>
        </div>
      ) : (
        <section className="overflow-hidden rounded-[24px] border border-[#d4e3ff] bg-white shadow-[0_12px_32px_rgba(0,72,131,0.07)]">
          <div className="border-b border-[#d4e3ff] bg-surface-container-lowest px-5 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-black text-on-surface">Daftar Users</h2>
                <p className="text-xs text-on-surface-variant">
                  Menampilkan data real dari endpoint Admin Users.
                </p>
              </div>
              {loading && data ? (
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#004883]">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Memperbarui data
                </span>
              ) : null}
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Tanggal Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e3ff]">
                {loading && !data ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4" colSpan={4}>
                        <div className="h-10 animate-pulse rounded-xl bg-[#d4e3ff]/55" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <EmptyUsersState hasFilter={Boolean(search || role !== 'Semua')} />
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-[#d4e3ff]/25">
                      <td className="px-6 py-4">
                        <UserIdentity user={user} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-on-surface-variant">{user.email || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {loading && !data ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl bg-[#d4e3ff]/55" />
              ))
            ) : users.length === 0 ? (
              <EmptyUsersState hasFilter={Boolean(search || role !== 'Semua')} />
            ) : (
              users.map((user) => (
                <article key={user.id} className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_8px_22px_rgba(0,72,131,0.06)]">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <UserIdentity user={user} />
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="rounded-xl bg-surface-container-lowest px-3 py-2 text-xs font-bold text-on-surface-variant">
                    Bergabung: {formatDate(user.createdAt)}
                  </div>
                </article>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#d4e3ff] bg-surface-container-lowest px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-bold text-on-surface-variant">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-auto rounded-xl px-3 py-2 text-xs"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  className="h-auto rounded-xl px-3 py-2 text-xs"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function EmptyUsersState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Image
        src={APP_IMAGES.adminEmptyState}
        alt="Ilustrasi data users kosong"
        width={220}
        height={180}
        className="mb-4 h-auto w-full max-w-[180px]"
      />
      <h3 className="text-lg font-black text-on-surface">Belum ada user ditemukan</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
        {hasFilter
          ? 'Coba ubah filter atau kata kunci pencarian.'
          : 'Data user akan muncul setelah akun terdaftar.'}
      </p>
    </div>
  );
}
