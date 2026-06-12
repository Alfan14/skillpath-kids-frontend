'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
  Loader2,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

import { BadgePill } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_IMAGES } from '@/lib/assets';
import { getIcon, iconMap } from '@/lib/icon-map';
import type { Recommendation } from '@/types';

type TeacherTip = Recommendation & {
  benefit?: string | null;
  benefits?: string | string[] | null;
  materials?: string | string[] | null;
  steps?: string | string[] | null;
};

type TipsPayload =
  | Recommendation[]
  | {
      tips?: Recommendation[];
      data?: Recommendation[];
    };

interface TipsApiResponse {
  success?: boolean;
  message?: string;
  data?: TipsPayload;
  tips?: Recommendation[];
}

const cardPalettes = [
  { shell: 'bg-[#d4e3ff]', text: 'text-[#004883]' },
  { shell: 'bg-[#96f89f]', text: 'text-[#00531d]' },
  { shell: 'bg-[#ffe173]', text: 'text-[#0f1d24]' },
  { shell: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
];

function normalizeTips(payload: TipsApiResponse | null): Recommendation[] {
  const data = payload?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tips)) return data.tips;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(payload?.tips)) return payload.tips;

  return [];
}

function normalizeTip(tip: Recommendation): TeacherTip {
  return {
    ...tip,
    icon: tip.icon || 'lightbulb',
    duration: tip.duration || '-',
    category: tip.category || 'Umum',
  };
}

function getTipIcon(iconName: string | null | undefined) {
  if (!iconName || !iconMap[iconName]) return Lightbulb;
  return getIcon(iconName);
}

function normalizeTextList(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim().length > 0);
  }

  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'string' && item.trim().length > 0);
    }
  } catch {
    // Plain text fallback below.
  }

  return value
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFallbackSteps(tip: TeacherTip) {
  const customSteps = normalizeTextList(tip.steps);
  if (customSteps.length > 0) return customSteps;

  return [
    'Siapkan alat dan lingkungan kelas yang aman.',
    'Jelaskan aktivitas secara singkat kepada anak.',
    'Dampingi anak saat mencoba aktivitas.',
    'Amati respons anak dan beri apresiasi.',
    'Catat hal penting untuk evaluasi perkembangan.',
  ];
}

function getBenefitText(tip: TeacherTip) {
  const benefits = normalizeTextList(tip.benefits);
  if (benefits.length > 0) return benefits.join(' ');

  return tip.benefit || 'Aktivitas ini membantu guru mengamati respons anak, keterlibatan belajar, dan kebutuhan pendampingan berikutnya.';
}

