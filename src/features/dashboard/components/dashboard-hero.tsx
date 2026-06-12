import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';

export function DashboardHero() {
  return (
    <section
      aria-label="Welcome section"
      className="
        relative w-full overflow-hidden
        rounded-[28px]
        bg-primary
        shadow-[0_8px_32px_rgba(0,93,167,0.18)]
      "
    >
      <div className="relative flex flex-col md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <span className="text-sm font-bold text-white/90">Hai, Bunda Budi</span>
            </div>

            <h1 className="mb-3 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Waktunya<br />Bermain & Belajar!
            </h1>

            <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              Pantau perkembangan motorik, kognitif, dan aktivitas harian anak melalui asesmen interaktif.
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-[18px] px-8 font-black shadow-[0_5px_0_0_rgba(15,29,36,0.12)]"
              asChild
            >
              <Link href="/assessment">Mulai Asesmen</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex items-end justify-center px-6 pb-6 md:w-[42%] md:px-6 md:pb-0 md:pt-6 lg:w-[46%]">
          <Image
            src={APP_IMAGES.parentDashboardHero}
            alt="Ilustrasi dashboard perkembangan anak"
            width={560}
            height={420}
            priority
            className="h-auto w-full max-w-[260px] drop-shadow-[0_18px_30px_rgba(0,72,131,0.18)] transition-transform duration-300 motion-safe:hover:-translate-y-1 md:max-w-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
