'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  Award,
  BarChart3,
  Lightbulb,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { getAdminOverview } from '@/actions/admin-actions';
import { getToken, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { AdminOverviewResponse } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';

export function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<AdminOverviewResponse['data'] | null>(null);
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
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-48 rounded-[24px] bg-surface-container-low w-full"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-32 rounded-[20px] bg-surface-container-low w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] bg-error-container/20 border-2 border-dashed border-error/50">
        <ShieldAlert className="h-12 w-12 text-error mb-4" />
        <h3 className="text-lg font-black text-on-surface mb-2">Gagal Memuat Data</h3>
        <p className="text-sm text-on-surface-variant mb-6">{error}</p>
        <Button onClick={fetchData} variant="primary">Coba Lagi</Button>
      </div>
    );
  }

  if (!data) return null;

  const STATS = [
    { label: 'Total Users', value: data.totalUsers ?? 0, icon: Users, bg: 'bg-primary-container', text: 'text-primary' },
    { label: 'Parents', value: data.totalParents ?? 0, icon: Users, bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { label: 'Students', value: data.totalStudents ?? 0, icon: Users, bg: 'bg-tertiary-container', text: 'text-tertiary' },
    { label: 'Teachers', value: data.totalTeachers ?? 0, icon: Users, bg: 'bg-primary-container', text: 'text-primary' },
    { label: 'Administrators', value: data.totalAdministrators ?? 0, icon: ShieldAlert, bg: 'bg-error-container', text: 'text-error' },
    { label: 'Total Assessments', value: data.totalAssessments ?? 0, icon: Award, bg: 'bg-tertiary-container', text: 'text-tertiary' },
    { label: 'Total Questions', value: data.totalQuestions ?? 0, icon: ClipboardList, bg: 'bg-primary-container', text: 'text-primary' },
    { label: 'Child Questions', value: data.totalChildQuestions ?? 0, icon: BookOpen, bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { label: 'Teacher Questions', value: data.totalTeacherQuestions ?? 0, icon: BookOpen, bg: 'bg-tertiary-container', text: 'text-tertiary' },
    { label: 'Total Tips', value: data.totalTips ?? 0, icon: Lightbulb, bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { label: 'Total Files', value: data.totalFiles ?? 0, icon: FileText, bg: 'bg-primary-container', text: 'text-primary' },
  ];

  const avgScore = data.averageOverallScore != null ? `${Math.round(data.averageOverallScore)}%` : '-';
  const latestAssesmentDate = data.latestAssessmentAt 
    ? new Date(data.latestAssessmentAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Belum ada data';

  return (
    <div className="flex flex-col gap-8">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[24px] bg-primary p-6 md:p-8 shadow-[0_8px_32px_rgba(0,93,167,0.18)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#004883] opacity-40" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-28 w-28 rounded-full bg-secondary opacity-15" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary-container mb-1">{greeting}, Administrator 👋</p>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Dashboard Utama<br className="md:hidden" /> SkillPath Kids
            </h2>
            <p className="mt-2 text-sm text-white/80 max-w-md">
              Pantau seluruh aktivitas aplikasi, manajemen pengguna, serta hasil asesmen secara real-time.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="flex flex-col items-center justify-center rounded-[18px] bg-white/15 backdrop-blur-sm px-5 py-3 text-center">
              <span className="text-2xl font-black text-secondary leading-none">{avgScore}</span>
              <span className="text-[10px] font-bold text-white/80 mt-0.5">Rata-rata Skor</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[18px] bg-white/15 backdrop-blur-sm px-5 py-3 text-center min-w-[120px]">
              <Clock className="h-6 w-6 text-white mb-1" />
              <span className="text-[10px] font-bold text-white mt-0.5 line-clamp-2 leading-tight">Terakhir Asesmen:<br/>{latestAssesmentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-[20px] border border-outline-variant/30 bg-white p-5 shadow-[0_4px_16px_rgba(0,93,167,0.06)] transition-all hover:shadow-[0_8px_24px_rgba(0,93,167,0.10)]"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.text}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-on-surface leading-none">{stat.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant truncate mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <footer className="pb-2 text-center text-xs text-on-surface-variant">
        © 2026 SkillPath Kids — Mode Administrator
      </footer>
    </div>
  );
}
