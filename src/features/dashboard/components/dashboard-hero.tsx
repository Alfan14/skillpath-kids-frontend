import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#004883] opacity-40" />
      <div className="pointer-events-none absolute -bottom-8 left-1/3 h-28 w-28 rounded-full bg-secondary opacity-20" />

      <div className="relative flex flex-col md:flex-row max-h-[320px] lg:max-h-[420px]">

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-12 flex-1">
          <div className="max-w-xl">

            {/* greeting chip */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <span className="text-sm font-bold text-white/90">Hai, Bunda Budi 👋</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.1] font-black text-white tracking-tight mb-3">
              Waktunya<br />Bermain & Belajar!
            </h1>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
              Pantau perkembangan motorik, kognitif, dan aktivitas harian anak melalui asesmen interaktif.
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-[18px] font-black px-8 shadow-[0_5px_0_0_#e8c426]"
              asChild
            >
              <Link href="/assessment">Mulai Asesmen</Link>
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative hidden md:block w-[40%] lg:w-[45%] min-h-full overflow-hidden">
          <Image
            src="/images/children_edukatif.jpg"
            alt="Anak sedang bermain"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent md:bg-gradient-to-l" />
        </div>
      </div>
    </section>
  );
}