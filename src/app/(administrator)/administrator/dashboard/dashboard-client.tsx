'use client';

import { useEffect, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  CircleHelp,
  Clock,
  ClipboardCheck,
  FileText,
  Files,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  Presentation,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAdminOverview } from '@/actions/admin-actions';
import type { AdminOverviewResponse } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getToken, logout } from '@/lib/auth';

type OverviewData = AdminOverviewResponse['data'];
type Palette = {
  bg: string;
  text: string;
  border: string;
};

const PALETTES: Palette[] = [
  { bg: 'bg-[#d4e3ff]', text: 'text-[#004883]', border: 'border-[#d4e3ff]' },
  { bg: 'bg-[#96f89f]', text: 'text-[#00531d]', border: 'border-[#96f89f]' },
  { bg: 'bg-[#ffe173]', text: 'text-[#0f1d24]', border: 'border-[#ffe173]' },
  { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]', border: 'border-[#f3e8ff]' },
  { bg: 'bg-[#ffddb7]', text: 'text-[#7c2d12]', border: 'border-[#ffddb7]' },
  { bg: 'bg-[#ffd6d6]', text: 'text-[#ba1a1a]', border: 'border-[#ffd6d6]' },
];

interface StatItem {
  label: string;
  value: number | string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  palette: Palette;
}

interface QuickActionItem {
  title: string;
  description: string;
  href: string;
  image: string;
  badge: string;
}

function formatLatestAssessment(value: string | null) {
  return value
    ? new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Belum ada data';
}

function buildStats(data: OverviewData, averageScore: string): StatItem[] {
  return [
    {
      label: 'Total Users',
      value: data.totalUsers ?? 0,
      icon: Users,
      palette: PALETTES[0],
    },
    {
      label: 'Parents',
      value: data.totalParents ?? 0,
      icon: UserRound,
      palette: PALETTES[1],
    },
    {
      label: 'Students',
      value: data.totalStudents ?? 0,
      icon: GraduationCap,
      palette: PALETTES[2],
    },
    {
      label: 'Teachers',
      value: data.totalTeachers ?? 0,
      icon: Presentation,
      palette: PALETTES[3],
    },
    {
      label: 'Administrators',
      value: data.totalAdministrators ?? 0,
      icon: ShieldCheck,
      palette: PALETTES[5],
    },
    {
      label: 'Total Questions',
      value: data.totalQuestions ?? 0,
      icon: CircleHelp,
      palette: PALETTES[0],
    },
    {
      label: 'Child Questions',
      value: data.totalChildQuestions ?? 0,
      icon: HelpCircle,
      palette: PALETTES[4],
    },
    {
      label: 'Teacher Questions',
      value: data.totalTeacherQuestions ?? 0,
      icon: BookOpenCheck,
      palette: PALETTES[3],
    },
    {
      label: 'Total Tips',
      value: data.totalTips ?? 0,
      icon: Lightbulb,
      palette: PALETTES[2],
    },
    {
      label: 'Total Files',
      value: data.totalFiles ?? 0,
      icon: Files,
      palette: PALETTES[1],
    },
    {
      label: 'Assessments',
      value: data.totalAssessments ?? 0,
      icon: BarChart3,
      palette: PALETTES[0],
    },
    {
      label: 'Average Score',
      value: averageScore,
      icon: TrendingUp,
      palette: PALETTES[1],
    },
  ];
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    title: 'Kelola Users',
    description: 'Pantau akun parent, student, teacher, dan administrator.',
    href: '/administrator/users',
    image: APP_IMAGES.adminUsersManagement,
    badge: 'Users',
  },
  {
    title: 'Hasil Asesmen',
    description: 'Lihat monitoring hasil asesmen dan perkembangan pengguna.',
    href: '/administrator/assessments',
    image: APP_IMAGES.adminAssessmentMonitoring,
    badge: 'Monitoring',
  },
  {
    title: 'Kelola Pertanyaan',
    description: 'Atur bank pertanyaan untuk asesmen anak dan guru.',
    href: '/administrator/questions',
    image: APP_IMAGES.adminQuestionsManagement,
    badge: 'Questions',
  },
  {
    title: 'Kelola Tips',
    description: 'Kelola panduan aktivitas dan rekomendasi pembelajaran.',
    href: '/administrator/tips',
    image: APP_IMAGES.adminTipsManagement,
    badge: 'Tips',
  },
  {
    title: 'Kelola Files',
    description: 'Kelola file, worksheet, dan resource pembelajaran.',
    href: '/administrator/files',
    image: APP_IMAGES.adminFilesManagement,
    badge: 'Files',
  },
];

