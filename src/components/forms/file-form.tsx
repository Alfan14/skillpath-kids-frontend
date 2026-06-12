'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createFile, updateFile } from '@/actions/file-actions';
import { APP_IMAGES } from '@/lib/assets';
import { getToken } from '@/lib/auth';
import type { Worksheet } from '@/types';
import { AlertTriangle, CheckCircle2, ChevronDown, ExternalLink, FileText, Loader2, UploadCloud } from 'lucide-react';
import { iconMap } from '@/lib/icon-map';

interface FileFormProps {
  initialData?: Worksheet | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ACCENT_OPTIONS = [
  { value: 'primary', label: 'Primary', bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', swatch: '#d4e3ff' },
  { value: 'tertiary', label: 'Soft Green', bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', swatch: '#96f89f' },
  { value: 'secondary', label: 'Soft Yellow', bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', swatch: '#ffe173' },
  { value: 'softRed', label: 'Soft Red', bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', swatch: '#ffd6d6' },
  { value: 'softPurple', label: 'Soft Purple', bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
  { value: 'softOrange', label: 'Soft Orange', bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', swatch: '#ffddb7' },
  { value: 'neutral', label: 'Neutral', bg: 'bg-[#e5e7eb]', fg: 'text-[#374151]', swatch: '#e5e7eb' },
];

const ICON_OPTIONS = ['FileText', 'BookOpen', 'Scissors', 'Palette', 'Brush', 'Shapes'];
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.webp'];
const ACCEPTED_FILE_TYPES = ACCEPTED_EXTENSIONS.join(',');

type UrlInputMode = 'upload' | 'manual';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

function validateUploadFile(file: File) {
  const extension = file.name.includes('.')
    ? `.${file.name.split('.').pop()?.toLowerCase()}`
    : '';

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return 'Format file tidak didukung. Gunakan PDF, Office document, atau gambar.';
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return 'Ukuran file maksimal 10MB.';
  }

  return null;
}

export function FileForm({ initialData, onSuccess, onCancel }: FileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInputMode, setUrlInputMode] = useState<UrlInputMode>('upload');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadMessage, setUploadMessage] = useState(initialData?.url ? `File saat ini: ${initialData.url}` : 'Belum ada file');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    variant: initialData?.variant || 'free',
    accent: initialData?.accent || 'primary',
    badge: initialData?.badge || '',
    icon: initialData?.icon || 'FileText',
  });

  const accentPreview =
    ACCENT_OPTIONS.find((option) => option.value === formData.accent) ?? ACCENT_OPTIONS[0];
  const SelectedIcon = iconMap[formData.icon] ?? FileText;
  const previewTitle = formData.title.trim() || 'Judul File';
  const previewDescription = formData.description.trim() || 'Ringkasan file akan tampil di sini.';
  const previewBadge = formData.badge.trim();
  const previewUrl = formData.url.trim() || 'Belum ada URL';
  const previewVariant = formData.variant === 'paid' || formData.variant === 'PAID' ? 'Paid' : 'Free';
  const hasKnownIcon = ICON_OPTIONS.includes(formData.icon);
  const hasKnownAccent = ACCENT_OPTIONS.some((option) => option.value === formData.accent);
  const hasFileUrl = formData.url.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileName('');
      setUploadStatus('idle');
      setUploadMessage(hasFileUrl ? `File saat ini: ${formData.url}` : 'Belum ada file');
      return;
    }

    setSelectedFileName(file.name);
    setError(null);

    const validationError = validateUploadFile(file);
    if (validationError) {
      setUploadStatus('error');
      setUploadMessage(validationError);
      return;
    }

    const token = getToken();
    if (!token) {
      setUploadStatus('error');
      setUploadMessage('Anda harus login terlebih dahulu untuk upload file.');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      setUploadStatus('uploading');
      setUploadMessage('Mengupload...');

      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });
      const data = await response.json();

      if (!response.ok || !data?.success || !data?.url) {
        throw new Error(data?.message || 'Upload gagal.');
      }

