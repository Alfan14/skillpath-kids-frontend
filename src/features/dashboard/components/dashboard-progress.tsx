import Link from 'next/link';
import { ChevronRight, History as HistoryIcon, AlertCircle, ClipboardCheck } from 'lucide-react';
import { SkillProgressBar } from '@/components/ui/skill-progress-bar';
import { Button } from '@/components/ui/button';
import { HistoryResult } from '@/types';

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

export async function DashboardProgress() {
  let history: HistoryResult[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/history?limit=1`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      history = json.data || [];
    }
  } catch (err) {
    // suppress errors to avoid raw JSON in UX
  }

  if (history.length === 0) {
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
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-secondary shadow-[0_4px_0_0_#e8c426]">
            <ClipboardCheck className="h-8 w-8 text-on-surface" aria-hidden="true" />
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

  const latest = history[0];
  const motorik = latest.skillsData?.motorik ?? 0;
  const bahasa = latest.skillsData?.bahasa ?? 0;
  const sosial = latest.skillsData?.sosial ?? 0;

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