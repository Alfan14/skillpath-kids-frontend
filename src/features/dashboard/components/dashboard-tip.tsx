import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recommendation } from '@/types';

export async function DashboardTip() {
  let tip: Recommendation | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tips`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const tips: Recommendation[] = json.data || [];
      tip = tips.find(t => t.isMain) || tips[0] || null;
    }
  } catch (err) {
    // suppress errors to avoid raw JSON in UX
  }

  if (!tip) {
    return (
      <section aria-label="Daily tip">
        <div className="relative overflow-hidden rounded-card bg-[linear-gradient(135deg,var(--color-tertiary)_0%,var(--color-tertiary-container)_100%)] p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
            <div className="w-12 h-12 rounded-pill bg-white/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed font-medium">
                Daily tips will appear here once your child's assessment is complete.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Daily tip">
      <div className="relative overflow-hidden rounded-card bg-[linear-gradient(135deg,var(--color-tertiary)_0%,var(--color-tertiary-container)_100%)] p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
          <div className="w-12 h-12 rounded-pill bg-white/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {tip.title}
            </h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {tip.description}
            </p>
          </div>

          <Button
            variant="outline"
            className="shrink-0 bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-button"
            asChild
          >
            <Link href="/tips">Lihat Tips Lainnya</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DashboardTipSkeleton() {
  return (
    <section className="animate-pulse" aria-hidden="true">
      <div className="h-32 sm:h-28 rounded-card bg-surface-container-high" />
    </section>
  );
}
