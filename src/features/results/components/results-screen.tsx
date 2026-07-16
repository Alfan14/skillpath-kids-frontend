'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, CheckCircle2, LineChart, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, KidCard } from '@/components/ui/card';
import { BadgePill } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import {
  getParentResults,
  ParentResultsError,
  type ParentResult,
} from '@/actions/parent-actions';
import { getSession, getToken, logout } from '@/lib/auth';
import { formatSkillLabel, safeParseArray, safeParseObject } from '@/lib/result-parsers';
import { APP_IMAGES } from '@/lib/assets';
import { useUiSound } from '@/hooks/use-ui-sound';

function getScore(value: ParentResult['overallScore']) {
  const score = Number(value ?? 0);
  return Number.isFinite(score) ? Math.round(score) : 0;
}

function getResultIllustration(score: number, category: string) {
  const normalizedCategory = category.toLowerCase();

  if (score >= 76 || normalizedCategory.includes('sangat baik')) {
    return APP_IMAGES.resultGoodScore;
  }

  if (score <= 25 || normalizedCategory.includes('belum')) {
    return APP_IMAGES.resultNeedAttention;
  }

  return APP_IMAGES.resultReport;
}

function normalizeSkillScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStageIconPath(stage: string | null) {
  if (stage === 'BSB') return '/images/BSB-Icon-Berkembang-Sangat-Baik.png';
  if (stage === 'BSH') return '/images/BSH-Icon-Berkembang-Sesuai-Harapan.png';
  if (stage === 'MB') return '/images/MB-Icon-Mulai-Berkembang.png';
  if (stage === 'BB') return '/images/BB-Icon-Belum-Berkembang.png';
  return null;
}

