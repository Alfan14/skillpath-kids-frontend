'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Filter,
  GraduationCap,
  HeartHandshake,
  LineChart,
  Loader2,
  MessageCircle,
  SearchCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';

import { getAdminAssessments } from '@/actions/admin-actions';
import type { AdminAssessmentsData } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getToken, logout } from '@/lib/auth';

type AssessmentItem = AdminAssessmentsData['assessments'][number];

const ROLE_OPTIONS = [
  { value: 'Semua', label: 'Semua Role' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'TEACHER', label: 'Teacher' },
];

const CATEGORY_OPTIONS = [
  { value: 'Semua', label: 'Semua Kategori' },
  { value: 'Sangat Baik', label: 'Sangat Baik' },
  { value: 'Baik', label: 'Baik' },
  { value: 'Cukup', label: 'Cukup' },
  { value: 'Perlu Perhatian', label: 'Perlu Perhatian' },
  { value: 'Perlu Bantuan', label: 'Perlu Bantuan' },
];

const ROLE_STYLES: Record<string, string> = {
  ADMINISTRATOR: 'bg-[#ffd6d6] text-[#ba1a1a]',
  TEACHER: 'bg-[#d4e3ff] text-[#004883]',
  PARENT: 'bg-[#ffe173] text-[#0f1d24]',
  STUDENT: 'bg-[#96f89f] text-[#00531d]',
};

