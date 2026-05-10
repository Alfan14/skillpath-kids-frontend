'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createTip, updateTip } from '@/actions/tip-actions';
import type { Recommendation } from '@/types';

interface TipFormProps {
  initialData?: Recommendation | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TipForm({ initialData, onSuccess, onCancel }: TipFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to a string or extract from component
  let defaultIconStr = 'Lightbulb';
  if (typeof initialData?.icon === 'string') {
    defaultIconStr = initialData.icon;
  } else if (initialData?.icon?.displayName) {
    defaultIconStr = initialData.icon.displayName;
  } else if (initialData?.icon) {
    defaultIconStr = 'Star'; // fallback
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Motorik Halus',
    duration: initialData?.duration || '15 Menit',
    icon: defaultIconStr,
    isMain: initialData?.isMain || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData?.id) {
        await updateTip(initialData.id, formData as any);
      } else {
        await createTip(formData as any);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-error-container text-error rounded-xl text-sm font-bold">{error}</div>}
      
      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Judul Tip</label>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Kategori</label>
          <input 
            name="category" 
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-1">Durasi</label>
          <input 
            name="duration" 
            type="text"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Ikon (Lucide)</label>
        <select 
          name="icon" 
          value={formData.icon}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        >
          <option value="Lightbulb">Lightbulb</option>
          <option value="Star">Star</option>
          <option value="Scissors">Scissors</option>
          <option value="Palette">Palette</option>
          <option value="Brush">Brush</option>
          <option value="Shapes">Shapes</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" 
          name="isMain" 
          id="isMain"
          checked={formData.isMain}
          onChange={handleChange}
          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
        />
        <label htmlFor="isMain" className="text-sm font-bold text-on-surface">Jadikan Rekomendasi Utama (Besar)</label>
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
