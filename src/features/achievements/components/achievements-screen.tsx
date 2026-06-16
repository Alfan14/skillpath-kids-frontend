'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Lock, Medal, Sparkles } from 'lucide-react';
import { BadgeCard } from '@/components/ui/badge-card';
import { badges } from '@/data/badges';
import { useUiSound } from '@/hooks/use-ui-sound';
import { APP_IMAGES } from '@/lib/assets';

export function AchievementsScreen() {
  const { playSuccess } = useUiSound();
  const unlocked = badges.filter((b) => b.unlocked);
  const locked = badges.filter((b) => !b.unlocked);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <section className="animate-fade-up overflow-hidden rounded-[24px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffe173] shadow-[0_6px_0_#e8c900]">
              <Medal className="h-7 w-7 text-[#0f1d24]" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-2 inline-flex rounded-full bg-[#96f89f] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#00531d]">
                Rewards
              </p>
              <h1 className="text-2xl font-black text-[#004883] sm:text-3xl">
                Badge & Pencapaian
              </h1>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
                Rayakan setiap langkah perkembangan dan aktivitas belajar anak.
              </p>
            </div>
          </div>
          <Image
            src={APP_IMAGES.badgesHero}
            alt="Ilustrasi badge dan pencapaian anak"
            width={280}
            height={220}
            priority
            className="animate-float-soft mx-auto h-auto w-full max-w-[190px] shrink-0 motion-reduce:animate-none sm:mx-0 sm:max-w-[230px]"
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Ringkasan badge">
        <div className="animate-fade-up rounded-2xl border border-[#96f89f] bg-white p-4 shadow-[0_10px_28px_rgba(0,83,29,0.06)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#96f89f]">
            <CheckCircle2 className="h-5 w-5 text-[#00531d]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-[#00531d]">{unlocked.length}</p>
          <p className="text-xs font-bold text-on-surface-variant">Badge terbuka</p>
        </div>
        <div className="animate-fade-up rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d4e3ff]">
            <Lock className="h-5 w-5 text-[#004883]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-[#004883]">{locked.length}</p>
          <p className="text-xs font-bold text-on-surface-variant">Masih terkunci</p>
        </div>
        <div className="animate-fade-up rounded-2xl border border-[#ffe173] bg-white p-4 shadow-[0_10px_28px_rgba(15,29,36,0.05)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffe173]">
            <Sparkles className="h-5 w-5 text-[#0f1d24]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-black text-[#0f1d24]">{badges.length}</p>
          <p className="text-xs font-bold text-on-surface-variant">Total badge</p>
        </div>
      </section>

      {badges.length === 0 ? (
        <section className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_16px_40px_rgba(0,72,131,0.08)]">
          <Image
            src={APP_IMAGES.badgeIndividual}
            alt="Ilustrasi badge pencapaian"
            width={190}
            height={160}
            className="h-auto w-full max-w-[150px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[190px]"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-black text-on-surface">
              Belum ada badge terbuka
            </h2>
            <p className="max-w-md text-sm font-medium leading-relaxed text-on-surface-variant">
              Selesaikan asesmen dan aktivitas belajar untuk membuka badge.
            </p>
          </div>
          <Link
            href="/assessment"
            onClick={playSuccess}
            className="press-soft inline-flex items-center justify-center rounded-[16px] bg-[#004883] px-5 py-3 text-sm font-black text-white shadow-[0_4px_0_0_#002f55] transition-transform duration-150 hover:translate-y-[1px] motion-reduce:transition-none"
          >
            Mulai Asesmen
          </Link>
        </section>
      ) : (
        <>
          {unlocked.length > 0 && (
            <section className="animate-fade-up" aria-labelledby="unlocked-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2
                  id="unlocked-heading"
                  className="text-xs font-black uppercase tracking-widest text-[#00531d]"
                >
                  Lencana Diraih ({unlocked.length})
                </h2>
                <span className="rounded-full bg-[#96f89f] px-3 py-1 text-[11px] font-extrabold text-[#00531d]">
                  Terbuka
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {unlocked.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} animateOnMount />
                ))}
              </div>
            </section>
          )}

          {locked.length > 0 && (
            <section className="animate-fade-up" aria-labelledby="locked-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2
                  id="locked-heading"
                  className="text-xs font-black uppercase tracking-widest text-[#004883]"
                >
                  Tantangan Berikutnya ({locked.length})
                </h2>
                <span className="rounded-full bg-[#d4e3ff] px-3 py-1 text-[11px] font-extrabold text-[#004883]">
                  Terkunci
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {locked.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} animateOnMount={false} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <footer className="pb-4 text-center text-xs text-on-surface-variant">
        (c) 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
