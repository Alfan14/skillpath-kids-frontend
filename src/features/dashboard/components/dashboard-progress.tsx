'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  LineChart,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getParentResults,
  ParentResultsError,
  type ParentResult,
} from '@/actions/parent-actions';
import { getSession, getToken, logout } from '@/lib/auth';
import { safeParseObject } from '@/lib/result-parsers';
import { APP_IMAGES } from '@/lib/assets';

function getRecommendation(skill: string, score: number): string {
  if (score >= 80) return 'Pertahankan aktivitas fisik!';
  if (score >= 50) return 'Bagus, terus tingkatkan dengan latihan rutin.';
  if (score > 0) return 'Coba lebih sering melatih area ini hari ini.';
  return 'Mulai aktivitas untuk area ini.';
}

function normalizeScore(score: unknown) {
  const numericScore = Number(score) || 0;
  return Math.max(0, Math.min(100, Math.round(numericScore)));
}

function getProgressTone(score: number): {
  label: string;
  Icon: LucideIcon;
  barClassName: string;
  badgeClassName: string;
} {
  if (score >= 85) {
    return {
      label: 'Sangat Baik',
      Icon: CheckCircle2,
      barClassName: 'bg-[#96f89f]',
      badgeClassName: 'bg-[#96f89f] text-[#00531d]',
    };
  }

  if (score >= 70) {
    return {
      label: 'Perlu Perhatian',
      Icon: AlertTriangle,
      barClassName: 'bg-[#ffe173]',
      badgeClassName: 'bg-[#ffe173] text-[#0f1d24]',
    };
  }

  return {
    label: 'Butuh Dukungan',
    Icon: AlertCircle,
    barClassName: 'bg-[#ffd6d6]',
    badgeClassName: 'bg-[#ffd6d6] text-[#ba1a1a]',
  };
}

function readStoredResult(): ParentResult | null {
  try {
    const raw = sessionStorage.getItem('assessment_result');
    return raw ? (JSON.parse(raw) as ParentResult) : null;
  } catch {
    return null;
  }
}