      setFormData(prev => ({ ...prev, url: data.url }));
      setUploadStatus('success');
      setUploadMessage(`Upload berhasil: ${data.url}`);
    } catch (err: any) {
      setUploadStatus('error');
      setUploadMessage(err.message || 'Upload gagal. Coba lagi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadStatus === 'uploading') {
      setError('Tunggu proses upload selesai sebelum menyimpan file.');
      return;
    }
    if (!formData.url.trim()) {
      setError('Upload file atau isi URL manual terlebih dahulu.');
      return;
    }
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

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-black text-on-surface">Upload File</label>
          <div className="flex rounded-[12px] border border-outline-variant/40 bg-surface-container-lowest p-1">
            <button
              type="button"
              onClick={() => setUrlInputMode('upload')}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-black transition ${
                urlInputMode === 'upload' ? 'bg-[#d4e3ff] text-[#004883]' : 'text-on-surface-variant'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUrlInputMode('manual')}
              className={`rounded-[9px] px-3 py-1.5 text-xs font-black transition ${
                urlInputMode === 'manual' ? 'bg-[#d4e3ff] text-[#004883]' : 'text-on-surface-variant'
              }`}
            >
              URL Manual
            </button>
          </div>
        </div>

        {urlInputMode === 'upload' ? (
          <div className="rounded-[16px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#d4e3ff]">
                {uploadStatus === 'uploading' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#004883]" aria-hidden="true" />
                ) : uploadStatus === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#00531d]" aria-hidden="true" />
                ) : (
                  <UploadCloud className="h-5 w-5 text-[#004883]" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileUpload}
                  disabled={uploadStatus === 'uploading'}
                  className="block w-full cursor-pointer rounded-[14px] border-2 border-outline-variant/50 bg-white text-sm font-medium text-on-surface file:mr-4 file:border-0 file:bg-[#d4e3ff] file:px-4 file:py-3 file:text-sm file:font-black file:text-[#004883] hover:file:bg-[#c4d8ff] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="mt-2 flex flex-col gap-1 text-[11px]">
                  <p className="font-bold text-on-surface-variant">
                    {selectedFileName || 'Belum ada file dipilih'}
                  </p>
                  <p className={`font-bold ${
                    uploadStatus === 'error'
                      ? 'text-error'
                      : uploadStatus === 'success'
                        ? 'text-[#00531d]'
                        : 'text-on-surface-variant'
                  }`}>
                    {uploadMessage}
                  </p>
                  <p className="text-on-surface-variant">
                    Format: PDF, Word, Excel, PowerPoint, PNG, JPG, WebP. Maksimal 10MB.
                  </p>
                </div>
              </div>
              <Image
                src={APP_IMAGES.adminUploadIllustration}
                alt="Ilustrasi upload file"
                width={118}
                height={96}
                className="hidden h-auto w-[92px] shrink-0 sm:block"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-[16px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#d4e3ff]">
                <FileText className="h-5 w-5 text-[#004883]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <input
                  name="url"
                  type="text"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://... atau /uploads/files/nama-file.pdf"
                  className="w-full rounded-[14px] border-2 border-outline-variant/50 bg-white px-4 py-3 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-2 text-[11px] text-on-surface-variant">
                  Fallback manual jika file sudah tersedia di URL tertentu.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasFileUrl && (
          <div className="flex flex-wrap items-center gap-2 rounded-[14px] border border-outline-variant/30 bg-white px-3 py-2 text-xs">
            <span className="min-w-0 flex-1 truncate font-bold text-on-surface-variant">
              File saat ini: {formData.url}
            </span>
            <a
              href={formData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-black text-primary"
            >
              Buka file
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
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
              {ACCENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              {!hasKnownAccent && (
                <option value={formData.accent}>{formData.accent}</option>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          </div>
          <div className={`flex items-center gap-2 rounded-[12px] border border-outline-variant/30 px-3 py-2 ${accentPreview.bg} ${accentPreview.fg}`}>
            <span
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ backgroundColor: accentPreview.swatch }}
              aria-hidden="true"
            />
            <span className="text-xs font-black">{accentPreview.label}</span>
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
          <div className="flex gap-2">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${accentPreview.bg}`}>
              <SelectedIcon className={`h-5 w-5 ${accentPreview.fg}`} aria-hidden="true" />
            </div>
            <div className="relative flex-1">
              <select 
                name="icon" 
                value={formData.icon}
                onChange={handleChange}
                className="w-full appearance-none rounded-[14px] border-2 border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pr-10 text-sm font-semibold text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {ICON_OPTIONS.map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
                {!hasKnownIcon && (
                  <option value={formData.icon}>{formData.icon}</option>
                )}
              </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-outline-variant/30 bg-white p-4 shadow-[0_4px_16px_rgba(0,93,167,0.05)]">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-on-surface-variant">
          Preview Tampilan
        </p>
        <div className="flex items-start gap-3">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${accentPreview.bg}`}>
            <SelectedIcon className={`h-7 w-7 ${accentPreview.fg}`} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${accentPreview.bg} ${accentPreview.fg}`}>
                {previewVariant}
              </span>
              {previewBadge && (
                <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-black uppercase text-on-surface-variant">
                  {previewBadge}
                </span>
              )}
            </div>
            <h3 className="truncate text-sm font-black text-on-surface">{previewTitle}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
              {previewDescription}
            </p>
            <p className="mt-2 truncate text-[11px] font-bold text-primary">
              {previewUrl}
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
          loading={loading || uploadStatus === 'uploading'}
          disabled={loading || uploadStatus === 'uploading'}
          className="rounded-[14px] px-6 font-black shadow-[0_5px_0_0_#004883]"
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}
