'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  BookOpen,
  Edit2,
  ExternalLink,
  FileText,
  FolderOpen,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

import { deleteFile } from '@/actions/file-actions';
import { FileForm } from '@/components/forms/file-form';
import { Button } from '@/components/ui/button';
import { APP_IMAGES } from '@/lib/assets';
import { getToken } from '@/lib/auth';
import { iconMap } from '@/lib/icon-map';
import { formatCurrency } from '@/lib/utils';
import type { Worksheet } from '@/types';

type AdminFile = Worksheet & {
  name?: string | null;
  shortDescription?: string | null;
  category?: string | null;
  subCategory?: string | null;
  price?: number | string | null;
  discountPrice?: number | string | null;
  discountPercent?: number | string | null;
  mainImageUrl?: string | null;
  fileUrl?: string | null;
  iconName?: string | null;
  accentColor?: string | null;
  isPublished?: boolean | null;
  isBestSeller?: boolean | null;
  isPromo?: boolean | null;
  createdAt?: string | null;
};

const ACCENT_STYLES: Record<string, { bg: string; fg: string; swatch: string }> = {
  primary: { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', swatch: '#d4e3ff' },
  tertiary: { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', swatch: '#96f89f' },
  secondary: { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', swatch: '#ffe173' },
  softRed: { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', swatch: '#ffd6d6' },
  softPurple: { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
  softOrange: { bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', swatch: '#ffddb7' },
  neutral: { bg: 'bg-[#e5e7eb]', fg: 'text-[#374151]', swatch: '#e5e7eb' },
};

function isPaidFile(file: AdminFile) {
  const variant = String(file.variant ?? '').toUpperCase();
  const price = Number(file.discountPrice ?? file.price ?? 0);

  if (variant === 'PAID' || variant === 'BERBAYAR' || variant === 'PREMIUM') return true;
  if (variant === 'FREE' || variant === 'GRATIS') return false;

  return Number.isFinite(price) && price > 0;
}

function getFileTitle(file: AdminFile) {
  return file.title || file.name || 'Untitled File';
}

function getFileUrl(file: AdminFile) {
  return file.url || file.fileUrl || '';
}

function getFileIcon(file: AdminFile) {
  const iconName = file.icon || file.iconName || 'FileText';
  return iconMap[iconName] ?? FileText;
}

function getAccent(file: AdminFile) {
  return ACCENT_STYLES[file.accent || file.accentColor || 'primary'] ?? ACCENT_STYLES.primary;
}

function getEffectivePrice(file: AdminFile) {
  const parsed = Number(file.discountPrice ?? file.price ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function FilesClient({ files }: { files: Worksheet[] }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<Worksheet | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<Worksheet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const adminFiles = files as AdminFile[];
  const paidCount = adminFiles.filter(isPaidFile).length;
  const freeCount = adminFiles.length - paidCount;
  const publishedCount = adminFiles.filter((file) => file.isPublished !== false).length;

  const handleAddNew = () => {
    setEditingFile(null);
    setIsFormOpen(true);
  };

  const handleEdit = (file: Worksheet) => {
    setEditingFile(file);
    setIsFormOpen(true);
  };

  const confirmDelete = (file: Worksheet) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      await deleteFile(Number(fileToDelete.id), token || '');
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus file');
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
                Resource Management
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                Files & E-Commerce
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883]">
              Kelola Files & Worksheets
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Atur materi pembelajaran, worksheet, file gratis, dan produk berbayar SkillPathKids.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={FolderOpen} label="Total Files" value={adminFiles.length} tone="blue" />
              <SummaryCard icon={FileText} label="Gratis" value={freeCount} tone="green" />
              <SummaryCard icon={Sparkles} label="Berbayar" value={paidCount} tone="yellow" />
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminFilesManagement}
            alt="Ilustrasi manajemen files administrator"
            width={340}
            height={270}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[200px] shrink-0 motion-reduce:animate-none sm:max-w-[240px] lg:mx-0 lg:max-w-[320px]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Library resource</p>
          <h2 className="text-lg font-black text-on-surface">Daftar Files</h2>
          <p className="text-sm text-on-surface-variant">
            {publishedCount} published dari {adminFiles.length} file terdaftar.
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

      {adminFiles.length === 0 ? (
        <EmptyFilesState onAdd={handleAddNew} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {adminFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4e3ff]">
                  <FileText className="h-5 w-5 text-[#004883]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-on-surface">
                    {editingFile ? 'Edit File' : 'Tambah File'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Kelola materi worksheet dan file pembelajaran tanpa mengubah payload.
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
              <FileForm
                initialData={editingFile}
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
            <h3 className="mb-2 text-lg font-black text-on-surface">Hapus File?</h3>
            <p className="mb-4 text-sm text-on-surface-variant">
              Yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {fileToDelete && (
              <div className="mb-5 rounded-2xl border border-[#d4e3ff] bg-surface-container-lowest p-4">
                <p className="line-clamp-1 text-sm font-black text-on-surface">{fileToDelete.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">{fileToDelete.description}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>Hapus</Button>
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

function FileCard({
  file,
  onEdit,
  onDelete,
}: {
  file: AdminFile;
  onEdit: (file: Worksheet) => void;
  onDelete: (file: Worksheet) => void;
}) {
  const accent = getAccent(file);
  const Icon = getFileIcon(file);
  const paid = isPaidFile(file);
  const fileUrl = getFileUrl(file);
  const price = getEffectivePrice(file);

  return (
    <article className="group flex min-h-64 flex-col overflow-hidden rounded-[22px] border border-[#d4e3ff] bg-white shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_14px_34px_rgba(0,72,131,0.11)] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#d4e3ff]/45">
          {file.mainImageUrl ? (
            <img src={file.mainImageUrl} alt={getFileTitle(file)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-3">
              <Image
                src={APP_IMAGES.worksheetLibrary}
                alt="Ilustrasi worksheet"
                width={96}
                height={96}
                className="h-auto w-full"
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className={paid ? 'rounded-full bg-[#ffe173] px-2.5 py-1 text-[10px] font-black uppercase text-[#0f1d24]' : 'rounded-full bg-[#96f89f] px-2.5 py-1 text-[10px] font-black uppercase text-[#00531d]'}>
              {paid ? 'Berbayar' : 'Gratis'}
            </span>
            {file.isPublished === false ? (
              <span className="rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[10px] font-black uppercase text-[#374151]">
                Draft
              </span>
            ) : (
              <span className="rounded-full bg-[#96f89f] px-2.5 py-1 text-[10px] font-black uppercase text-[#00531d]">
                Published
              </span>
            )}
            {file.isPromo && (
              <span className="rounded-full bg-[#ffd6d6] px-2.5 py-1 text-[10px] font-black uppercase text-[#ba1a1a]">
                Promo
              </span>
            )}
            {file.isBestSeller && (
              <span className="rounded-full bg-[#f3e8ff] px-2.5 py-1 text-[10px] font-black uppercase text-[#6b21a8]">
                Best Seller
              </span>
            )}
            {file.badge && (
              <span className="rounded-full bg-[#d4e3ff] px-2.5 py-1 text-[10px] font-black uppercase text-[#004883]">
                {file.badge}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-base font-black text-on-surface">{getFileTitle(file)}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
            {file.shortDescription || file.description || 'Deskripsi file belum tersedia.'}
          </p>
        </div>
      </div>

      <div className="mt-auto border-t border-[#d4e3ff] px-4 py-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${accent.bg} ${accent.fg}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {file.category || file.subCategory || 'Resource'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[10px] font-black text-[#374151]">
            <span
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: accent.swatch }}
              aria-hidden="true"
            />
            {file.icon || file.iconName || 'FileText'}
          </span>
          {paid && (
            <span className="rounded-full bg-[#ffe173] px-2.5 py-1 text-[10px] font-black text-[#0f1d24]">
              {formatCurrency(price)}
            </span>
          )}
          <span className="rounded-full bg-[#f3e8ff] px-2.5 py-1 text-[10px] font-black text-[#6b21a8]">
            Dibuat: {formatDate(file.createdAt)}
          </span>
        </div>

        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex min-w-0 items-center gap-1.5 rounded-xl bg-surface-container-lowest px-3 py-2 text-xs font-bold text-[#004883]"
          >
            <span className="truncate">{fileUrl}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <div className="mb-3 rounded-xl bg-surface-container-lowest px-3 py-2 text-xs font-bold text-on-surface-variant">
            URL file belum tersedia
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(file)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d4e3ff] bg-white px-3 py-2 text-xs font-black text-[#004883] transition-colors hover:bg-[#d4e3ff]"
            aria-label={`Edit file ${file.id}`}
          >
            <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ffd6d6] bg-white px-3 py-2 text-xs font-black text-[#ba1a1a] transition-colors hover:bg-[#ffd6d6]"
            aria-label={`Hapus file ${file.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyFilesState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
      <Image
        src={APP_IMAGES.adminEmptyState}
        alt="Ilustrasi file kosong"
        width={220}
        height={180}
        className="mb-4 h-auto w-full max-w-[190px]"
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4e3ff] text-[#004883]">
        <BookOpen className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-black text-on-surface">Belum ada file atau worksheet</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
        Tambahkan materi pembelajaran agar dapat diakses oleh Parent dan Teacher.
      </p>
      <Button variant="primary" className="mt-6 rounded-[14px] font-black" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah File
      </Button>
    </div>
  );
}
