import { FileText, LineChart } from 'lucide-react';
import { KidCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { getFiles } from '@/actions/file-actions';
import { getIconFromName } from '@/lib/icon-mapper';

/**
 * FilesScreen — Server Component.
 * Extracted from the Files screen block in App.tsx.
 */
export async function FilesScreen() {
  const worksheets = await getFiles();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">

      <div className="flex items-center gap-4 pt-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-fixed">
          <FileText className="w-7 h-7 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-black italic text-on-surface">Koleksi Worksheet</h1>
          <p className="text-sm text-on-surface-variant">
            Unduh dan cetak aktivitas seru untuk melatih kemampuan si kecil di rumah.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {worksheets.map((ws: any) => {
          const Icon = getIconFromName(ws.iconName);
          const isPaid = ws.variant?.toLowerCase() === 'paid';

          return (
            <KidCard
              key={ws.id}
              accent={ws.accent}
              variant={isPaid ? 'featured' : 'default'}
              badge={ws.badge}
            >
              {isPaid ? (
                /* Paid product — show large thumbnail */
                <>
                  <div className="w-full aspect-[4/3] rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-3 mb-4">
                    {Icon && <Icon className="w-12 h-12 text-secondary" aria-hidden="true" />}
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      {ws.title.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-black italic text-on-surface mb-1">{ws.title}</h2>
                  <p className="text-sm text-on-surface-variant mb-4">{ws.description}</p>
                  <Button variant="secondary" size="lg" className="w-full">
                    Beli Sekarang 🚀
                  </Button>
                </>
              ) : (
                /* Free worksheet */
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl
                                    bg-primary text-white shrink-0">
                      {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                    </div>
                    <div>
                      <h2 className="text-lg font-black italic text-on-surface">{ws.title}</h2>
                      <p className="text-xs text-on-surface-variant">{ws.description}</p>
                    </div>
                  </div>
                  <Button variant="primary" size="md" className="w-full gap-2">
                    Unduh PDF ⬇
                  </Button>
                </>
              )}
            </KidCard>
          );
        })}
      </div>

      <div className="border border-dashed border-outline-variant rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
            Ringkasan Progres
          </h2>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-on-surface">Cukup</span>
          <span className="text-on-surface-variant font-bold">Kategori Motorik</span>
        </div>
        <ProgressBar
          value={65}
          fillClass="bg-secondary-container"
          heightClass="h-4"
          label="Progres motorik: 65%"
        />
        <p className="text-sm text-on-surface-variant">
          Motorik anak berada pada kategori <strong className="text-secondary italic">Cukup</strong>.{' '}
          Perlu peningkatan pada ketelitian dan koordinasi tangan.
        </p>
      </div>

      <footer className="text-center text-xs text-on-surface-variant pb-4">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
