import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';

export function DashboardRecommendation() {
  return (
    <section
      aria-labelledby="recommendation-heading"
      className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
    >
      <h2 id="recommendation-heading" className="sr-only">Rekomendasi Aktivitas</h2>

      <div className="
        relative flex h-full flex-col overflow-hidden
        rounded-[22px] border border-primary/20
        bg-white p-6
        shadow-[0_4px_16px_rgba(0,93,167,0.07)]
        transition-all hover:shadow-[0_8px_24px_rgba(0,93,167,0.12)]
      ">
        <div className="mb-4 inline-flex self-start items-center gap-1 rounded-full bg-[#d4e3ff] px-3 py-1">
          <span className="text-xs font-black text-[#004883]">Baru: Modul Montessori</span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Image
            src={APP_IMAGES.resultReport}
            alt="Ilustrasi panduan perkembangan"
            width={160}
            height={130}
            className="h-auto w-full max-w-[130px] shrink-0 transition-transform duration-300 motion-safe:hover:-translate-y-1"
          />
          <div>
            <h3 className="text-lg font-black text-on-surface">Panduan Perkembangan</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Pelajari indikator utama pertumbuhan anak usia 2-6 tahun dalam format yang mudah dipahami.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="outline"
            className="w-full rounded-[18px] border-2 border-primary font-extrabold text-primary hover:bg-primary-container"
            asChild
          >
            <Link href="/tips">Lihat Panduan</Link>
          </Button>
        </div>
      </div>

      <div className="
        relative flex h-full flex-col overflow-hidden
        rounded-[22px] border border-[#ffe173]/70
        bg-[#FFFDF0] p-6
        shadow-[0_4px_16px_rgba(15,29,36,0.06)]
        transition-all hover:shadow-[0_8px_24px_rgba(15,29,36,0.10)]
      ">
        <div className="flex flex-1 flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Image
            src={APP_IMAGES.filesHero}
            alt="Ilustrasi file worksheet"
            width={160}
            height={130}
            className="h-auto w-full max-w-[130px] shrink-0 transition-transform duration-300 motion-safe:hover:-translate-y-1"
          />
          <div>
            <h3 className="text-lg font-black text-on-surface">Unduh Hasil PDF</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Dapatkan worksheet aktivitas dan rangkuman perkembangan anak yang siap dicetak untuk digunakan di rumah.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            className="w-full rounded-[18px] bg-primary font-black text-white shadow-[0_5px_0_0_#004883] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#004883]"
            asChild
          >
            <Link href="/files">Unduh PDF</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