export function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        logout();
        router.push('/login');
        return;
      }
      const response = await getAdminOverview(token);
      setData(response.data);
    } catch (err: any) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('sesi') || err.message.toLowerCase().includes('unauthorized')) {
        logout();
        router.push('/login');
      } else if (err.message.includes('403') || err.message.toLowerCase().includes('forbidden')) {
        setError('Akses ditolak. Anda tidak memiliki izin untuk melihat halaman ini.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat memuat dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Sore';

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-64 w-full animate-pulse rounded-[28px] bg-[#d4e3ff]" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-32 w-full animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#ffd6d6] bg-white p-8 text-center shadow-[0_16px_40px_rgba(186,26,26,0.06)]">
        <Image
          src={APP_IMAGES.adminEmptyState}
          alt="Ilustrasi error dashboard administrator"
          width={220}
          height={180}
          className="mb-4 h-auto w-full max-w-[200px]"
        />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
          <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-lg font-black text-on-surface">Gagal Memuat Data</h3>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-on-surface-variant">{error}</p>
        <Button onClick={fetchData} variant="primary" icon={RefreshCw}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center">
        <Image
          src={APP_IMAGES.adminEmptyState}
          alt="Ilustrasi dashboard administrator kosong"
          width={240}
          height={190}
          className="mb-4 h-auto w-full max-w-[220px]"
        />
        <h3 className="text-lg font-black text-on-surface">Belum ada data monitoring</h3>
        <p className="mt-2 max-w-md text-sm text-on-surface-variant">
          Data akan muncul setelah pengguna mulai menggunakan aplikasi.
        </p>
      </div>
    );
  }

  const avgScore = data.averageOverallScore != null ? `${Math.round(data.averageOverallScore)}%` : '-';
  const latestAssessmentDate = formatLatestAssessment(data.latestAssessmentAt);
  const stats = buildStats(data, avgScore);

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_18px_46px_rgba(0,72,131,0.12)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Platform Overview
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Monitoring SkillPathKids
              </span>
            </div>
            <p className="mb-2 text-sm font-black text-[#004883]">
              {greeting}, Administrator
            </p>
            <h1 className="text-3xl font-black leading-tight text-[#004883] md:text-4xl">
              Dashboard Administrator
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-[#004883] md:text-base">
              Pantau pengguna, asesmen, pertanyaan, tips, dan file pembelajaran dalam satu tempat.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/75 p-4 shadow-[0_10px_28px_rgba(0,72,131,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#96f89f] text-[#00531d]">
                    <TrendingUp className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#0f1d24]">{avgScore}</p>
                    <p className="text-xs font-bold text-on-surface-variant">Rata-rata skor</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-[0_10px_28px_rgba(0,72,131,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffe173] text-[#0f1d24]">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0f1d24]">{latestAssessmentDate}</p>
                    <p className="text-xs font-bold text-on-surface-variant">Terakhir asesmen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminDashboardHero}
            alt="Ilustrasi dashboard administrator"
            width={460}
            height={360}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[240px] shrink-0 motion-reduce:animate-none sm:max-w-[300px] lg:mx-0 lg:max-w-[420px]"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className={`flex min-h-32 items-center gap-4 rounded-2xl border bg-white p-4 shadow-[0_8px_24px_rgba(0,72,131,0.06)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(0,72,131,0.10)] motion-reduce:transition-none motion-reduce:hover:scale-100 ${stat.palette.border}`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.palette.bg}`}>
                <Icon className={`h-6 w-6 ${stat.palette.text}`} aria-hidden={true} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black leading-none text-on-surface">{stat.value}</p>
                <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Admin tools</p>
              <h2 className="text-xl font-black text-on-surface">Akses Cepat</h2>
            </div>
            <LayoutDashboard className="h-6 w-6 text-[#004883]" aria-hidden="true" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-h-40 overflow-hidden rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_14px_34px_rgba(0,72,131,0.12)] motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-[#d4e3ff] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#004883]">
                      {action.badge}
                    </span>
                    <h3 className="mt-3 text-base font-black text-on-surface group-hover:text-[#004883]">
                      {action.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                      {action.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#004883]">
                    Buka Halaman
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
                <Image
                  src={action.image}
                  alt={`Ilustrasi ${action.title}`}
                  width={130}
                  height={120}
                  className="ml-3 h-auto w-full max-w-[100px] shrink-0 self-center transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[120px]"
                />
              </Link>
            ))}
          </div>
        </div>

        <aside className="overflow-hidden rounded-2xl border border-[#d4e3ff] bg-white p-5 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e8ff] text-[#6b21a8]">
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black text-on-surface">Ringkasan Platform</p>
              <p className="text-xs text-on-surface-variant">Data real dari overview admin</p>
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminAnalyticsOverview}
            alt="Ilustrasi ringkasan analitik administrator"
            width={260}
            height={210}
            className="mx-auto mb-4 h-auto w-full max-w-[220px]"
          />

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-[#d4e3ff]/55 px-3 py-2">
              <span className="font-bold text-[#004883]">Pengguna aktif terdaftar</span>
              <span className="font-black text-[#004883]">{data.totalUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#96f89f]/45 px-3 py-2">
              <span className="font-bold text-[#00531d]">Total konten</span>
              <span className="font-black text-[#00531d]">{(data.totalTips ?? 0) + (data.totalFiles ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#ffe173]/55 px-3 py-2">
              <span className="font-bold text-[#0f1d24]">Bank pertanyaan</span>
              <span className="font-black text-[#0f1d24]">{data.totalQuestions ?? 0}</span>
            </div>
          </div>
        </aside>
      </section>

      <footer className="pb-2 text-center text-xs text-on-surface-variant">
        (c) 2026 SkillPath Kids - Mode Administrator
      </footer>
    </div>
  );
}
