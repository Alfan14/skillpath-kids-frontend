'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  GraduationCap,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  User,
  Users,
} from 'lucide-react';

import {
  getTeacherResults,
  TeacherResultsError,
  type Pagination,
  type TeacherResult,
} from '@/actions/teacher-actions';
import { Button } from '@/components/ui/button';
import { useUiSound } from '@/hooks/use-ui-sound';
import { APP_IMAGES } from '@/lib/assets';
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

function getScoreColor(score: number) {
  if (score >= 85) return 'bg-[#96f89f] text-[#00531d]';
  if (score >= 70) return 'bg-[#ffe173] text-[#0f1d24]';
  return 'bg-[#ffd6d6] text-[#ba1a1a]';
}

function normalizeScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function getSkillLabel(key: string) {
  const labels: Record<string, string> = {
    bahasa: 'Bahasa',
    sosial: 'Sosial',
    motorik: 'Motorik',
    pedagogi: 'Pedagogi',
    pedagogy: 'Pedagogi',
    observasi: 'Observasi',
    observation: 'Observasi',
    komunikasi: 'Komunikasi',
    communication: 'Komunikasi',
    evaluasi: 'Evaluasi',
    evaluation: 'Evaluasi',
    classroom_management: 'Classroom Management',
  };

  return labels[key] ?? key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSkillIcon(skill: string) {
  const normalized = skill.toLowerCase();

  if (normalized.includes('pedagog')) return GraduationCap;
  if (normalized.includes('observ')) return Eye;
  if (normalized.includes('komunik') || normalized.includes('communication')) return MessageCircle;
  if (normalized.includes('evalu')) return BarChart3;
  if (normalized.includes('class') || normalized.includes('kelas')) return Users;

  return ClipboardCheck;
}

export function TeacherResultsClient() {
  const { playTap, playSuccess } = useUiSound();
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

  const handleRetry = useCallback(() => {
    if (loading) return;
    playTap();
    fetchResults();
  }, [fetchResults, loading, playTap]);

  const handlePreviousPage = useCallback(() => {
    if (loading || pagination.page <= 1) return;
    playTap();
    setPage((current) => Math.max(1, current - 1));
  }, [loading, pagination.page, playTap]);

  const handleNextPage = useCallback(() => {
    if (loading || pagination.page >= pagination.totalPages) return;
    playTap();
    setPage((current) => current + 1);
  }, [loading, pagination.page, pagination.totalPages, playTap]);

  const hasResults = results.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-fade-up overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Teacher Results
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Observasi Kelas
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#004883] sm:text-3xl">
              Hasil Assessment Guru
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-[#004883]">
              Lihat rangkuman observasi dan perkembangan berdasarkan assessment yang telah dilakukan.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRetry}
              disabled={loading}
              className="press-soft mt-4 border-[#004883]/30 bg-white text-[#004883] transition-transform duration-150 motion-reduce:transition-none"
            >
              Coba Lagi
            </Button>
          </div>

          <Image
            src={APP_IMAGES.teacherResultsIllustration}
            alt="Ilustrasi hasil assessment guru"
            width={280}
            height={220}
            priority
            className="animate-float-soft mx-auto h-auto w-full max-w-[190px] shrink-0 motion-reduce:animate-none sm:mx-0 sm:max-w-[240px]"
          />
        </div>
      </section>

      {loading && !hasResults ? (
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-3 rounded-[22px] border border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4e3ff]">
            <Loader2 className="h-7 w-7 animate-spin text-[#004883]" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-on-surface-variant">Memuat hasil assessment...</p>
        </div>
      ) : error ? (
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border border-[#ffd6d6] bg-white p-8 text-center shadow-[0_12px_32px_rgba(186,26,26,0.06)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            {accessDenied ? (
              <ShieldAlert className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-black text-on-surface">
              {accessDenied ? 'Akses Ditolak' : 'Gagal Memuat Data'}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
          </div>
          {!accessDenied && (
            <Button
              type="button"
              variant="outline"
              icon={RefreshCw}
              onClick={handleRetry}
              disabled={loading}
              className="press-soft transition-transform duration-150 motion-reduce:transition-none"
            >
              Coba Lagi
            </Button>
          )}
        </div>
      ) : !hasResults ? (
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
          <Image
            src={APP_IMAGES.teacherEmptyState}
            alt="Ilustrasi hasil assessment guru kosong"
            width={220}
            height={180}
            className="h-auto w-full max-w-[180px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[220px]"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-black text-on-surface">Belum ada hasil assessment guru</h2>
            <p className="max-w-md text-sm text-on-surface-variant">
              Mulai assessment untuk melihat hasil observasi perkembangan anak.
            </p>
          </div>
          <Link
            href="/teacher/assessment"
            onClick={playSuccess}
            className="press-soft inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#004883] px-5 py-3 text-sm font-black text-white shadow-[0_4px_0_0_#002f55] transition-transform duration-150 hover:translate-y-[1px] motion-reduce:transition-none"
          >
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Mulai Assessment
          </Link>
        </div>
      ) : (
        <div className="animate-fade-up overflow-hidden rounded-[22px] border border-[#d4e3ff] bg-white shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
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
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-[14px] text-lg font-black ${getScoreColor(score)}`}>
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
                                className="inline-flex items-center gap-1 rounded-lg bg-[#ffe173] px-2 py-1 text-[11px] font-bold text-[#0f1d24] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                              >
                                <Target className="h-3 w-3" aria-hidden="true" />
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
                          <div className="flex min-w-52 flex-col gap-3">
                            {skillEntries.map(([skill, value]) => {
                              const SkillIcon = getSkillIcon(skill);
                              const normalizedScore = normalizeScore(value);

                              return (
                                <div key={`${item.id}-${skill}`} className="grid gap-1.5">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface">
                                      <SkillIcon className="h-3.5 w-3.5 text-[#004883]" aria-hidden="true" />
                                      {getSkillLabel(skill)}
                                    </span>
                                    <span className="rounded-md bg-[#d4e3ff] px-2 py-0.5 text-xs font-black text-[#004883]">
                                      {normalizedScore}
                                    </span>
                                  </div>
                                  <div className="h-2 overflow-hidden rounded-full bg-[#d4e3ff]/55">
                                    <div
                                      className="progress-motion h-full rounded-full bg-[#004883]"
                                      style={{ width: `${normalizedScore}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
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
                className="press-soft h-9 rounded-xl px-3 transition-transform duration-150 motion-reduce:transition-none"
                disabled={loading || pagination.page <= 1}
                onClick={handlePreviousPage}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="press-soft h-9 rounded-xl px-3 transition-transform duration-150 motion-reduce:transition-none"
                disabled={loading || pagination.page >= pagination.totalPages}
                onClick={handleNextPage}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasResults && (
        <div className="animate-fade-up grid gap-3 md:grid-cols-3">
          {results.slice(0, 3).map((item, index) => {
            const score = getScore(item.overallScore);
            return (
              <div
                key={`summary-${item.id}`}
                className="rounded-[18px] border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 motion-reduce:transition-none"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  {index === 0 ? (
                    <Image
                      src={APP_IMAGES.teacherGuidanceIllustration}
                      alt=""
                      width={76}
                      height={60}
                      className="h-auto w-full max-w-[56px]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d4e3ff]">
                      <BarChart3 className="h-5 w-5 text-[#004883]" aria-hidden="true" />
                    </div>
                  )}
                  <span className={`rounded-[14px] px-3 py-2 text-lg font-black ${getScoreColor(score)}`}>
                    {score}
                  </span>
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
