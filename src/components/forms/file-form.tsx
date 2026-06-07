'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createFile, updateFile } from '@/actions/file-actions';
import { getToken } from '@/lib/auth';
import type { Worksheet } from '@/types';
import { AlertTriangle, ChevronDown, FileText } from 'lucide-react';

interface FileFormProps {
  initialData?: Worksheet | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FileForm({ initialData, onSuccess, onCancel }: FileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    variant: initialData?.variant || 'free',
    accent: initialData?.accent || 'primary',
    badge: initialData?.badge || '',
    icon: initialData?.icon || 'FileText',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Anda harus login terlebih dahulu');

      if (initialData?.id) {
        await updateFile(initialData.id, formData as any, token);
      } else {
        await createFile(formData as any, token);
      }
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan file');
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
        <label className="text-sm font-black text-on-surface">Judul Worksheet</label>
        <input 
          name="title" 
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Contoh: Worksheet Motorik Halus"
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
          placeholder="Tuliskan ringkasan materi worksheet."
          className="w-full resize-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">URL / Link File</label>
        <div className="rounded-[16px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary-container">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <input
                name="url"
                type="text"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://..."
                className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-2 text-[11px] text-on-surface-variant">
                Masukkan tautan file yang akan dibuka atau diunduh pengguna.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Tipe (Variant)</label>
          <div className="relative">
          <select 
            name="variant" 
            value={formData.variant}
            onChange={handleChange}
              className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="free">Free (Gratis)</option>
            <option value="paid">Paid (Berbayar)</option>
          </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Warna Aksen</label>
          <div className="relative">
          <select 
            name="accent" 
            value={formData.accent}
            onChange={handleChange}
              className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Badge (Opsional)</label>
          <input 
            name="badge" 
            type="text"
            value={formData.badge}
            onChange={handleChange}
            placeholder="Misal: BARU, POPULER"
            className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-black text-on-surface">Ikon Lucide</label>
          <div className="relative">
          <select 
            name="icon" 
            value={formData.icon}
            onChange={handleChange}
              className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="FileText">FileText</option>
            <option value="Scissors">Scissors</option>
            <option value="Palette">Palette</option>
            <option value="Brush">Brush</option>
            <option value="Shapes">Shapes</option>
          </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
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
