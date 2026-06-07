'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, History as HistoryIcon, AlertCircle, ClipboardCheck } from 'lucide-react';
import { SkillProgressBar } from '@/components/ui/skill-progress-bar';
import { Button } from '@/components/ui/button';
import {
  getParentResults,
  ParentResultsError,
  type ParentResult,
} from '@/actions/parent-actions';
import { getSession, getToken, logout } from '@/lib/auth';
import { safeParseObject } from '@/lib/result-parsers';

function scoreToStatusConfig(score: number): 'excellent' | 'warning' | 'low' | 'new' {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'warning';
  if (score > 0) return 'low';
  return 'new';
}

function getRecommendation(skill: string, score: number): string {
  if (score >= 80) return 'Pertahankan aktivitas fisik!';
  if (score >= 50) return 'Bagus, terus tingkatkan dengan latihan rutin.';
  if (score > 0) return 'Coba lebih sering melatih area ini hari ini.';
  return 'Mulai aktivitas untuk area ini.';
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container">
              <HistoryIcon className="h-4 w-4 text-primary" aria-hidden="true" />
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container">
              <HistoryIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            Progress Anak
          </h2>
        </div>

        {/* empty state card */}
        <div className="flex flex-col items-center justify-center gap-5 rounded-[22px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)]">
            <ClipboardCheck className="h-8 w-8 text-[#0f1d24]" aria-hidden="true" />
          </div>
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
  const motorik = skillsData.motorik ?? skillsData.motorikKasar ?? 0;
  const bahasa = skillsData.bahasa ?? 0;
  const sosial = skillsData.sosial ?? 0;

  const progressData = [
    { label: 'Motorik', value: motorik, status: scoreToStatusConfig(motorik), recommendation: getRecommendation('Motorik', motorik) },
    { label: 'Bahasa & Komunikasi', value: bahasa, status: scoreToStatusConfig(bahasa), recommendation: getRecommendation('Bahasa', bahasa) },
    { label: 'Sosial & Emosional', value: sosial, status: scoreToStatusConfig(sosial), recommendation: getRecommendation('Sosial', sosial) },
  ];

  return (
    <section aria-labelledby="progress-heading" className="flex flex-col gap-4">

      {/* section header */}
      <div className="flex items-center justify-between">
        <h2
          id="progress-heading"
          className="flex items-center gap-2 text-xl font-black text-on-surface"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container">
            <HistoryIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          Progress Anak
        </h2>
        <Link
          href="/results/history"
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
        {progressData.map((item) => (
          <div
            key={item.label}
            className="
              flex min-w-[260px] sm:min-w-0 snap-center flex-col gap-4
              rounded-[20px] border border-outline-variant/30
              bg-white p-5
              shadow-[0_4px_16px_rgba(0,93,167,0.07)]
            "
          >
            <SkillProgressBar label={item.label} value={item.value} status={item.status} />
            <div className="mt-auto border-t border-outline-variant/20 pt-3">
              <p className="line-clamp-2 text-xs text-on-surface-variant">
                <span className="font-bold text-on-surface">Saran: </span>
                {item.recommendation}
              </p>
            </div>
          </div>
        ))}
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
