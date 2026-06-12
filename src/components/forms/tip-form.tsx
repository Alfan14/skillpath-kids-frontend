'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createTip, updateTip } from '@/actions/tip-actions';
import { getToken } from '@/lib/auth';
import type { Recommendation } from '@/types';
import { AlertTriangle, ChevronDown, Lightbulb } from 'lucide-react';
import { iconMap } from '@/lib/icon-map';

interface TipFormProps {
  initialData?: Recommendation | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TipForm({ initialData, onSuccess, onCancel }: TipFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Motorik Halus',
    duration: initialData?.duration || '15 Menit',
    icon: initialData?.icon || 'Lightbulb',
    isMain: initialData?.isMain || false,
  });
  const SelectedIcon = iconMap[formData.icon] ?? Lightbulb;
  const previewTitle = formData.title.trim() || 'Judul Tip';
  const previewDescription = formData.description.trim() || 'Deskripsi tip akan tampil di sini.';
  const previewCategory = formData.category.trim() || 'Kategori';
  const previewDuration = formData.duration.trim() || 'Durasi';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Anda harus login terlebih dahulu');

      if (initialData?.id) {
        await updateTip(initialData.id, formData as any, token);
      } else {
        await createTip(formData as any, token);
      }
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 rounded-[14px] bg-error-container p-3 text-sm font-bold text-error">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">Judul Tip</label>
        <input 
          name="title" 
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Contoh: Latihan menggenggam benda kecil"
          className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">Deskripsi</label>
        <textarea 
          name="description" 
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Tuliskan instruksi singkat dan jelas untuk orang tua."
          className="w-full resize-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Kategori</label>
          <input 
            name="category" 
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Durasi</label>
          <input 
            name="duration" 
            type="text"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">Ikon Lucide</label>
        <div className="flex gap-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#ffe173]">
            <SelectedIcon className="h-5 w-5 text-[#0f1d24]" aria-hidden="true" />
          </div>
          <div className="relative flex-1">
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Lightbulb">Lightbulb</option>
              <option value="Star">Star</option>
              <option value="Scissors">Scissors</option>
              <option value="Palette">Palette</option>
              <option value="Brush">Brush</option>
              <option value="Shapes">Shapes</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>
        <p className="text-[11px] text-on-surface-variant">
          Gunakan nama icon Lucide, contoh: Lightbulb, Sparkles, BookOpen, Puzzle, HeartHandshake.
        </p>
      </div>

      <label htmlFor="isMain" className="flex cursor-pointer items-start gap-3 rounded-[16px] border-2 border-dashed border-secondary-container bg-surface-container-lowest p-4">
        <input 
          type="checkbox" 
          name="isMain" 
          id="isMain"
          checked={formData.isMain}
          onChange={handleChange}
          className="mt-0.5 h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
        />
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-on-surface">Jadikan Rekomendasi Utama</span>
          <span className="text-[11px] text-on-surface-variant">Tip ini akan diprioritaskan sebagai rekomendasi utama.</span>
        </span>
      </label>

      <div className="rounded-[18px] border border-outline-variant/30 bg-white p-4 shadow-[0_4px_16px_rgba(0,93,167,0.05)]">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-on-surface-variant">
          Preview Tampilan
        </p>
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#ffe173]">
            <SelectedIcon className="h-7 w-7 text-[#0f1d24]" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#d4e3ff] px-2.5 py-1 text-[10px] font-black uppercase text-[#004883]">
                {previewCategory}
              </span>
              <span className="rounded-full bg-[#96f89f] px-2.5 py-1 text-[10px] font-black uppercase text-[#00531d]">
                {previewDuration}
              </span>
              {formData.isMain && (
                <span className="rounded-full bg-[#ffe173] px-2.5 py-1 text-[10px] font-black uppercase text-[#0f1d24]">
                  Rekomendasi Utama
                </span>
              )}
            </div>
            <h3 className="truncate text-sm font-black text-on-surface">{previewTitle}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
              {previewDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 -mb-5 flex justify-end gap-3 border-t border-outline-variant/20 bg-white px-6 py-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="rounded-[14px] border-2 border-outline-variant font-bold"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="rounded-[14px] px-6 font-black shadow-[0_5px_0_0_#004883]"
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
