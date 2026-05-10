'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import { Card, KidCard } from '@/components/ui/card';
import { BadgePill } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getIcon } from '@/lib/icon-map';
import type { Recommendation } from '@/types';

export function TipsScreen() {
  const [tips, setTips] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
      <section className="animate-pulse p-6 bg-surface-container-low rounded-card">
        <div className="h-40 bg-surface-container-high rounded-card" />
      </section>
    );
  }

  const mainRec = tips.find((r) => r.isMain) ?? null;
  const sideRecs = tips.filter((r) => !r.isMain);
  const displayedSide = showAll ? sideRecs : sideRecs.slice(0, 3);

  if (!mainRec && sideRecs.length === 0) {
    return (
      <section
        aria-label="Daily tip"
        className="p-6 bg-surface-container-low rounded-card text-center"
      >
        <p className="text-on-surface-variant">
          We're preparing personalized tips for your child. Check back after their next assessment.
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-tertiary-fixed">
          <Lightbulb
            className="w-7 h-7 text-on-tertiary-fixed-variant"
            aria-hidden="true"
          />
        </div>
        <div>
          <BadgePill color="secondary" className="mb-1">
            Rekomendasi Hari Ini
          </BadgePill>
          <h1 className="text-2xl font-black italic text-on-surface">
            Petualangan Belajarmu!
          </h1>
        </div>
      </div>

      {/* Main recommendation */}
      {mainRec && (
        <KidCard accent="primary" variant="featured" badge="Paling Disarankan">
          {(() => {
            const Icon = getIcon(mainRec.icon);
            return <Icon className="w-8 h-8 text-on-surface-variant" aria-hidden="true" />;
          })()}
          <h2 className="text-2xl font-black italic text-on-surface mb-2">
            {mainRec.title}
          </h2>
          <p className="text-on-surface-variant text-sm mb-4">
            {mainRec.description}
          </p>
          <div className="flex gap-2 mb-6">
            <BadgePill color="neutral">⏱ {mainRec.duration}</BadgePill>
            <BadgePill color="primary">🤸 {mainRec.category}</BadgePill>
          </div>
          <Button variant="primary" size="lg" className="w-full">
            Mulai Aktivitas
          </Button>
        </KidCard>
      )}

      {/* Side recommendations */}
      <div className="flex flex-col gap-3">
        {displayedSide.map((rec) => (
          <Card
            key={rec.id}
            className="flex items-start gap-3 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            {(() => {
              const Icon = getIcon(rec.icon);
              return <Icon className="w-5 h-5 text-on-surface-variant" aria-hidden="true" />;
            })()}
            <div>
              <h3 className="font-black italic text-on-surface text-sm mb-0.5">
                {rec.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-snug">
                {rec.description}
              </p>
            </div>
          </Card>
        ))}
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
      </div>
    </div>
  );
}
