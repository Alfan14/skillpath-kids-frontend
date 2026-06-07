'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  ShieldAlert,
  User,
} from 'lucide-react';

import {
  getTeacherResults,
  TeacherResultsError,
  type Pagination,
  type TeacherResult,
} from '@/actions/teacher-actions';
import { Button } from '@/components/ui/button';
import { getToken, logout } from '@/lib/auth';

const fallbackPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function parseFocusAreas(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  if (typeof value !== 'string' || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

function parseSkillsData(value: unknown): Record<string, number> {
  const raw = typeof value === 'string' ? safeJsonParse(value) : value;

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  return Object.entries(raw).reduce<Record<string, number>>((acc, [key, item]) => {
    const score =
      typeof item === 'number'
        ? item
        : item && typeof item === 'object' && 'score' in item
          ? Number((item as { score?: unknown }).score)
          : Number(item);

    if (Number.isFinite(score)) acc[key] = score;
    return acc;
  }, {});
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
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

function getScore(value: TeacherResult['overallScore']) {
  const score = Number(value ?? 0);
  return Number.isFinite(score) ? Math.round(score) : 0;
}

function getCategoryColor(category?: string | null) {
  if (category === 'Sangat Baik' || category === 'Bagus') {
    return 'bg-tertiary-container text-tertiary';
  }
  if (category === 'Cukup' || category === 'Perlu Perhatian') {
    return 'bg-secondary-container text-on-secondary-container';
  }
  if (category === 'Perlu Bantuan' || category === 'Perlu Latihan') {
    return 'bg-error-container text-error';
  }
  return 'bg-surface-container text-on-surface-variant';
}

function getSkillLabel(key: string) {
  const labels: Record<string, string> = {
    bahasa: 'Bahasa',
    sosial: 'Sosial',
    motorik: 'Motorik',
  };

  return labels[key] ?? key;
}

export function TeacherResultsClient() {
  const [results, setResults] = useState<TeacherResult[]>([]);
  const [pagination, setPagination] = useState<Pagination>(fallbackPagination);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);

    try {
      const token = getToken();

      if (!token) {
        logout();
        return;
      }

      const response = await getTeacherResults({ page, limit: fallbackPagination.limit }, token);

      setResults(response.data.results ?? []);
      setPagination(response.data.pagination ?? fallbackPagination);
    } catch (err) {
      if (err instanceof TeacherResultsError && err.status === 401) {
        logout();
        return;
      }

      if (err instanceof TeacherResultsError && err.status === 403) {
        setAccessDenied(true);
        setError('Akses ditolak. Anda tidak memiliki izin untuk melihat hasil assessment guru.');
        return;
      }

      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat hasil assessment.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const hasResults = results.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">Teacher results</p>
          <h1 className="mt-1 text-2xl font-black text-on-surface">Hasil Assessment Guru</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Ringkasan hasil assessment
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={fetchResults}
          disabled={loading}
        >
          Coba Lagi
        </Button>
      </div>

      {loading && !hasResults ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[20px] border border-outline-variant/30 bg-white p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm font-bold text-on-surface-variant">Memuat hasil assessment...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[20px] border border-outline-variant/30 bg-white p-8 text-center">
          {accessDenied ? (
            <ShieldAlert className="h-12 w-12 text-error" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-error" aria-hidden="true" />
          )}
          <div>
            <h2 className="text-lg font-black text-on-surface">
              {accessDenied ? 'Akses Ditolak' : 'Gagal Memuat Data'}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
          </div>
          {!accessDenied && (
            <Button type="button" variant="outline" icon={RefreshCw} onClick={fetchResults}>
              Coba Lagi
            </Button>
          )}
        </div>
      ) : !hasResults ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-outline-variant bg-white p-8 text-center">
          <ClipboardCheck className="h-12 w-12 text-on-surface-variant/40" aria-hidden="true" />
          <h2 className="text-lg font-black text-on-surface">Belum ada hasil assessment.</h2>
          <p className="max-w-md text-sm text-on-surface-variant">
            Hasil akan muncul setelah assessment guru berhasil disimpan.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-outline-variant/30 bg-white shadow-[0_4px_16px_rgba(0,93,167,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-surface-container-lowest text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="px-5 py-4">Guru</th>
                  <th className="px-5 py-4 text-center">Score</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Ringkasan</th>
                  <th className="px-5 py-4">Area Fokus</th>
                  <th className="px-5 py-4">Skills</th>
                  <th className="px-5 py-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {results.map((item) => {
                  const focusAreas = parseFocusAreas(item.focusAreas);
                  const skillsData = parseSkillsData(item.skillsData);
                  const skillEntries = Object.entries(skillsData);
                  const score = getScore(item.overallScore);

                  return (
                    <tr key={item.id} className="align-top transition-colors hover:bg-surface-container-lowest">
                      <td className="px-5 py-4">
                        <div className="flex min-w-44 flex-col gap-1">
                          <span className="inline-flex items-center gap-2 font-black text-on-surface">
                            <User className="h-4 w-4 text-primary" aria-hidden="true" />
                            {item.userName ?? '-'}
                          </span>
                          <span className="text-xs text-on-surface-variant">{item.userEmail ?? '-'}</span>
                          <span className="w-fit rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-black text-primary">
                            {item.userRole ?? 'TEACHER'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary text-lg font-black text-white">
                          {score}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ${getCategoryColor(item.categoryResult)}`}>
                          {item.categoryResult ?? '-'}
                        </span>
                      </td>
                      <td className="max-w-64 px-5 py-4 text-sm leading-relaxed text-on-surface-variant">
                        {item.focusSummary || 'Data belum tersedia.'}
                      </td>
                      <td className="px-5 py-4">
                        {focusAreas.length > 0 ? (
                          <div className="flex max-w-56 flex-wrap gap-2">
                            {focusAreas.map((area) => (
                              <span
                                key={`${item.id}-${area}`}
                                className="rounded-lg bg-secondary-container px-2 py-1 text-[11px] font-bold text-on-secondary-container"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs italic text-on-surface-variant">Data belum tersedia.</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {skillEntries.length > 0 ? (
                          <div className="flex min-w-36 flex-col gap-2">
                            {skillEntries.map(([skill, value]) => (
                              <div key={`${item.id}-${skill}`} className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold capitalize text-on-surface">
                                  {getSkillLabel(skill)}
                                </span>
                                <span className="rounded-md bg-surface-container px-2 py-0.5 text-xs font-black text-primary">
                                  {Math.round(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs italic text-on-surface-variant">Data belum tersedia.</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex whitespace-nowrap items-center gap-2 text-xs font-bold text-on-surface-variant">
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                          {formatDate(item.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-outline-variant/20 bg-surface-container-lowest px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-bold text-on-surface-variant">
              Total {pagination.total} hasil. Halaman {pagination.page} dari {pagination.totalPages || 1}.
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl px-3"
                disabled={loading || pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl px-3"
                disabled={loading || pagination.page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasResults && (
        <div className="grid gap-3 md:grid-cols-3">
          {results.slice(0, 3).map((item) => {
            const score = getScore(item.overallScore);
            return (
              <div key={`summary-${item.id}`} className="rounded-[18px] border border-outline-variant/30 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-lg font-black text-on-surface">{score}</span>
                </div>
                <p className="text-xs font-black text-on-surface">{item.categoryResult ?? '-'}</p>
                <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">
                  {item.focusSummary || 'Data belum tersedia.'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
