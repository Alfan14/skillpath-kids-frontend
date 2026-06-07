'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Clock, Lightbulb, Loader2, RefreshCw, Tag } from 'lucide-react';

import { BadgePill } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, KidCard } from '@/components/ui/card';
import { getIcon } from '@/lib/icon-map';
import type { Recommendation } from '@/types';

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

function normalizeTips(payload: TipsApiResponse | null): Recommendation[] {
  const data = payload?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tips)) return data.tips;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(payload?.tips)) return payload.tips;

  return [];
}

function normalizeTip(tip: Recommendation): Recommendation {
  return {
    ...tip,
    icon: tip.icon || 'lightbulb',
    duration: tip.duration || '-',
    category: tip.category || 'Umum',
  };
}

export function TeacherTipsClient() {
  const [tips, setTips] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">Teacher tips</p>
          <h1 className="mt-1 text-2xl font-black text-on-surface">Tips & Rekomendasi</h1>
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">
            Materi rekomendasi read-only untuk mendukung aktivitas assessment guru.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={fetchTips}
          disabled={loading}
        >
          Coba Lagi
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[20px] border border-outline-variant/30 bg-white p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm font-bold text-on-surface-variant">Memuat tips...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[20px] border border-outline-variant/30 bg-white p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-error" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-black text-on-surface">Gagal Memuat Tips</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
          </div>
          <Button type="button" variant="outline" icon={RefreshCw} onClick={fetchTips}>
            Coba Lagi
          </Button>
        </div>
      ) : !mainTip ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-outline-variant bg-white p-8 text-center">
          <Lightbulb className="h-12 w-12 text-on-surface-variant/40" aria-hidden="true" />
          <h2 className="text-lg font-black text-on-surface">Belum ada tips.</h2>
          <p className="max-w-md text-sm text-on-surface-variant">
            Tips akan tampil di sini setelah tersedia dari server.
          </p>
        </div>
      ) : (
        <>
          <KidCard accent="primary" variant="featured" badge="Read-only">
            {(() => {
              const Icon = getIcon(mainTip.icon);
              return <Icon className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />;
            })()}
            <h2 className="text-2xl font-black italic text-on-surface">{mainTip.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {mainTip.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <BadgePill color="neutral" className="gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {mainTip.duration}
              </BadgePill>
              <BadgePill color="primary" className="gap-1">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {mainTip.category}
              </BadgePill>
            </div>
          </KidCard>

          {otherTips.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {otherTips.map((tip) => {
                const Icon = getIcon(tip.icon);

                return (
                  <Card key={tip.id} className="flex gap-4 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-primary-container text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-on-surface">{tip.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {tip.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-surface-container px-2 py-1 text-[10px] font-bold text-on-surface-variant">
                          {tip.duration}
                        </span>
                        <span className="rounded-full bg-secondary-container px-2 py-1 text-[10px] font-bold text-on-secondary-container">
                          {tip.category}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
