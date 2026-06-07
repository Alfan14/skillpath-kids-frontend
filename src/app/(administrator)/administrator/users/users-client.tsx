'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Filter, ShieldAlert, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getAdminUsers } from '@/actions/admin-actions';
import { getToken, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { AdminUsersData } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';

export function UsersClient() {
  const router = useRouter();
  
  const [data, setData] = useState<AdminUsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [role, setRole] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when role changes
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

  const roleColors: Record<string, string> = {
    ADMINISTRATOR: 'bg-error-container text-error',
    TEACHER: 'bg-primary-container text-on-primary-container',
    PARENT: 'bg-secondary-container text-on-secondary-container',
    STUDENT: 'bg-tertiary-container text-on-tertiary-container',
  };

  const defaultPagination = {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };
  const users = data?.users ?? [];
  const pagination = data?.pagination ?? defaultPagination;

  const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">Kelola Users</h1>
          <p className="text-sm text-on-surface-variant">Daftar semua pengguna terdaftar di platform.</p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-container-highest bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative shrink-0 w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-container-highest bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="Semua">Semua Role</option>
            <option value="PARENT">Parent</option>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      {error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] bg-error-container/20 border-2 border-dashed border-error/50">
          <ShieldAlert className="h-12 w-12 text-error mb-4" />
          <h3 className="text-lg font-black text-on-surface mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-on-surface-variant mb-6">{error}</p>
          <Button onClick={fetchData} variant="outline">Coba Lagi</Button>
        </div>
      ) : (
        <div className="rounded-[22px] border border-outline-variant/30 bg-white shadow-[0_4px_16px_rgba(0,93,167,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-lowest text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {loading && !data ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Tidak ada pengguna ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-[11px] font-black text-on-surface">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface leading-tight">{user.name || '-'}</p>
                            <p className="text-[10px] text-on-surface-variant">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium">{user.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${roleColors[user.role] || 'bg-surface-container text-on-surface'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant text-[12px]">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/20 bg-surface-container-lowest">
              <span className="text-xs text-on-surface-variant font-medium">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 h-auto text-xs"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 h-auto text-xs"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
