'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createQuestion, updateQuestion } from '@/actions/question-actions';
import { getToken } from '@/lib/auth';
import type { AssessmentQuestion } from '@/types';
import {
  Home, Pencil, Brain, Lightbulb, Users, Heart, Star,
  Scissors, BookOpen, Eye, Shapes, Palette, Hand, Brush,
  Footprints, MessageSquare, Music, Puzzle, Leaf, Smile,
  ClipboardCheck, BarChart3, ChevronDown, Check,
} from 'lucide-react';

// ── Config ────────────────────────────────────────────────────────────────────

export const ICON_OPTIONS: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: 'Home',         label: 'Home',         Icon: Home         },
  { value: 'Pencil',       label: 'Pencil',       Icon: Pencil       },
  { value: 'Brain',        label: 'Brain',        Icon: Brain        },
  { value: 'Lightbulb',   label: 'Lightbulb',    Icon: Lightbulb    },
  { value: 'Users',        label: 'Users',        Icon: Users        },
  { value: 'Heart',        label: 'Heart',        Icon: Heart        },
  { value: 'Star',         label: 'Star',         Icon: Star         },
  { value: 'Scissors',     label: 'Scissors',     Icon: Scissors     },
  { value: 'BookOpen',     label: 'BookOpen',     Icon: BookOpen     },
  { value: 'Eye',          label: 'Eye',          Icon: Eye          },
  { value: 'Shapes',       label: 'Shapes',       Icon: Shapes       },
  { value: 'Palette',      label: 'Palette',      Icon: Palette      },
  { value: 'Hand',         label: 'Hand',         Icon: Hand         },
  { value: 'Brush',        label: 'Brush',        Icon: Brush        },
  { value: 'Footprints',   label: 'Footprints',   Icon: Footprints   },
  { value: 'MessageSquare',label: 'MessageSquare',Icon: MessageSquare},
  { value: 'Music',        label: 'Music',        Icon: Music        },
  { value: 'Puzzle',       label: 'Puzzle',       Icon: Puzzle       },
  { value: 'Leaf',         label: 'Leaf',         Icon: Leaf         },
  { value: 'Smile',        label: 'Smile',        Icon: Smile        },
  { value: 'ClipboardCheck', label: 'ClipboardCheck', Icon: ClipboardCheck },
  { value: 'BarChart3',    label: 'BarChart3',    Icon: BarChart3    },
];

export const COLOR_OPTIONS: {
  value: string;
  label: string;
  bg: string;
  fg: string;
  swatch: string;
}[] = [
  {
    value: 'bg-[#d4e3ff]',
    label: 'Primary Blue',
    bg: 'bg-[#d4e3ff]',
    fg: 'text-[#004883]',
    swatch: '#d4e3ff',
  },
  {
    value: 'bg-[#96f89f]',
    label: 'Soft Green',
    bg: 'bg-[#96f89f]',
    fg: 'text-[#00531d]',
    swatch: '#96f89f',
  },
  {
    value: 'bg-[#ffe173]',
    label: 'Soft Yellow',
    bg: 'bg-[#ffe173]',
    fg: 'text-[#0f1d24]',
    swatch: '#ffe173',
  },
  {
    value: 'bg-[#ffd6d6]',
    label: 'Soft Red',
    bg: 'bg-[#ffd6d6]',
    fg: 'text-[#b91c1c]',
    swatch: '#ffd6d6',
  },
  {
    value: 'bg-[#f3e8ff]',
    label: 'Soft Purple',
    bg: 'bg-[#f3e8ff]',
    fg: 'text-[#6d28d9]',
    swatch: '#f3e8ff',
  },
  {
    value: 'bg-[#fff3e0]',
    label: 'Soft Orange',
    bg: 'bg-[#fff3e0]',
    fg: 'text-[#c2410c]',
    swatch: '#fff3e0',
  },
  {
    value: 'bg-[#fce7f3]',
    label: 'Soft Pink',
    bg: 'bg-[#fce7f3]',
    fg: 'text-[#be185d]',
    swatch: '#fce7f3',
  },
  {
    value: 'bg-[#e0f0fa]',
    label: 'Neutral Gray',
    bg: 'bg-[#e0f0fa]',
    fg: 'text-[#414751]',
    swatch: '#e0f0fa',
  },
];

