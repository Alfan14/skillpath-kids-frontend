import Link from 'next/link';
import { ChevronRight, History as HistoryIcon, AlertCircle } from 'lucide-react';
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
        <div className="flex items-center justify-between mb-2">
          <h2 id="progress-heading" className="flex items-center gap-2 text-xl font-bold text-on-surface">
            <HistoryIcon className="w-6 h-6 text-primary" />
            Progress Anak
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-card text-center gap-4 shadow-soft">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-container">
            <AlertCircle className="w-6 h-6 text-on-secondary-container" />
          </div>
          <p className="text-on-surface-variant max-w-sm">
            Si Kecil hasn't taken an assessment yet. Start their journey today.
          </p>
          <Button variant="primary" asChild>
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
      <div className="flex items-center justify-between mb-2">
        <h2 id="progress-heading" className="flex items-center gap-2 text-xl font-bold text-on-surface">
          <HistoryIcon className="w-6 h-6 text-primary" />
          Progress Anak
        </h2>
        <Link href="/results/history" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
          Lihat Riwayat
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0">
        {progressData.map((item) => (
          <div key={item.label} className="flex flex-col gap-4 min-w-[280px] sm:min-w-0 snap-center bg-card p-5 rounded-card shadow-soft border border-outline-variant/30">
            <SkillProgressBar label={item.label} value={item.value} status={item.status} />
            <div className="mt-auto pt-3 border-t border-outline-variant/20">
              <p className="text-xs text-on-surface-variant line-clamp-2">
                <span className="font-semibold text-on-surface">Saran:</span> {item.recommendation}
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
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-40 bg-surface-container-high rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-surface-container-high rounded-card" />
        ))}
      </div>
    </section>
  );
}
