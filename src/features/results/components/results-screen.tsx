'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, AlertCircle, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, KidCard } from '@/components/ui/card';
import { BadgePill } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SkillProgressBar } from '@/components/ui/skill-progress-bar';
import type { HistoryResult, SkillResult } from '@/types';

function scoreToStatus(score: number): 'excellent' | 'warning' | 'low' {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'warning';
  return 'low';
}

function getBarColor(status: string) {
  if (status === 'Bagus') return 'text-tertiary';
  if (status === 'Cukup') return 'text-secondary';
  return 'text-error';
}

interface ResultsScreenProps {
  assessmentPath?: string;
  recommendationsPath?: string;
  title?: string;
  subtitle?: string;
}

export function ResultsScreen({
  assessmentPath = '/assessment',
  recommendationsPath = '/tips',
  title = 'Hasil Motorik Anak',
  subtitle = 'Mari lihat perkembangan si kecil hari ini.',
}: ResultsScreenProps = {}) {
  const [result, setResult] = useState<HistoryResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('assessment_result');
      if (raw) setResult(JSON.parse(raw));
    } catch {
      // Corrupt data
    }
  }, []);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-container">
          <AlertCircle className="w-8 h-8 text-on-secondary-container" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">No assessment yet</h2>
        <p className="text-on-surface-variant">It looks like you haven't completed an assessment for your child.</p>
        <Button variant="primary" asChild>
          <Link href={assessmentPath}>Start Assessment</Link>
        </Button>
      </div>
    );
  }

  const overallScore = result.overallScore ?? 0;
  const category     = result.categoryResult ?? 'Unknown';
  const focusSummary = result.focusSummary ?? '';
  const focusAreas   = result.focusAreas && result.focusAreas.length > 0 
    ? result.focusAreas 
    : [];

  const motorikScore = result.skillsData?.motorik ?? 0;
  const bahasaScore = result.skillsData?.bahasa ?? 0;
  const sosialScore = result.skillsData?.sosial ?? 0;

  const skills: SkillResult[] = [
    {
      label: "Motorik",
      score: motorikScore,
      status: scoreToStatus(motorikScore) as any,
      color: 'bg-surface-container',
      barColor: getBarColor(scoreToStatus(motorikScore))
    },
    {
      label: "Bahasa & Komunikasi",
      score: bahasaScore,
      status: scoreToStatus(bahasaScore) as any,
      color: 'bg-surface-container',
      barColor: getBarColor(scoreToStatus(bahasaScore))
    },
    {
      label: "Sosial & Emosional",
      score: sosialScore,
      status: scoreToStatus(sosialScore) as any,
      color: 'bg-surface-container',
      barColor: getBarColor(scoreToStatus(sosialScore))
    }
  ];

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-secondary-container">
          <Trophy className="w-10 h-10 text-on-secondary-container" aria-hidden="true" />
        </div>
        <BadgePill color="neutral" className="gap-1">
          ✓ Asesmen Selesai!
        </BadgePill>
        <h1 className="text-3xl font-black italic text-primary">
          {title}
        </h1>
        <p className="text-on-surface-variant">{subtitle}</p>
      </div>

      {/* ── Score cards row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

        {/* Overall score */}
        <Card className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Kategori Keseluruhan
          </h2>
          <div className="flex items-center gap-4">
            <ProgressRing value={overallScore} size={96} />
            <div className="flex flex-col gap-2">
              <BadgePill color="warning">{category}</BadgePill>
              <p className="text-sm text-on-surface-variant leading-snug">
                Motorik anak berada pada kategori{' '}
                <strong className="text-secondary">&ldquo;{category}&rdquo;</strong>.
                Terdapat potensi besar untuk berkembang lebih jauh.
              </p>
            </div>
          </div>
        </Card>

        {/* Focus area */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-container">
              <AlertCircle className="w-5 h-5 text-on-secondary-container" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black italic text-on-surface">Area Perhatian</h2>
          </div>
          <p className="text-sm text-on-surface-variant italic">
            &ldquo;{focusSummary}&rdquo;
          </p>
          <div className="flex flex-wrap gap-2">
            {focusAreas.length > 0 ? (
              focusAreas.map((area) => (
                <BadgePill key={area} color="neutral">{area}</BadgePill>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">Keep exploring daily activities!</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Skill breakdown ────────────────────────────────────────────────── */}
      <Card className="w-full flex flex-col gap-5">
        <h2 className="flex items-center gap-2 text-xl font-black italic text-on-surface">
          <LineChart className="w-5 h-5 text-primary" aria-hidden="true" />
          Rincian Keterampilan
        </h2>
        {skills.map((skill) => (
          <SkillProgressBar
            key={skill.label}
            label={skill.label}
            value={skill.score}
            status={scoreToStatus(skill.score)}
          />
        ))}
      </Card>

      <div className="flex flex-col gap-3 w-full">
        <Button variant="primary" size="lg" className="w-full" asChild>
          <Link href={recommendationsPath}>Lanjut ke Rekomendasi →</Link>
        </Button>
        <Button variant="ghost" size="md" className="w-full text-primary font-bold">
          Unduh Hasil PDF
        </Button>
      </div>

      <footer className="text-center text-xs text-on-surface-variant pb-4">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