export const CATEGORY_OPTIONS = [
  'Motorik Halus',
  'Motorik Kasar',
  'Keseimbangan',
  'Kognitif',
  'Sensorial',
  'Bahasa',
  'Sosial',
  'Asesmen Profesional',
  'Diferensiasi',
  'Komunikasi',
  'Analitik Kelas',
];

// ── Helper: get icon component by name ───────────────────────────────────────
export function getIconByName(name: string): React.ElementType {
  return ICON_OPTIONS.find(o => o.value === name)?.Icon ?? Home;
}

// ── Sub-component: styled select with icon preview ────────────────────────────
function SelectDropdown({
  label,
  value,
  onChange,
  children,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-black text-on-surface">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
      </div>
      {hint && <p className="text-[11px] text-on-surface-variant">{hint}</p>}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface QuestionFormProps {
  initialData?: AssessmentQuestion | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// ── Main Form ─────────────────────────────────────────────────────────────────
export function QuestionForm({ initialData, onSuccess, onCancel }: QuestionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text:     initialData?.text     || '',
    category: initialData?.category || 'Motorik Halus',
    icon:     initialData?.icon     || 'Home',
    color:    initialData?.color    || 'bg-primary-container',
    level:    initialData?.level    || 'CHILD',
  });

  const charCount = formData.text.length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // derived preview values
  const previewColor = COLOR_OPTIONS.find(c => c.value === formData.color) ?? COLOR_OPTIONS[0];
  const PreviewIcon  = getIconByName(formData.icon);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* error */}
      {error && (
        <div className="flex items-center gap-2 rounded-[14px] bg-error-container p-3 text-sm font-bold text-error">
          {error}
        </div>
      )}

      {/* question textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">Pertanyaan</label>
        <div className="relative">
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            maxLength={500}
            rows={3}
            placeholder="Tulis pertanyaan di sini..."
            className="w-full resize-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <span className="absolute bottom-2.5 right-3 text-[10px] text-on-surface-variant">
            {charCount} / 500
          </span>
        </div>
        <p className="text-[11px] text-on-surface-variant">
          Tulis pertanyaan dengan jelas dan mudah dipahami anak.
        </p>
      </div>

      {/* category */}
      <SelectDropdown
        label="Kategori"
        value={formData.category}
        onChange={(v) => handleField('category', v)}
        hint="Pilih kategori yang sesuai dengan kompetensi."
      >
        {CATEGORY_OPTIONS.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </SelectDropdown>

      {/* level */}
      <SelectDropdown
        label="Level Soal"
        value={formData.level}
        onChange={(v) => handleField('level', v)}
        hint="PARENT/STUDENT memakai level anak, TEACHER memakai level guru."
      >
        <option value="CHILD">Anak / Dasar</option>
        <option value="TEACHER">Teacher / Advanced</option>
      </SelectDropdown>

      {/* icon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black text-on-surface">Ikon</label>
        <div className="relative">
          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {ICON_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        </div>
        <p className="text-[11px] text-on-surface-variant">Pilih ikon untuk ditampilkan pada kategori.</p>
      </div>

      {/* color swatches */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-black text-on-surface">Warna Latar</label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleField('color', opt.value)}
              className="group flex flex-col items-center gap-1.5 rounded-[12px] border-2 p-2 transition-all"
              style={{
                borderColor: formData.color === opt.value ? '#005da7' : 'transparent',
                background: opt.swatch,
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                {formData.color === opt.value && (
                  <Check className="h-4 w-4" style={{ color: '#005da7' }} />
                )}
              </div>
              <span className="text-center text-[9px] font-bold leading-tight text-on-surface">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-on-surface-variant">
          Warna yang dipilih akan mempengaruhi tampilan chip kategori di daftar.
        </p>
      </div>

      {/* live preview */}
      <div className="flex flex-col gap-2 rounded-[16px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-on-surface-variant">
          Preview Tampilan Kategori
        </p>
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${previewColor.bg}`}
          >
            <PreviewIcon className={`h-5 w-5 ${previewColor.fg}`} aria-hidden="true" />
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-black ${previewColor.bg} ${previewColor.fg}`}
          >
            {formData.category || 'Kategori'}
          </span>
        </div>
        <p className="text-[11px] text-on-surface-variant">
          Ini adalah tampilan kategori yang akan muncul di daftar.
        </p>
      </div>

      {/* actions */}
      <div className="flex justify-end gap-3 border-t border-outline-variant/20 pt-4">
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
          className="rounded-[14px] font-black px-6 shadow-[0_5px_0_0_#004883]"
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
