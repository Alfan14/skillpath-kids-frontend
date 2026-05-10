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

  // shared inner layout — same for both filled and empty states
  const TipCard = ({ title, body }: { title?: string; body: string }) => (
    <div className="
      relative overflow-hidden rounded-[22px]
      bg-tertiary
      p-7 sm:p-8
      shadow-[0_6px_0_0_#00531d]
    ">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#00531d] opacity-30" />
      <div className="pointer-events-none absolute -bottom-6 left-1/4 h-20 w-20 rounded-full bg-tertiary-light opacity-10" />

      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">

        {/* icon badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-sm">
          <Lightbulb className="h-6 w-6 text-white" aria-hidden="true" />
        </div>

        <div className="flex-1">
          {title && (
            <h3 className="mb-1 text-lg font-black text-white">{title}</h3>
          )}
          <p className="text-sm sm:text-base leading-relaxed font-medium text-white/90">
            {body}
          </p>
        </div>

        <Button
          variant="outline"
          className="shrink-0 rounded-[16px] border-2 border-white/30 bg-white/10 font-bold text-white backdrop-blur-sm hover:bg-white/20"
          asChild
        >
          <Link href="/tips">Lihat Tips Lainnya</Link>
        </Button>
      </div>
    </div>
  );

  if (!tip) {
    return (
      <section aria-label="Daily tip">
        <TipCard body="Tips harian akan muncul di sini setelah asesmen si Kecil selesai. 🌟" />
      </section>
    );
  }

  return (
    <section aria-label="Daily tip">
      <TipCard title={tip.title} body={tip.description} />
    </section>
  );
}

export function DashboardTipSkeleton() {
  return (
    <section className="animate-pulse" aria-hidden="true">
      <div className="h-32 sm:h-28 rounded-[22px] bg-surface-container-high" />
    </section>
  );
}