export function DashboardProgress() {
  const [latestResult, setLatestResult] = useState<ParentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchLatestResult() {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        if (active) {
          setLatestResult(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getParentResults({ page: 1, limit: 1 }, token);
        if (!active) return;

        setLatestResult(response.data.results[0] ?? null);
      } catch (err) {
        if (!active) return;

        const session = getSession();
        const storedResult = readStoredResult();

        if (err instanceof ParentResultsError && err.status === 401) {
          logout();
          return;
        }

        if (err instanceof ParentResultsError && err.status === 403) {
          if (session?.role === 'STUDENT') {
            setLatestResult(storedResult);
            setError(null);
          } else {
            setLatestResult(null);
            setError('Akses ditolak. Anda tidak memiliki izin untuk melihat hasil asesmen.');
          }
          return;
        }

        setLatestResult(storedResult);
        if (!storedResult) {
          setError('Gagal memuat progress asesmen.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchLatestResult();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <DashboardProgressSkeleton />;
  }

  if (error && !latestResult) {
    return (
      <section aria-labelledby="progress-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2
            id="progress-heading"
            className="flex items-center gap-2 text-xl font-black text-on-surface"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4e3ff]">
              <LineChart className="h-4 w-4 text-[#004883]" aria-hidden="true" />
            </div>
            Progress Anak
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed border-error/30 bg-white p-8 text-center">
          <AlertCircle className="h-10 w-10 text-error" aria-hidden="true" />
          <p className="text-base font-bold text-on-surface">{error}</p>
        </div>
      </section>
    );
  }

  if (!latestResult) {
    return (
      <section aria-labelledby="progress-heading" className="flex flex-col gap-4">

        {/* section header */}
        <div className="flex items-center justify-between">
          <h2
            id="progress-heading"
            className="flex items-center gap-2 text-xl font-black text-on-surface"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4e3ff]">
              <LineChart className="h-4 w-4 text-[#004883]" aria-hidden="true" />
            </div>
            Progress Anak
          </h2>
        </div>

        {/* empty state card */}
        <div className="flex flex-col items-center justify-center gap-5 rounded-[22px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-8 text-center">
          <Image
            src={APP_IMAGES.emptyAssessment}
            alt="Ilustrasi belum ada asesmen"
            width={240}
            height={180}
            className="h-auto w-full max-w-[170px] transition-transform duration-300 motion-safe:hover:-translate-y-1 sm:max-w-[220px]"
          />
          <div>
            <p className="text-base font-bold text-on-surface">Belum ada asesmen</p>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              Mulai asesmen pertama si Kecil dan pantau perkembangannya! 🌱
            </p>
          </div>
          <Button
            variant="primary"
            className="rounded-[18px] font-black px-8"
            asChild
          >
            <Link href="/assessment">Mulai Asesmen</Link>
          </Button>
        </div>
      </section>
    );
  }

  const skillsData = safeParseObject(latestResult.skillsData);
  const motorik = normalizeScore(skillsData.motorik ?? skillsData.motorikKasar ?? 0);
  const bahasa = normalizeScore(skillsData.bahasa ?? 0);
  const sosial = normalizeScore(skillsData.sosial ?? 0);

  const progressData = [
    { label: 'Motorik', value: motorik, Icon: Activity, recommendation: getRecommendation('Motorik', motorik) },
    { label: 'Bahasa & Komunikasi', value: bahasa, Icon: MessageCircle, recommendation: getRecommendation('Bahasa', bahasa) },
    { label: 'Sosial & Emosional', value: sosial, Icon: HeartHandshake, recommendation: getRecommendation('Sosial', sosial) },
  ];

  return (
    <section aria-labelledby="progress-heading" className="flex flex-col gap-4">

      {/* section header */}
      <div className="flex items-center justify-between">
        <h2
          id="progress-heading"
          className="flex items-center gap-2 text-xl font-black text-on-surface"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4e3ff]">
            <LineChart className="h-4 w-4 text-[#004883]" aria-hidden="true" />
          </div>
          Progress Anak
        </h2>
        <Link
          href="/results"
          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
        >
          Lihat Riwayat
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* skill cards */}
      <div className="
        flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4
        sm:grid sm:grid-cols-2 lg:grid-cols-3
        sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0
      ">
        {progressData.map((item) => {
          const tone = getProgressTone(item.value);
          const StatusIcon = tone.Icon;
          const SkillIcon = item.Icon ?? BarChart3;

          return (
          <div
            key={item.label}
            className="
              relative flex min-w-[260px] sm:min-w-0 snap-center flex-col gap-4 overflow-hidden
              rounded-[24px] border border-[#d4e3ff]
              bg-white p-5
              shadow-[0_10px_28px_rgba(0,72,131,0.08)]
            "
          >
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#d4e3ff]">
                  <SkillIcon className="h-5 w-5 text-[#004883]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black text-on-surface">{item.label}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-on-surface-variant">Progress keterampilan</p>
                </div>
              </div>
              <span className="shrink-0 text-lg font-black text-[#004883]">{item.value}%</span>
            </div>

            <div className="relative">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#d4e3ff]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${tone.barClassName}`}
                  style={{ width: `${item.value}%` }}
                  role="progressbar"
                  aria-label={`${item.label} ${item.value}%`}
                  aria-valuenow={item.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <div className={`relative inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black ${tone.badgeClassName}`}>
              <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tone.label}</span>
            </div>

            <div className="relative mt-auto border-t border-outline-variant/20 pt-3">
              <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                <span className="font-bold text-on-surface">Saran: </span>
                {item.recommendation || 'Lanjutkan aktivitas stimulasi sesuai kebutuhan anak.'}
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}

export function DashboardProgressSkeleton() {
  return (
    <section className="flex flex-col gap-4 animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 rounded-xl bg-surface-container-high" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-[20px] bg-surface-container-high" />
        ))}
      </div>
    </section>
  );
}
