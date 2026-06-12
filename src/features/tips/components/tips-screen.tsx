'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Clock, Lightbulb, PlayCircle, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BadgePill } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getIcon, iconMap } from '@/lib/icon-map';
import type { Recommendation } from '@/types';

type ActivityTip = Recommendation & {
  benefit?: string | null;
  benefits?: string | string[] | null;
  materials?: string | string[] | null;
  steps?: string | string[] | null;
};

const cardPalettes = [
  {
    shell: 'bg-[#d4e3ff]',
    text: 'text-[#004883]',
  },
  {
    shell: 'bg-[#96f89f]',
    text: 'text-[#00531d]',
  },
  {
    shell: 'bg-[#ffe173]',
    text: 'text-[#0f1d24]',
  },
  {
    shell: 'bg-[#f3e8ff]',
    text: 'text-[#6b21a8]',
  },
];

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
    // Fall back to splitting plain text below.
  }

  return value
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFallbackSteps(tip: ActivityTip) {
  const customSteps = normalizeTextList(tip.steps);
  if (customSteps.length > 0) return customSteps;

  return [
    'Siapkan alat dan tempat yang aman sebelum memulai aktivitas.',
    `Ajak anak mencoba aktivitas ${tip.title.toLowerCase()} secara perlahan dan menyenangkan.`,
    'Beri apresiasi atas usaha anak, lalu ulangi di lain waktu jika anak masih tertarik.',
  ];
}

function getBenefitText(tip: ActivityTip) {
  const benefits = normalizeTextList(tip.benefits);
  if (benefits.length > 0) return benefits.join(' ');

  return tip.benefit || 'Aktivitas ini membantu anak berlatih fokus, percaya diri, dan mencoba keterampilan baru dengan pendampingan orang tua.';
}

export function TipsScreen() {
  const [tips, setTips] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedTip, setSelectedTip] = useState<ActivityTip | null>(null);

  useEffect(() => {
    async function fetchTips() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tips`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          setTips(json.data ?? []);
        }
      } catch {
        // ignore errors, will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchTips();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl animate-pulse rounded-[24px] bg-[#d4e3ff]/60 p-6">
        <div className="h-40 rounded-[22px] bg-white/70" />
      </section>
    );
  }

  const mainRec = (tips.find((r) => r.isMain) ?? null) as ActivityTip | null;
  const sideRecs = tips.filter((r) => !r.isMain) as ActivityTip[];
  const displayedSide = showAll ? sideRecs : sideRecs.slice(0, 3);

  if (!mainRec && sideRecs.length === 0) {
    return (
      <section
        aria-label="Tips kosong"
        className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[24px] border border-[#d4e3ff] bg-white p-6 text-center shadow-[0_16px_40px_rgba(0,72,131,0.08)] sm:p-8"
      >
        <Image
          src={APP_IMAGES.tipsHero}
          alt="Ilustrasi tips aktivitas anak"
          width={220}
          height={180}
          className="h-auto w-full max-w-[180px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[220px]"
        />
        <div className="space-y-2">
          <h1 className="text-xl font-black text-on-surface">
            Belum ada tips tersedia
          </h1>
          <p className="text-sm font-semibold leading-relaxed text-on-surface-variant">
            Tips aktivitas akan muncul di sini setelah ditambahkan.
          </p>
        </div>
        <p className="rounded-full bg-[#d4e3ff] px-4 py-2 text-xs font-extrabold text-[#004883]">
          Cek kembali setelah asesmen berikutnya
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="overflow-hidden rounded-[24px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffe173] shadow-[0_6px_0_#e8c900]">
              <Lightbulb
                className="h-7 w-7 text-[#0f1d24]"
                aria-hidden="true"
              />
            </div>
            <div>
              <BadgePill className="mb-2 bg-[#96f89f] text-[#00531d]">
                Rekomendasi Hari Ini
              </BadgePill>
              <h1 className="text-2xl font-black text-[#004883] sm:text-3xl">
                Tips & Rekomendasi
              </h1>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
                Temukan aktivitas sederhana untuk mendukung perkembangan anak.
              </p>
            </div>
          </div>
          <Image
            src={APP_IMAGES.tipsHero}
            alt="Ilustrasi tips aktivitas anak"
            width={260}
            height={210}
            priority
            className="tips-float mx-auto h-auto w-full max-w-[180px] shrink-0 motion-reduce:animate-none sm:mx-0 sm:max-w-[220px]"
          />
        </div>
      </div>

      {mainRec && (
        <Card className="overflow-hidden border-[#d4e3ff] p-0 shadow-[0_16px_40px_rgba(0,72,131,0.10)] transition-all duration-200 hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100">
          <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <BadgePill className="bg-[#ffe173] text-[#0f1d24] shadow-sm">
                  <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  Rekomendasi Utama
                </BadgePill>
                <BadgePill className="bg-[#d4e3ff] text-[#004883]">
                  {mainRec.category}
                </BadgePill>
                <BadgePill className="bg-[#96f89f] text-[#00531d]">
                  <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  {mainRec.duration}
                </BadgePill>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4e3ff]">
                  {(() => {
                    const Icon = getTipIcon(mainRec.icon);
                    return (
                      <Icon className="h-6 w-6 text-[#004883]" aria-hidden="true" />
                    );
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-on-surface">
                    {mainRec.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-on-surface-variant">
                    {mainRec.description}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                icon={PlayCircle}
                onClick={() => setSelectedTip(mainRec)}
                className="w-full bg-[#004883] text-white shadow-[0_5px_0_0_#002f55] sm:w-fit"
              >
                Mulai Aktivitas
              </Button>
            </div>
            <Image
              src={APP_IMAGES.tipsCard}
              alt="Ilustrasi rekomendasi aktivitas"
              width={180}
              height={150}
              className="mx-auto h-auto w-full max-w-[150px] shrink-0 transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[180px]"
            />
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {displayedSide.map((rec, index) => {
          const palette = cardPalettes[index % cardPalettes.length];
          const Icon = getTipIcon(rec.icon);

          return (
            <Card
              key={rec.id}
              className="flex items-start gap-3 border-[#d4e3ff] p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${palette.shell}`}>
                <Icon className={`h-5 w-5 ${palette.text}`} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-2">
                  <BadgePill className="bg-[#f3e8ff] text-[#6b21a8]">
                    {rec.category}
                  </BadgePill>
                  <BadgePill className="bg-[#ffddb7] text-[#7c2d12]">
                    <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    {rec.duration}
                  </BadgePill>
                </div>
                <h3 className="mb-1 text-sm font-black text-on-surface">
                  {rec.title}
                </h3>
                <p className="text-xs leading-snug text-on-surface-variant">
                  {rec.description}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTip(rec)}
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

      {sideRecs.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="self-start"
        >
          {showAll ? 'Lihat Lebih Sedikit' : 'Lihat Lainnya'}
        </Button>
      )}

      {selectedTip && (
        <ActivityDetailModal
          tip={selectedTip}
          onClose={() => setSelectedTip(null)}
        />
      )}
    </div>
  );
}

function ActivityDetailModal({
  tip,
  onClose,
}: {
  tip: ActivityTip;
  onClose: () => void;
}) {
  const materials = normalizeTextList(tip.materials);
  const steps = getFallbackSteps(tip);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-detail-title"
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
            <h2 id="activity-detail-title" className="text-2xl font-black text-on-surface">
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
            <h3 className="mb-2 text-sm font-black text-[#0f1d24]">Catatan Pendampingan</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Ikuti ritme anak, jaga suasana tetap ringan, dan berhenti sejenak jika anak mulai lelah atau kehilangan minat.
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
