'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createFile, updateFile } from '@/actions/file-actions';
import { getToken } from '@/lib/auth';
import type { Worksheet } from '@/types';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-error-container text-error rounded-xl text-sm font-bold">{error}</div>}
      
      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Judul Worksheet</label>
        <input 
          name="title" 
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Deskripsi</label>
        <textarea 
          name="description" 
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">URL / Link File</label>
        <input 
          name="url" 
          type="text"
          value={formData.url}
          onChange={handleChange}
          required
          placeholder="https://..."
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Tipe (Variant)</label>
          <select 
            name="variant" 
            value={formData.variant}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          >
            <option value="free">Free (Gratis)</option>
            <option value="paid">Paid (Berbayar)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Warna Aksen</label>
          <select 
            name="accent" 
            value={formData.accent}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Badge (Opsional)</label>
          <input 
            name="badge" 
            type="text"
            value={formData.badge}
            onChange={handleChange}
            placeholder="Misal: BARU, POPULER"
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Ikon (Lucide)</label>
          <select 
            name="icon" 
            value={formData.icon}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          >
            <option value="FileText">FileText</option>
            <option value="Scissors">Scissors</option>
            <option value="Palette">Palette</option>
            <option value="Brush">Brush</option>
            <option value="Shapes">Shapes</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
