'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createQuestion, updateQuestion } from '@/actions/question-actions';
import { getToken } from '@/lib/auth';
import type { AssessmentQuestion } from '@/types';

interface QuestionFormProps {
  initialData?: AssessmentQuestion | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QuestionForm({ initialData, onSuccess, onCancel }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    category: initialData?.category || 'Motorik Halus',
    icon: initialData?.icon || 'Home',
    color: initialData?.color || 'bg-primary-container',
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
        await updateQuestion(initialData.id, formData as any, token);
      } else {
        await createQuestion(formData as any, token);
      }
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pertanyaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-error-container text-error rounded-xl text-sm font-bold">{error}</div>}
      
      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Pertanyaan</label>
        <textarea 
          name="text" 
          value={formData.text}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Kategori</label>
        <select 
          name="category" 
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        >
          <option value="Motorik Halus">Motorik Halus</option>
          <option value="Motorik Kasar">Motorik Kasar</option>
          <option value="Keseimbangan">Keseimbangan</option>
          <option value="Kognitif">Kognitif</option>
          <option value="Sensorial">Sensorial</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Ikon (Lucide)</label>
        <select 
          name="icon" 
          value={formData.icon}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        >
          <option value="Home">Home</option>
          <option value="Star">Star</option>
          <option value="FileText">FileText</option>
          <option value="Scissors">Scissors</option>
          <option value="Shapes">Shapes</option>
          <option value="Palette">Palette</option>
          <option value="Brush">Brush</option>
          <option value="BookOpen">BookOpen</option>
          <option value="Hand">Hand</option>
          <option value="Eye">Eye</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface mb-1">Warna Latar (Tailwind)</label>
        <select 
          name="color" 
          value={formData.color}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-outline-variant bg-surface"
        >
          <option value="bg-primary-container">Primary Container</option>
          <option value="bg-secondary-container">Secondary Container</option>
          <option value="bg-tertiary-container">Tertiary Container</option>
          <option value="bg-tertiary">Tertiary</option>
          <option value="bg-secondary">Secondary</option>
        </select>
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