export function TeacherTipsClient() {
  const [tips, setTips] = useState<TeacherTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<TeacherTip | null>(null);

  const fetchTips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tips`, {
        cache: 'no-store',
      });
      const payload: TipsApiResponse | null = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Gagal memuat tips.');
      }

      setTips(normalizeTips(payload).map(normalizeTip));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat tips.');
      setTips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  const mainTip = tips.find((tip) => tip.isMain) ?? tips[0] ?? null;
  const otherTips = tips.filter((tip) => tip.id !== mainTip?.id);

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Teacher Guidance
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Aktivitas Kelas
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#004883] sm:text-3xl">
              Tips & Panduan Guru
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-[#004883]">
              Temukan ide aktivitas kelas untuk mendukung observasi dan perkembangan anak.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchTips}
              disabled={loading}
              className="mt-4 border-[#004883]/30 bg-white text-[#004883]"
            >
              Coba Lagi
            </Button>
          </div>

          <Image
            src={APP_IMAGES.teacherGuidanceIllustration}
            alt="Ilustrasi panduan aktivitas guru"
            width={280}
            height={220}
            priority
            className="teacher-float mx-auto h-auto w-full max-w-[190px] shrink-0 motion-reduce:animate-none sm:mx-0 sm:max-w-[240px]"
          />
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[22px] border border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4e3ff]">
            <Loader2 className="h-7 w-7 animate-spin text-[#004883]" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-on-surface-variant">Memuat tips...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border border-[#ffd6d6] bg-white p-8 text-center shadow-[0_12px_32px_rgba(186,26,26,0.06)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-black text-on-surface">Gagal Memuat Tips</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
          </div>
          <Button type="button" variant="outline" icon={RefreshCw} onClick={fetchTips}>
            Coba Lagi
          </Button>
        </div>
      ) : !mainTip ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
          <Image
            src={APP_IMAGES.teacherEmptyState}
            alt="Ilustrasi tips guru kosong"
            width={220}
            height={180}
            className="h-auto w-full max-w-[180px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[220px]"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-black text-on-surface">Belum ada tips untuk guru</h2>
            <p className="max-w-md text-sm text-on-surface-variant">
              Tips dan panduan aktivitas akan muncul setelah ditambahkan oleh administrator.
            </p>
          </div>
        </div>
      ) : (
        <>
          <Card className="overflow-hidden border-[#d4e3ff] p-0 shadow-[0_16px_40px_rgba(0,72,131,0.10)] transition-all duration-200 hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100">
            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgePill className="bg-[#ffe173] text-[#0f1d24] shadow-sm">
                    <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Rekomendasi Utama
                  </BadgePill>
                  <BadgePill className="bg-[#d4e3ff] text-[#004883]">
                    <Tag className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {mainTip.category}
                  </BadgePill>
                  <BadgePill className="bg-[#96f89f] text-[#00531d]">
                    <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {mainTip.duration}
                  </BadgePill>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4e3ff]">
                    {(() => {
                      const Icon = getTipIcon(mainTip.icon);
                      return <Icon className="h-6 w-6 text-[#004883]" aria-hidden="true" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-on-surface">{mainTip.title}</h2>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-on-surface-variant">
                      {mainTip.description}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  icon={PlayCircle}
                  onClick={() => setSelectedTip(mainTip)}
                  className="w-full bg-[#004883] text-white shadow-[0_5px_0_0_#002f55] sm:w-fit"
                >
                  Mulai Aktivitas
                </Button>
              </div>

              <Image
                src={APP_IMAGES.teacherGuidanceIllustration}
                alt="Ilustrasi rekomendasi aktivitas guru"
                width={180}
                height={150}
                className="mx-auto h-auto w-full max-w-[150px] shrink-0 transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[180px]"
              />
            </div>
          </Card>

          {otherTips.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {otherTips.map((tip, index) => {
                const Icon = getTipIcon(tip.icon);
                const palette = cardPalettes[index % cardPalettes.length];

                return (
                  <Card
                    key={tip.id}
                    className="flex gap-4 border-[#d4e3ff] p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md motion-reduce:transition-none motion-reduce:hover:scale-100"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${palette.shell}`}>
                      <Icon className={`h-5 w-5 ${palette.text}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <BadgePill className="bg-[#f3e8ff] text-[#6b21a8]">
                          {tip.category}
                        </BadgePill>
                        <BadgePill className="bg-[#ffddb7] text-[#7c2d12]">
                          <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          {tip.duration}
                        </BadgePill>
                      </div>
                      <h3 className="text-sm font-black text-on-surface">{tip.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {tip.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedTip(tip)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#d4e3ff] px-3 py-1.5 text-xs font-black text-[#004883] transition-colors hover:bg-[#004883] hover:text-white"
                      >
                        <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Lihat Aktivitas
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {selectedTip && (
        <TeacherTipDetailModal
          tip={selectedTip}
          onClose={() => setSelectedTip(null)}
        />
      )}
    </div>
  );
}

function TeacherTipDetailModal({
  tip,
  onClose,
}: {
  tip: TeacherTip;
  onClose: () => void;
}) {
  const materials = normalizeTextList(tip.materials);
  const steps = getFallbackSteps(tip);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-tip-detail-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f1d24]/45 px-4 py-4 sm:items-center"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-5 shadow-[0_24px_70px_rgba(15,29,36,0.25)] sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {tip.isMain && (
                <BadgePill className="bg-[#ffe173] text-[#0f1d24]">
                  <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Rekomendasi Utama
                </BadgePill>
              )}
              <BadgePill className="bg-[#d4e3ff] text-[#004883]">
                {tip.category}
              </BadgePill>
              <BadgePill className="bg-[#96f89f] text-[#00531d]">
                <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                {tip.duration}
              </BadgePill>
            </div>
            <h2 id="teacher-tip-detail-title" className="text-2xl font-black text-on-surface">
              {tip.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {tip.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail aktivitas"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4">
          <section className="rounded-2xl border border-[#d4e3ff] bg-[#d4e3ff]/40 p-4">
            <h3 className="mb-2 text-sm font-black text-[#004883]">Manfaat Aktivitas</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {getBenefitText(tip)}
            </p>
          </section>

          {materials.length > 0 && (
            <section className="rounded-2xl border border-[#ffddb7] bg-[#ffddb7]/40 p-4">
              <h3 className="mb-3 text-sm font-black text-[#7c2d12]">Bahan yang Disiapkan</h3>
              <ul className="grid gap-2 text-sm text-on-surface-variant">
                {materials.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7c2d12]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-[#96f89f] bg-[#96f89f]/30 p-4">
            <h3 className="mb-3 text-sm font-black text-[#00531d]">Langkah Aktivitas</h3>
            <ol className="grid gap-3 text-sm text-on-surface-variant">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#96f89f] text-xs font-black text-[#00531d]">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-[#ffe173] bg-[#ffe173]/40 p-4">
            <h3 className="mb-2 text-sm font-black text-[#0f1d24]">Catatan Observasi Guru</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Catat respons anak selama aktivitas berlangsung, termasuk minat, fokus, interaksi, dan bantuan yang dibutuhkan.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="bg-[#004883] text-white shadow-[0_5px_0_0_#002f55]"
          >
            Kembali ke Tips
          </Button>
        </div>
      </div>
    </div>
  );
}
