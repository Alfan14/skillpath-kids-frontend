'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, AlertCircle, LineChart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, KidCard } from '@/components/ui/card';
import { BadgePill } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SkillProgressBar } from '@/components/ui/skill-progress-bar';
import {
  getParentResults,
  ParentResultsError,
  type ParentResult,
} from '@/actions/parent-actions';
import { getSession, getToken, logout } from '@/lib/auth';
import { formatSkillLabel, safeParseArray, safeParseObject } from '@/lib/result-parsers';

function scoreToStatus(score: number): 'excellent' | 'warning' | 'low' {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'warning';
  return 'low';
}

function getScore(value: ParentResult['overallScore']) {
  const score = Number(value ?? 0);
  return Number.isFinite(score) ? Math.round(score) : 0;
}

function readStoredResult(): ParentResult | null {
  try {
    const raw = sessionStorage.getItem('assessment_result');
    return raw ? (JSON.parse(raw) as ParentResult) : null;
  } catch {
    return null;
  }
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
  const [result, setResult] = useState<ParentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchLatestResult() {
      setLoading(true);
      setError(null);

      const storedResult = readStoredResult();
      const token = getToken();

      if (!token) {
        if (active) {
          setResult(storedResult);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getParentResults({ page: 1, limit: 1 }, token);
        if (!active) return;

        setResult(response.data.results[0] ?? storedResult);
      } catch (err) {
        if (!active) return;

        const session = getSession();

        if (err instanceof ParentResultsError && err.status === 401) {
          logout();
          return;
        }

        if (err instanceof ParentResultsError && err.status === 403) {
          if (session?.role === 'STUDENT') {
            setResult(storedResult);
            setError(null);
          } else {
            setResult(null);
            setError('Akses ditolak. Anda tidak memiliki izin untuk melihat hasil asesmen.');
          }
          return;
        }

        setResult(storedResult);
        if (!storedResult) {
          setError('Gagal memuat hasil asesmen terbaru.');
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
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-bold text-on-surface-variant">Memuat hasil asesmen...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary-container">
          <AlertCircle className="w-8 h-8 text-on-secondary-container" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">Belum ada asesmen.</h2>
        <p className="text-on-surface-variant">
          {error ?? "It looks like you haven't completed an assessment for your child."}
        </p>
        <Button variant="primary" asChild>
          <Link href={assessmentPath}>Start Assessment</Link>
        </Button>
      </div>
    );
  }

  const overallScore = getScore(result.overallScore);
  const category     = result.categoryResult ?? 'Unknown';
  const focusSummary = result.focusSummary ?? '';
  const focusAreas = safeParseArray(result.focusAreas);
  const skillEntries = Object.entries(safeParseObject(result.skillsData));

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
        {skillEntries.length > 0 ? (
          skillEntries.map(([skill, score]) => (
            <SkillProgressBar
              key={skill}
              label={formatSkillLabel(skill)}
              value={Math.round(score)}
              status={scoreToStatus(score)}
            />
          ))
        ) : (
          <p className="text-sm text-on-surface-variant">Data keterampilan belum tersedia.</p>
        )}
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
