import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function DashboardHero() {
  return (
    <section 
      aria-label="Welcome section"
      className="
        relative w-full overflow-hidden
        rounded-card
        bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-primary-container)_100%)]
        shadow-medium
      "
    >
      <div className="
        relative flex flex-col md:flex-row
        max-h-[320px] lg:max-h-[420px]
      ">
        {/* Content */}
        <div className="
          relative z-10
          flex flex-col justify-center
          p-6 sm:p-8 lg:p-12
          flex-1
        ">
          <div className="max-w-xl">
            <span className="
              inline-block
              text-sm font-semibold text-white/90
              mb-2
            ">
              Hai, Bunda Budi 👋
            </span>

            <h1 className="
              text-3xl sm:text-4xl lg:text-5xl
              leading-[1.1] font-black text-white
              tracking-tight mb-3
            ">
              Waktunya<br />Bermain & Belajar!
            </h1>

            <p className="
              text-white/85
              text-sm sm:text-base
              leading-relaxed
              max-w-lg mb-6
            ">
              Pantau perkembangan motorik, kognitif, dan aktivitas harian anak melalui asesmen interaktif.
            </p>

            <div>
              <Button
                variant="secondary"
                size="lg"
                className="
                  rounded-button
                  font-bold px-6
                  shadow-soft
                "
                asChild
              >
                <Link href="/assessment">
                  Mulai Asesmen
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="
          relative hidden md:block
          w-[40%] lg:w-[45%]
          min-h-full overflow-hidden
        ">
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
