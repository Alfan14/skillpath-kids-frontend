import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function DashboardRecommendation() {
  return (
    <section aria-labelledby="recommendation-heading" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      <h2 id="recommendation-heading" className="sr-only">Rekomendasi Aktivitas</h2>
      
      {/* Lihat Panduan */}
      <div className="
        flex flex-col h-full bg-card-featured rounded-card 
        border border-primary/20 shadow-soft p-6
        transition-all hover:shadow-medium
      ">
        <div className="inline-flex self-start px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-pill mb-4">
          Baru: Modul Montessori
        </div>
        
        <div className="flex flex-col items-center text-center gap-4 flex-1">
          <div className="w-14 h-14 flex items-center justify-center rounded-pill bg-primary-fixed shrink-0">
            <span className="text-2xl" aria-hidden="true">⭐</span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-on-surface">Panduan Perkembangan</h3>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Pelajari indikator utama pertumbuhan anak usia 2–6 tahun dalam format yang mudah dipahami.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full rounded-button" asChild>
            <Link href="/tips">Lihat Panduan</Link>
          </Button>
        </div>
      </div>

      {/* Download Worksheet */}
      <div className="
        flex flex-col h-full bg-surface-container-low rounded-card 
        border border-secondary/20 shadow-soft p-6
        transition-all hover:shadow-medium
      ">
        <div className="flex flex-col items-center text-center gap-4 flex-1 mt-2">
          <div className="w-14 h-14 flex items-center justify-center rounded-pill bg-secondary-container">
            <span className="text-2xl" aria-hidden="true">📄</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-on-surface">Unduh Hasil PDF</h3>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Dapatkan worksheet aktivitas dan rangkuman perkembangan anak yang siap dicetak untuk digunakan di rumah.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="secondary" className="w-full rounded-button bg-secondary text-on-secondary" asChild>
            <Link href="/files">Unduh PDF ⬇️</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
