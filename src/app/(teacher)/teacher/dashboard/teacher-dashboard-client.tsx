'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { useUiSound } from '@/hooks/use-ui-sound';
import { APP_IMAGES } from '@/lib/assets';

const stats = [
  {
    label: 'Level Soal',
    value: 'Teacher',
    icon: ClipboardCheck,
    bg: 'bg-[#96f89f]',
    text: 'text-[#00531d]',
  },
  {
    label: 'Fokus Soal',
    value: 'Professional',
    icon: Sparkles,
    bg: 'bg-[#ffe173]',
    text: 'text-[#0f1d24]',
  },
  {
    label: 'Hasil',
    value: 'Riwayat pribadi',
    icon: BarChart3,
    bg: 'bg-[#d4e3ff]',
    text: 'text-[#004883]',
  },
];

const quickLinks = [
  {
    title: 'Teacher Assessment',
    description: 'Mulai observasi advanced untuk kompetensi guru.',
    href: '/teacher/assessment',
    image: APP_IMAGES.teacherAssessmentHero,
    icon: ClipboardCheck,
    badge: 'Assessment',
    sound: 'success',
  },
  {
    title: 'Lihat Results',
    description: 'Pantau riwayat assessment dan rangkuman perkembangan.',
    href: '/teacher/results',
    image: APP_IMAGES.teacherResultsIllustration,
    icon: BarChart3,
    badge: 'Results',
    sound: 'tap',
  },
  {
    title: 'Tips Guru',
    description: 'Baca panduan aktivitas dan rekomendasi pendampingan.',
    href: '/teacher/tips',
    image: APP_IMAGES.teacherGuidanceIllustration,
    icon: Lightbulb,
    badge: 'Guidance',
    sound: 'tap',
  },
  {
    title: 'Files / Worksheet',
    description: 'Akses worksheet dan materi pendukung yang tersedia.',
    href: '/worksheets',
    image: APP_IMAGES.filesHero,
    icon: FileText,
    badge: 'Files',
    sound: 'tap',
  },
] as const;

export function TeacherDashboardClient() {
  const { playTap, playSuccess } = useUiSound();

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-fade-up overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
              Teacher assessment workspace
            </p>
            <h1 className="text-2xl font-black leading-tight text-[#004883] md:text-4xl">
              Evaluasi kompetensi guru dengan bank soal advanced.
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Kelola assessment, pantau hasil, dan akses panduan kelas dalam satu workspace guru.
            </p>
            <Link
              href="/teacher/assessment"
              onClick={playSuccess}
              className="press-soft mt-5 inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#e8c426] bg-[#ffe173] px-5 py-3 text-sm font-black text-[#0f1d24] shadow-[0_5px_0_0_#d9b739] transition-all duration-150 hover:translate-y-[1px] hover:bg-[#ffd84d] motion-reduce:transition-none"
            >
              Mulai Assessment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Image
            src={APP_IMAGES.teacherDashboardHero}
            alt="Ilustrasi dashboard guru SkillPath Kids"
            width={460}
            height={360}
            priority
            className="animate-float-soft mx-auto h-auto w-full max-w-[240px] shrink-0 motion-reduce:animate-none md:max-w-[360px] lg:mx-0 lg:max-w-[430px]"
          />
        </div>
      </section>

      <section className="animate-fade-up grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, bg, text }) => (
          <div
            key={label}
            className="rounded-[18px] border border-[#d4e3ff] bg-white p-5 shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 motion-reduce:transition-none"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] ${bg}`}>
              <Icon className={`h-5 w-5 ${text}`} aria-hidden="true" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
            <p className="mt-1 text-lg font-black text-on-surface">{value}</p>
          </div>
        ))}
      </section>

      <section className="animate-fade-up grid gap-4 md:grid-cols-2">
        {quickLinks.map(({ title, description, href, image, icon: Icon, badge, sound }) => (
          <Link
            key={href}
            href={href}
            onClick={sound === 'success' ? playSuccess : playTap}
            className="group hover-lift-soft overflow-hidden rounded-[22px] border border-[#d4e3ff] bg-white p-5 shadow-[0_12px_32px_rgba(0,72,131,0.08)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(0,72,131,0.12)] motion-reduce:transition-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#d4e3ff] px-3 py-1 text-[11px] font-extrabold text-[#004883]">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {badge}
                </span>
                <h2 className="text-lg font-black text-on-surface">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {description}
                </p>
              </div>
              <Image
                src={image}
                alt=""
                width={120}
                height={100}
                className="h-auto w-full max-w-[92px] shrink-0 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:max-w-[112px]"
              />
            </div>
          </Link>
        ))}
      </section>

      <section className="animate-fade-up rounded-[22px] border border-[#d4e3ff] bg-white p-5 shadow-[0_12px_32px_rgba(0,72,131,0.06)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-on-surface">Alur Teacher</h2>
            <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
              Ikuti alur singkat berikut untuk menyelesaikan assessment guru.
            </p>
          </div>
          <Image
            src={APP_IMAGES.teacherEmptyState}
            alt=""
            width={180}
            height={140}
            className="mx-auto h-auto w-full max-w-[130px] shrink-0 transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none md:mx-0 md:max-w-[160px]"
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Jawab soal advanced', 'Simpan assessment', 'Lihat hasil dan rekomendasi'].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-[14px] bg-[#d4e3ff]/55 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#004883] text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="text-sm font-bold text-on-surface">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