function safeParseObject(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== 'string') return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function safeParseFocusAreas(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    // Plain text fallback below.
  }

  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatKey(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function clampScore(value: unknown) {
  const raw = typeof value === 'object' && value !== null && 'score' in value
    ? (value as { score?: unknown }).score
    : value;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function getNullableScore(item: AssessmentItem) {
  if (item.overallScore === null || item.overallScore === undefined || item.overallScore === '') {
    return null;
  }

  const parsed = Number(item.overallScore);
  return Number.isFinite(parsed) ? parsed : null;
}

function getScoreStyle(score: number | null) {
  if (score === null) return 'bg-[#e5e7eb] text-[#374151]';
  if (score >= 85) return 'bg-[#96f89f] text-[#00531d]';
  if (score >= 70) return 'bg-[#ffe173] text-[#0f1d24]';
  return 'bg-[#ffd6d6] text-[#ba1a1a]';
}

function getCategoryStyle(category: string | null | undefined) {
  const value = String(category ?? '').toLowerCase();
  if (value.includes('sangat') || value === 'excellent') return 'bg-[#96f89f] text-[#00531d]';
  if (value === 'baik' || value.includes('cukup')) return 'bg-[#ffe173] text-[#0f1d24]';
  if (value.includes('bantuan') || value.includes('perhatian') || value === 'low' || value === 'warning') {
    return 'bg-[#ffd6d6] text-[#ba1a1a]';
  }
  return 'bg-[#e5e7eb] text-[#374151]';
}

function getAssessmentUserName(item: AssessmentItem) {
  return item.userName ?? item.user?.name ?? '-';
}

function getAssessmentUserEmail(item: AssessmentItem) {
  return item.userEmail ?? item.user?.email ?? '-';
}

function getAssessmentUserRole(item: AssessmentItem) {
  return item.userRole ?? item.user?.role ?? '-';
}

function getAssessmentChildName(item: AssessmentItem) {
  return item.childName ?? item.childProfile?.name ?? '-';
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

function RoleBadge({ role }: { role: string }) {
  const className = ROLE_STYLES[role] ?? 'bg-[#e5e7eb] text-[#374151]';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${className}`}>
      {role || '-'}
    </span>
  );
}

export function AssessmentsClient() {
  const router = useRouter();

  const [data, setData] = useState<AdminAssessmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<string>('Semua');
  const [categoryResult, setCategoryResult] = useState<string>('Semua');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem | null>(null);

  useEffect(() => {
    setPage(1);
  }, [role, categoryResult]);

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
      const response = await getAdminAssessments(
        { role, categoryResult, page, limit },
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
        setError(err.message || 'Terjadi kesalahan saat memuat hasil asesmen.');
      }
    } finally {
      setLoading(false);
    }
  }, [role, categoryResult, page, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const defaultPagination = {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };
  const assessments = data?.assessments ?? [];
  const pagination = data?.pagination ?? defaultPagination;
  const isFilterActive = role !== 'Semua' || categoryResult !== 'Semua';

  const pageStats = useMemo(() => {
    const scores = assessments
      .map(getNullableScore)
      .filter((score): score is number => score !== null);
    const average = scores.length
      ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      : null;

    return {
      average,
      parent: assessments.filter((item) => getAssessmentUserRole(item) === 'PARENT').length,
      teacher: assessments.filter((item) => getAssessmentUserRole(item) === 'TEACHER').length,
      student: assessments.filter((item) => getAssessmentUserRole(item) === 'STUDENT').length,
    };
  }, [assessments]);

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-64 animate-pulse rounded-[28px] bg-[#d4e3ff]" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Assessment Monitoring
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Progress & Skill Data
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883]">
              Hasil Assessment
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Pantau hasil asesmen Parent, Student, dan Teacher secara terpusat.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <SummaryCard icon={ClipboardCheck} label="Total Data" value={pagination.total} tone="blue" />
              <SummaryCard icon={TrendingUp} label="Rata-rata Page" value={pageStats.average === null ? '-' : `${pageStats.average}%`} tone="green" />
              <SummaryCard icon={UserRound} label="Parent Page" value={pageStats.parent} tone="yellow" />
              <SummaryCard icon={GraduationCap} label="Teacher Page" value={pageStats.teacher} tone="purple" />
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminAssessmentMonitoring}
            alt="Ilustrasi monitoring assessment administrator"
            width={340}
            height={270}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[200px] shrink-0 motion-reduce:animate-none sm:max-w-[240px] lg:mx-0 lg:max-w-[320px]"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-56">
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

          <div className="relative w-full sm:w-64">
            <SearchCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
            <select
              value={categoryResult}
              onChange={(event) => setCategoryResult(event.target.value)}
              className="w-full appearance-none rounded-xl border border-[#d4e3ff] bg-surface-container-lowest py-3 pl-9 pr-9 text-sm font-bold outline-none transition-all focus:border-[#004883] focus:ring-2 focus:ring-[#004883]/15"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-on-surface-variant" aria-hidden="true" />
          </div>

          <div className="flex flex-1 items-center rounded-xl bg-[#d4e3ff]/45 px-4 py-3 text-xs font-bold text-[#004883]">
            Data halaman ini: {assessments.length} item. Total pagination: {pagination.total}.
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#ffd6d6] bg-white p-8 text-center shadow-[0_16px_40px_rgba(186,26,26,0.06)]">
          <Image
            src={APP_IMAGES.adminEmptyState}
            alt="Ilustrasi error assessment"
            width={220}
            height={180}
            className="mb-4 h-auto w-full max-w-[190px]"
          />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-lg font-black text-on-surface">Gagal Memuat Data</h3>
          <p className="mb-6 max-w-md text-sm text-on-surface-variant">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Coba Lagi
          </Button>
        </div>
      ) : assessments.length === 0 ? (
        <EmptyAssessmentState isFilterActive={isFilterActive} />
      ) : (
        <section className="overflow-hidden rounded-[24px] border border-[#d4e3ff] bg-white shadow-[0_12px_32px_rgba(0,72,131,0.07)]">
          <div className="border-b border-[#d4e3ff] bg-surface-container-lowest px-5 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-black text-on-surface">Daftar Hasil Assessment</h2>
                <p className="text-xs text-on-surface-variant">
                  Monitoring read-only dari endpoint Admin Assessments.
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
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Anak</th>
                  <th className="px-5 py-4 text-center">Score</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Ringkasan Fokus</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4e3ff]">
                {assessments.map((item) => (
                  <AssessmentRow
                    key={item.id}
                    item={item}
                    onDetail={setSelectedAssessment}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {assessments.map((item) => (
              <AssessmentMobileCard
                key={item.id}
                item={item}
                onDetail={setSelectedAssessment}
              />
            ))}
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

      {selectedAssessment && (
        <AssessmentDetailModal
          item={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const toneClass = {
    blue: 'bg-[#d4e3ff] text-[#004883]',
    green: 'bg-[#96f89f] text-[#00531d]',
    yellow: 'bg-[#ffe173] text-[#0f1d24]',
    purple: 'bg-[#f3e8ff] text-[#6b21a8]',
  }[tone];

  return (
    <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)] transition-all duration-200 hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-black text-[#0f1d24]">{value}</p>
          <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
        </div>
      </div>
    </div>
  );
}

function AssessmentRow({
  item,
  onDetail,
}: {
  item: AssessmentItem;
  onDetail: (item: AssessmentItem) => void;
}) {
  const score = getNullableScore(item);
  const role = getAssessmentUserRole(item);

  return (
    <tr className="transition-colors hover:bg-[#d4e3ff]/25">
      <td className="px-5 py-4">
        <div className="flex min-w-0 flex-col">
          <span className="font-black leading-tight text-on-surface">{getAssessmentUserName(item)}</span>
          <span className="truncate text-xs text-on-surface-variant">{getAssessmentUserEmail(item)}</span>
          <div className="mt-2">
            <RoleBadge role={role} />
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-xs font-bold text-on-surface-variant">
        {getAssessmentChildName(item)}
      </td>
      <td className="px-5 py-4 text-center">
        <span className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-sm font-black ${getScoreStyle(score)}`}>
          {score === null ? '-' : Math.round(score)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${getCategoryStyle(item.categoryResult)}`}>
          {item.categoryResult || '-'}
        </span>
      </td>
      <td className="max-w-[240px] px-5 py-4">
        <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
          {item.focusSummary || 'Belum ada ringkasan fokus.'}
        </p>
      </td>
      <td className="px-5 py-4 text-xs font-bold text-on-surface-variant">
        {formatDate(item.createdAt)}
      </td>
      <td className="px-5 py-4 text-right">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg px-3 text-xs"
          onClick={() => onDetail(item)}
        >
          Detail
        </Button>
      </td>
    </tr>
  );
}

function AssessmentMobileCard({
  item,
  onDetail,
}: {
  item: AssessmentItem;
  onDetail: (item: AssessmentItem) => void;
}) {
  const score = getNullableScore(item);
  const role = getAssessmentUserRole(item);

  return (
    <article className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_8px_22px_rgba(0,72,131,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-black text-on-surface">{getAssessmentUserName(item)}</p>
          <p className="truncate text-xs text-on-surface-variant">{getAssessmentUserEmail(item)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <RoleBadge role={role} />
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${getCategoryStyle(item.categoryResult)}`}>
              {item.categoryResult || '-'}
            </span>
          </div>
        </div>
        <span className={`inline-flex min-w-14 justify-center rounded-full px-3 py-1 text-sm font-black ${getScoreStyle(score)}`}>
          {score === null ? '-' : Math.round(score)}
        </span>
      </div>
      <div className="grid gap-2 rounded-xl bg-surface-container-lowest p-3 text-xs text-on-surface-variant">
        <p><span className="font-black text-on-surface">Anak:</span> {getAssessmentChildName(item)}</p>
        <p><span className="font-black text-on-surface">Tanggal:</span> {formatDate(item.createdAt)}</p>
        <p className="line-clamp-2"><span className="font-black text-on-surface">Fokus:</span> {item.focusSummary || 'Belum ada ringkasan fokus.'}</p>
      </div>
      <Button
        variant="outline"
        className="mt-3 w-full rounded-xl"
        onClick={() => onDetail(item)}
      >
        Lihat Detail
      </Button>
    </article>
  );
}

function AssessmentDetailModal({
  item,
  onClose,
}: {
  item: AssessmentItem;
  onClose: () => void;
}) {
  const score = getNullableScore(item);
  const focusAreas = safeParseFocusAreas(item.focusAreas);
  const skillsData = safeParseObject(item.skillsData);
  const skillEntries = Object.entries(skillsData);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f1d24]/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-[24px] bg-white shadow-[0_24px_70px_rgba(15,29,36,0.24)]">
        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-[#d4e3ff] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${getScoreStyle(score)}`}>
              {score === null ? '-' : Math.round(score)}
            </div>
            <div>
              <h2 className="text-lg font-black text-on-surface">Detail Hasil Assessment</h2>
              <p className="text-xs text-on-surface-variant">{formatDate(item.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:bg-surface-container-low"
            aria-label="Tutup detail assessment"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid gap-5">
            <section className="grid gap-3 md:grid-cols-2">
              <InfoPanel title="Informasi User" icon={UserRound}>
                <InfoRow label="Nama" value={getAssessmentUserName(item)} />
                <InfoRow label="Email" value={getAssessmentUserEmail(item)} />
                <InfoRow label="Role" value={getAssessmentUserRole(item)} />
                <InfoRow label="Anak" value={getAssessmentChildName(item)} />
              </InfoPanel>

              <InfoPanel title="Ringkasan Hasil" icon={BarChart3}>
                <InfoRow label="Score" value={score === null ? '-' : `${Math.round(score)} / 100`} />
                <InfoRow label="Kategori" value={item.categoryResult || '-'} />
                <InfoRow label="Tanggal" value={formatDate(item.createdAt)} />
              </InfoPanel>
            </section>

            <section className="rounded-2xl border border-[#d4e3ff] bg-[#d4e3ff]/35 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-black text-[#004883]">
                <LineChart className="h-4 w-4" aria-hidden="true" />
                Focus Summary
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {item.focusSummary || 'Tidak ada summary tersedia.'}
              </p>
            </section>

            <section className="rounded-2xl border border-[#96f89f] bg-[#96f89f]/25 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-[#00531d]">
                <Target className="h-4 w-4" aria-hidden="true" />
                Area Fokus
              </h3>
              {focusAreas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <span key={area} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#00531d] shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      {area}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">Belum ada area fokus khusus.</p>
              )}
            </section>

            <section className="rounded-2xl border border-[#d4e3ff] bg-white p-4">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-on-surface">
                <Activity className="h-4 w-4 text-[#004883]" aria-hidden="true" />
                Rincian Keterampilan
              </h3>
              {skillEntries.length > 0 ? (
                <div className="grid gap-3">
                  {skillEntries.map(([skill, value]) => {
                    const normalizedScore = clampScore(value);
                    const SkillIcon = getSkillIcon(skill);

                    return (
                      <div key={skill} className="rounded-2xl border border-[#d4e3ff] bg-surface-container-lowest p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d4e3ff] text-[#004883]">
                              <SkillIcon className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <span className="truncate text-sm font-black text-on-surface">{formatKey(skill)}</span>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${getScoreStyle(normalizedScore)}`}>
                            {normalizedScore}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                          <div
                            className="h-full rounded-full bg-[#004883] transition-[width] duration-500"
                            style={{ width: `${normalizedScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl bg-surface-container-lowest p-3 text-sm text-on-surface-variant">
                  Data detail keterampilan belum tersedia.
                </p>
              )}
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#d4e3ff] p-4 text-right">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_8px_22px_rgba(0,72,131,0.05)]">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-on-surface">
        <Icon className="h-4 w-4 text-[#004883]" aria-hidden="true" />
        {title}
      </h3>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-lowest px-3 py-2 text-sm">
      <span className="font-bold text-on-surface-variant">{label}</span>
      <span className="truncate text-right font-black text-on-surface">{value}</span>
    </div>
  );
}

function EmptyAssessmentState({ isFilterActive }: { isFilterActive: boolean }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
      <Image
        src={APP_IMAGES.adminEmptyState}
        alt="Ilustrasi hasil assessment kosong"
        width={220}
        height={180}
        className="mb-4 h-auto w-full max-w-[190px]"
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4e3ff] text-[#004883]">
        <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-black text-on-surface">
        {isFilterActive ? 'Tidak ada hasil untuk filter ini.' : 'Belum ada hasil assessment'}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
        {isFilterActive
          ? 'Coba ubah filter role atau kategori hasil.'
          : 'Data hasil akan muncul setelah pengguna menyelesaikan assessment.'}
      </p>
    </div>
  );
}

function getSkillIcon(skill: string) {
  const value = skill.toLowerCase();
  if (value.includes('bahasa') || value.includes('communication')) return MessageCircle;
  if (value.includes('sosial') || value.includes('heart')) return HeartHandshake;
  if (value.includes('motorik') || value.includes('activity')) return Activity;
  if (value.includes('kognitif') || value.includes('brain')) return Brain;
  if (value.includes('classroom') || value.includes('teacher')) return BookOpen;
  return BarChart3;
}
