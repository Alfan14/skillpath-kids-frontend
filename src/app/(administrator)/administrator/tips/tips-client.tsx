'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Clock,
  Edit2,
  Lightbulb,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { deleteTip } from '@/actions/tip-actions';
import { TipForm } from '@/components/forms/tip-form';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getToken } from '@/lib/auth';
import { iconMap } from '@/lib/icon-map';
import type { Recommendation } from '@/types';

type AdminTip = Recommendation & {
  createdAt?: string;
  updatedAt?: string;
  color?: string | null;
  accentColor?: string | null;
};

const CATEGORY_COLORS: Record<string, { bg: string; fg: string; swatch: string }> = {
  'Motorik Halus': { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', swatch: '#d4e3ff' },
  'Motorik Kasar': { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', swatch: '#96f89f' },
  Kognitif: { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
  Bahasa: { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', swatch: '#ffe173' },
  Sosial: { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', swatch: '#ffd6d6' },
  Sensorial: { bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', swatch: '#ffddb7' },
  Kreativitas: { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
};

function getCategoryStyle(category: string | null | undefined) {
  return CATEGORY_COLORS[String(category ?? '')] ?? {
    bg: 'bg-[#e5e7eb]',
    fg: 'text-[#374151]',
    swatch: '#e5e7eb',
  };
}

function getTipIcon(iconName: string | null | undefined) {
  if (!iconName) return Lightbulb;
  return iconMap[iconName] ?? Lightbulb;
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function TipsClient({ tips }: { tips: Recommendation[] }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Recommendation | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tipToDelete, setTipToDelete] = useState<Recommendation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const adminTips = tips as AdminTip[];
  const mainCount = adminTips.filter((tip) => tip.isMain).length;
  const categories = Array.from(new Set(adminTips.map((tip) => tip.category).filter(Boolean)));

  const handleAddNew = () => {
    setEditingTip(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tip: Recommendation) => {
    setEditingTip(tip);
    setIsFormOpen(true);
  };

  const confirmDelete = (tip: Recommendation) => {
    setTipToDelete(tip);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tipToDelete) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      await deleteTip(Number(tipToDelete.id), token || '');
      setIsDeleteModalOpen(false);
      setTipToDelete(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus tip');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Tips Management
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Aktivitas & Panduan
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883]">
              Kelola Tips & Rekomendasi
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Atur tips aktivitas dan rekomendasi pendampingan untuk Parent, Student, dan Teacher.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={Lightbulb} label="Total Tips" value={adminTips.length} tone="blue" />
              <SummaryCard icon={Sparkles} label="Rekomendasi Utama" value={mainCount} tone="yellow" />
              <SummaryCard icon={RefreshCw} label="Kategori" value={categories.length} tone="green" />
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminTipsManagement}
            alt="Ilustrasi manajemen tips administrator"
            width={340}
            height={270}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[200px] shrink-0 motion-reduce:animate-none sm:max-w-[240px] lg:mx-0 lg:max-w-[320px]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Bank rekomendasi</p>
          <h2 className="text-lg font-black text-on-surface">Daftar Tips</h2>
          <p className="text-sm text-on-surface-variant">
            Menampilkan {adminTips.length} tips dari endpoint Tips.
          </p>
        </div>
        <Button
          variant="primary"
          className="rounded-[16px] font-black shadow-[0_5px_0_0_#004883]"
          onClick={handleAddNew}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Baru
        </Button>
      </section>

      {adminTips.length === 0 ? (
        <EmptyTipsState onAdd={handleAddNew} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {adminTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          ))}
        </section>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1d24]/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_70px_rgba(15,29,36,0.24)]">
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-[#d4e3ff] bg-white px-6 pb-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe173]">
                  <Lightbulb className="h-5 w-5 text-[#0f1d24]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-on-surface">
                    {editingTip ? 'Edit Tip' : 'Tambah Tip'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {editingTip
                      ? 'Perbarui rekomendasi aktivitas tanpa mengubah struktur payload.'
                      : 'Buat rekomendasi aktivitas baru untuk pengguna SkillPath Kids.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Tutup form"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <TipForm
                initialData={editingTip}
                onSuccess={() => setIsFormOpen(false)}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1d24]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_70px_rgba(15,29,36,0.24)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
              <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-black text-on-surface">Hapus Tip?</h3>
            <p className="mb-4 text-sm text-on-surface-variant">
              Yakin ingin menghapus tips ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {tipToDelete && (
              <div className="mb-5 rounded-2xl border border-[#d4e3ff] bg-surface-container-lowest p-4">
                <p className="line-clamp-1 text-sm font-black text-on-surface">{tipToDelete.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{tipToDelete.description}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone: 'blue' | 'green' | 'yellow';
}) {
  const toneClass = {
    blue: 'bg-[#d4e3ff] text-[#004883]',
    green: 'bg-[#96f89f] text-[#00531d]',
    yellow: 'bg-[#ffe173] text-[#0f1d24]',
  }[tone];

  return (
    <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)] transition-all duration-200 hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-black text-[#0f1d24]">{value}</p>
          <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
        </div>
      </div>
    </div>
  );
}

function TipCard({
  tip,
  onEdit,
  onDelete,
}: {
  tip: AdminTip;
  onEdit: (tip: Recommendation) => void;
  onDelete: (tip: Recommendation) => void;
}) {
  const categoryStyle = getCategoryStyle(tip.category);
  const Icon = getTipIcon(tip.icon);
  const swatch = tip.accentColor || tip.color || categoryStyle.swatch;

  return (
    <article className="group flex min-h-56 flex-col rounded-[22px] border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_14px_34px_rgba(0,72,131,0.11)] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${categoryStyle.bg}`}>
          <Icon className={`h-6 w-6 ${categoryStyle.fg}`} aria-hidden="true" />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {tip.isMain && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe173] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#0f1d24]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Rekomendasi Utama
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${categoryStyle.bg} ${categoryStyle.fg}`}>
            {tip.category || 'Kategori'}
          </span>
        </div>
      </div>

      <h3 className="line-clamp-2 text-base font-black text-on-surface">{tip.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
        {tip.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#96f89f] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#00531d]">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {tip.duration || 'Durasi'}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[10px] font-black text-[#374151]">
          <span
            className="h-2.5 w-2.5 rounded-full border border-black/10"
            style={{ backgroundColor: swatch }}
            aria-hidden="true"
          />
          {tip.icon || 'Lightbulb'}
        </span>
        <span className="rounded-full bg-[#f3e8ff] px-2.5 py-1 text-[10px] font-black text-[#6b21a8]">
          Dibuat: {formatDate(tip.createdAt)}
        </span>
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-[#d4e3ff] pt-4">
        <button
          type="button"
          onClick={() => onEdit(tip)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d4e3ff] bg-white px-3 py-2 text-xs font-black text-[#004883] transition-colors hover:bg-[#d4e3ff]"
          aria-label={`Edit tip ${tip.id}`}
        >
          <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(tip)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ffd6d6] bg-white px-3 py-2 text-xs font-black text-[#ba1a1a] transition-colors hover:bg-[#ffd6d6]"
          aria-label={`Hapus tip ${tip.id}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Hapus
        </button>
      </div>
    </article>
  );
}

function EmptyTipsState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
      <Image
        src={APP_IMAGES.adminEmptyState}
        alt="Ilustrasi tips kosong"
        width={220}
        height={180}
        className="mb-4 h-auto w-full max-w-[190px]"
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4e3ff] text-[#004883]">
        <Lightbulb className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-black text-on-surface">Belum ada tips</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
        Tambahkan tips aktivitas untuk membantu pengguna mendapatkan rekomendasi yang sesuai.
      </p>
      <Button variant="primary" className="mt-6 rounded-[14px] font-black" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah Tip
      </Button>
    </div>
  );
}
