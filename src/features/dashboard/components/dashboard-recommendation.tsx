import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardRecommendation() {
  return (
    <section
      aria-labelledby="recommendation-heading"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
    >
      <h2 id="recommendation-heading" className="sr-only">Rekomendasi Aktivitas</h2>

      {/* ── Lihat Panduan ───────────────────────────────────────────────────── */}
      <div className="
        relative flex flex-col h-full overflow-hidden
        rounded-[22px] border border-primary/20
        bg-white p-8
        shadow-[0_4px_16px_rgba(0,93,167,0.07)]
        transition-all hover:shadow-[0_8px_24px_rgba(0,93,167,0.12)]
      ">
        {/* decorative top-right blob */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#d4e3ff] opacity-40" />

        {/* badge */}
        <div className="relative z-10 mb-4 inline-flex self-start items-center gap-1 rounded-full bg-[#d4e3ff] px-3 py-1">
          <span className="text-xs font-black text-[#004883]">✨ Baru: Modul Montessori</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-4 flex-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary-container shadow-[0_4px_0_0_#d4e3ff] shrink-0">
            <span className="text-2xl text-[#004883]" aria-hidden="true">⭐</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-on-surface">Panduan Perkembangan</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Pelajari indikator utama pertumbuhan anak usia 2–6 tahun dalam format yang mudah dipahami.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <Button
            variant="outline"
            className="w-full rounded-[18px] border-2 border-primary font-extrabold text-primary hover:bg-primary-container"
            asChild
          >
            <Link href="/tips">Lihat Panduan</Link>
          </Button>
        </div>
      </div>

      {/* ── Unduh Hasil PDF ─────────────────────────────────────────────────── */}
      <div className="
        relative flex flex-col h-full overflow-hidden
        rounded-[22px] border border-[#ffe173]/70
        bg-[#FFFDF0] p-8
        shadow-[0_4px_16px_rgba(15,29,36,0.06)]
        transition-all hover:shadow-[0_8px_24px_rgba(15,29,36,0.10)]
      ">
        {/* decorative blob */}
        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#ffe173] opacity-60" />

        <div className="relative z-10 flex flex-col items-center text-center gap-5 flex-1 mt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)] shrink-0">
            <span className="text-2xl text-[#0f1d24]" aria-hidden="true">📄</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-on-surface">Unduh Hasil PDF</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Dapatkan worksheet aktivitas dan rangkuman perkembangan anak yang siap dicetak untuk digunakan di rumah.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <Button
            variant="primary"
            className="w-full rounded-[18px] font-black bg-primary text-white shadow-[0_5px_0_0_#004883] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#004883]"
            asChild
          >
            <Link href="/files">Unduh PDF ⬇️</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