function getSkillStatus(score: number) {
  if (score >= 76) {
    return {
      label: 'Berkembang Sangat Baik',
      icon: CheckCircle2,
      barClassName: 'bg-[#d4e3ff]',
      textClassName: 'text-[#004883]',
    };
  }

  if (score >= 51) {
    return {
      label: 'Berkembang Sesuai Harapan',
      icon: CheckCircle2,
      barClassName: 'bg-[#96f89f]',
      textClassName: 'text-[#00531d]',
    };
  }

  if (score >= 26) {
    return {
      label: 'Mulai Berkembang',
      icon: AlertTriangle,
      barClassName: 'bg-[#ffe173]',
      textClassName: 'text-[#0f1d24]',
    };
  }

  return {
    label: 'Belum Berkembang',
    icon: AlertTriangle,
    barClassName: 'bg-[#ffd6d6]',
    textClassName: 'text-[#ba1a1a]',
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
  const { playTap, playSuccess } = useUiSound();

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
      <div className="animate-fade-up flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm font-bold text-on-surface-variant">Memuat hasil asesmen...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="animate-fade-up flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Image
          src={APP_IMAGES.emptyAssessment}
          alt="Ilustrasi belum ada hasil asesmen"
          width={240}
          height={180}
          className="animate-float-soft h-auto w-full max-w-[170px] sm:max-w-[220px]"
        />
        <h2 className="text-xl font-bold text-on-surface">Belum ada hasil asesmen</h2>
        <p className="max-w-md text-on-surface-variant">
          {error ?? "It looks like you haven't completed an assessment for your child."}
        </p>
        <Button variant="primary" className="press-soft" asChild>
          <Link href={assessmentPath} onClick={playSuccess}>Mulai Asesmen</Link>
        </Button>
      </div>
    );
  }

  const overallScore = getScore(result.overallScore);
  const category     = result.categoryResult ?? 'Unknown';
  const developmentStage = result.developmentStage ?? null;
  const focusSummary = result.focusSummary ?? '';
  const focusAreas = safeParseArray(result.focusAreas);
  const skillEntries = Object.entries(safeParseObject(result.skillsData));
  const resultIllustration = getResultIllustration(overallScore, category);
  const stageIcon = getStageIconPath(developmentStage);

  let devLabel = category;
  let devDesc = 'Terdapat potensi besar untuk berkembang lebih jauh.';
  let devColor: 'danger' | 'warning' | 'success' | 'primary' | 'neutral' = 'neutral';

  if (developmentStage === 'BSB') {
    devLabel = 'Berkembang Sangat Baik';
    devDesc = 'Anak sudah mandiri, konsisten, dan mampu berkreasi lebih atau membantu temannya.';
    devColor = 'primary';
  } else if (developmentStage === 'BSH') {
    devLabel = 'Berkembang Sesuai Harapan';
    devDesc = 'Anak sudah dapat melakukannya secara mandiri dan konsisten.';
    devColor = 'success';
  } else if (developmentStage === 'MB') {
    devLabel = 'Mulai Berkembang';
    devDesc = 'Anak sudah mulai bisa tetapi masih harus diingatkan atau dibantu oleh pendidik.';
    devColor = 'warning';
  } else if (developmentStage === 'BB') {
    devLabel = 'Belum Berkembang';
    devDesc = 'Anak masih harus dicontohkan dan didampingi penuh oleh guru/orang tua.';
    devColor = 'danger';
  } else if (category && category !== 'Unknown') {
    devLabel = category;
    if (overallScore >= 76) devColor = 'primary';
    else if (overallScore >= 51) devColor = 'success';
    else if (overallScore >= 26) devColor = 'warning';
    else devColor = 'danger';
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="animate-fade-up flex flex-col items-center gap-3 pt-4 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-secondary-container">
          {stageIcon ? (
            <Image src={stageIcon} alt={devLabel} width={64} height={64} className="drop-shadow-sm" priority />
          ) : (
            <Trophy className="w-10 h-10 text-on-secondary-container" aria-hidden="true" />
          )}
        </div>
        <BadgePill color="neutral" className="gap-1">
          ✓ Asesmen Selesai!
        </BadgePill>
        <h1 className="text-3xl font-black italic text-primary">
          {title}
        </h1>
        <p className="text-on-surface-variant">{subtitle}</p>
        <Image
          src={resultIllustration}
          alt="Ilustrasi hasil asesmen anak"
          width={260}
          height={210}
          priority
          className="animate-float-soft h-auto w-full max-w-[180px] sm:max-w-[220px]"
        />
      </div>

      {/* ── Score cards row ────────────────────────────────────────────────── */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Overall score */}
        <Card className="animate-fade-up flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Kategori Keseluruhan
          </h2>
          <div className="flex items-center gap-4">
            <ProgressRing value={overallScore} size={96} />
            <div className="flex flex-col gap-2">
              <BadgePill color={devColor} className="w-fit flex items-center gap-1.5 px-3 py-1 text-[11px]">
                {stageIcon && <Image src={stageIcon} alt={devLabel} width={20} height={20} />}
                {devLabel}
              </BadgePill>
              <p className="text-sm text-on-surface-variant leading-snug">
                {devDesc}
              </p>
            </div>
          </div>
        </Card>

        {/* Focus area */}
        <Card className="animate-fade-up flex flex-col gap-3">
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
                <BadgePill
                  key={area}
                  color="neutral"
                  className="transition-transform duration-150 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                >
                  {area}
                </BadgePill>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">Keep exploring daily activities!</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Skill breakdown ────────────────────────────────────────────────── */}
      <Card className="animate-fade-up flex w-full flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-black italic text-on-surface">
            <LineChart className="w-5 h-5 text-primary" aria-hidden="true" />
            Rincian Keterampilan
          </h2>
          <Image
            src={APP_IMAGES.resultReport}
            alt=""
            width={92}
            height={72}
            className="hidden h-auto w-16 shrink-0 transition-transform duration-300 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:block"
          />
        </div>
        {skillEntries.length > 0 ? (
          <div className="grid gap-4">
            {skillEntries.map(([skill, score]) => {
              const normalizedScore = normalizeSkillScore(score);
              const status = getSkillStatus(normalizedScore);
              const StatusIcon = status.icon;

              return (
                <div
                  key={skill}
                  className="hover-lift-soft rounded-3xl border border-[#d4e3ff] bg-white p-4 shadow-[0_8px_20px_rgba(0,72,131,0.06)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-on-surface">
                      {formatSkillLabel(skill)}
                    </span>
                    <span className={`text-sm font-black ${status.textClassName}`}>
                      {normalizedScore}%
                    </span>
                  </div>

                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#d4e3ff]">
                    <div
                      className={`progress-motion h-full rounded-full ${status.barClassName}`}
                      style={{ width: `${normalizedScore}%` }}
                      role="progressbar"
                      aria-label={`${formatSkillLabel(skill)} ${normalizedScore}%`}
                      aria-valuenow={normalizedScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>

                  <div className={`mt-3 flex items-center gap-2 text-xs font-bold ${status.textClassName}`}>
                    <StatusIcon className="h-4 w-4" aria-hidden="true" />
                    <span>{status.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">Data keterampilan belum tersedia.</p>
        )}
      </Card>

      <div className="animate-fade-up flex w-full flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          className="press-soft w-full"
          onClick={playSuccess}
          asChild
        >
          <Link href={recommendationsPath}>Lanjut ke Rekomendasi →</Link>
        </Button>
      </div>

      <footer className="text-center text-xs text-on-surface-variant pb-4">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
