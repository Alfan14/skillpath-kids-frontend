import Link from 'next/link';
import { ArrowRight, BarChart3, ClipboardCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Teacher Dashboard - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[24px] bg-primary px-5 py-6 text-white shadow-[0_10px_30px_rgba(0,93,167,0.16)] md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-primary-container">
              Teacher assessment workspace
            </p>
            <h1 className="text-2xl font-black italic leading-tight md:text-4xl">
              Evaluasi kompetensi guru dengan bank soal advanced.
            </h1>
          </div>
          <Link
            href="/teacher/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#e8c426] bg-[#ffe173] px-5 py-3 text-sm font-black text-[#0f1d24] shadow-[0_5px_0_0_#d9b739] transition-colors hover:bg-[#ffd84d]"
          >
            Mulai Assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Level Soal', value: 'Teacher', icon: ClipboardCheck, bg: 'bg-[#96f89f]', text: 'text-[#00531d]' },
          { label: 'Fokus Soal', value: 'Professional', icon: Sparkles, bg: 'bg-[#ffe173]', text: 'text-[#0f1d24]' },
          { label: 'Hasil', value: 'Riwayat pribadi', icon: BarChart3, bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="rounded-[18px] border border-outline-variant/30 bg-white p-5">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] ${bg}`}>
              <Icon className={`h-5 w-5 ${text}`} aria-hidden="true" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
            <p className="mt-1 text-lg font-black text-on-surface">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[20px] border border-outline-variant/30 bg-white p-5">
        <h2 className="text-lg font-black text-on-surface">Alur Teacher</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {['Jawab soal advanced', 'Simpan assessment', 'Lihat hasil dan rekomendasi'].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-[14px] bg-surface-container-low p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
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
