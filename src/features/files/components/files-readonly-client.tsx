'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Download, FileText, Loader2, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/badge';
import { APP_IMAGES } from '@/lib/assets';
import { getIcon, iconMap } from '@/lib/icon-map';
import { useUiSound } from '@/hooks/use-ui-sound';
import {
  buildWhatsAppOrderUrl,
  isPaidFile,
  type FileOrderItem,
} from '@/features/files/utils/whatsapp-order';
import type { Worksheet } from '@/types';

interface FilesReadonlyClientProps {
  initialFiles?: Worksheet[];
}

type DashboardFile = Worksheet & FileOrderItem;

const ACCENT_STYLES: Record<string, { bg: string; fg: string; border: string }> = {
  primary: { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', border: 'border-[#d4e3ff]' },
  secondary: { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', border: 'border-[#ffe173]' },
  tertiary: { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', border: 'border-[#96f89f]' },
  softRed: { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', border: 'border-[#ffd6d6]' },
  softPurple: { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', border: 'border-[#f3e8ff]' },
  softOrange: { bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', border: 'border-[#ffddb7]' },
  neutral: { bg: 'bg-[#e5e7eb]', fg: 'text-[#374151]', border: 'border-[#e5e7eb]' },
};

function getFileIcon(iconName: string | null | undefined) {
  if (!iconName || !iconMap[iconName]) return FileText;
  return getIcon(iconName);
}

function normalizeFiles(payload: any): DashboardFile[] {
  const rawFiles = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.data)
      ? payload.data.data
      : Array.isArray(payload)
        ? payload
        : [];

  return rawFiles.map((file: any) => ({
    ...file,
    id: file.id,
    title: file.title || file.name || 'Untitled File',
    description: file.description || '',
    url: file.url || '',
    variant: file.variant || file.label || file.type || (Number(file.discountPrice ?? file.price ?? 0) > 0 ? 'paid' : 'free'),
    badge: file.badge || '',
    icon: file.icon || file.iconName || 'FileText',
    accent: file.accent || file.accentColor || 'primary',
    category: file.category || file.subCategory || '',
    price: file.price,
    discountPrice: file.discountPrice,
  }));
}

export function FilesReadonlyClient({ initialFiles = [] }: FilesReadonlyClientProps) {
  const [files, setFiles] = useState<DashboardFile[]>(initialFiles);
  const [loading, setLoading] = useState(initialFiles.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState('');
  const { playTap, playSuccess } = useUiSound();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`, {
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Gagal memuat file.');
      }

      setFiles(normalizeFiles(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat file.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <FilesHeader />
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-3 rounded-[22px] border border-[#d4e3ff] bg-white p-8 text-center shadow-[0_16px_40px_rgba(0,72,131,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4e3ff]">
            <Loader2 className="h-7 w-7 animate-spin text-[#004883]" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-on-surface-variant">Memuat koleksi file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <FilesHeader />
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border border-[#ffd6d6] bg-white p-8 text-center shadow-[0_16px_40px_rgba(186,26,26,0.06)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-black text-on-surface">Gagal Memuat File</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{error}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            icon={RefreshCw}
            className="press-soft"
            onClick={() => {
              playTap();
              fetchFiles();
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <FilesHeader />

      {files.length === 0 ? (
        <div className="animate-fade-up flex min-h-64 flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_16px_40px_rgba(0,72,131,0.08)]">
          <Image
            src={APP_IMAGES.filesCard}
            alt="Ilustrasi file pembelajaran"
            width={220}
            height={180}
            className="animate-float-soft h-auto w-full max-w-[180px] sm:max-w-[220px]"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-black text-on-surface">Belum ada file tersedia</h2>
            <p className="max-w-md text-sm font-medium leading-relaxed text-on-surface-variant">
              Materi worksheet akan muncul di sini setelah ditambahkan.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.icon);
            const isPaid = isPaidFile(file);
            const whatsappUrl = isPaid ? buildWhatsAppOrderUrl(file, pageUrl) : null;
            const accent = ACCENT_STYLES[file.accent] ?? ACCENT_STYLES.primary;

            return (
              <article
                key={file.id}
                className={`hover-lift-soft flex min-h-60 flex-col rounded-[22px] border-2 bg-white p-5 shadow-[0_12px_32px_rgba(0,93,167,0.08)] hover:shadow-[0_16px_40px_rgba(0,93,167,0.12)] ${accent.border}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`group flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${accent.bg}`}>
                    <Icon className={`h-7 w-7 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${accent.fg}`} aria-hidden="true" />
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <BadgePill className={isPaid ? 'bg-[#ffe173] text-[#0f1d24]' : 'bg-[#96f89f] text-[#00531d]'}>
                      {isPaid ? 'Berbayar' : 'Gratis'}
                    </BadgePill>
                    {file.badge && (
                      <BadgePill className="bg-[#d4e3ff] text-[#004883]">
                        {file.badge}
                      </BadgePill>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-black text-on-surface">{file.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
                  {file.description || 'Deskripsi file belum tersedia.'}
                </p>

                {isPaid ? (
                  whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playSuccess}
                      className="press-soft group mt-5 inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#00531d] px-4 py-3 text-sm font-black text-white shadow-[0_4px_0_0_#003d15] transition-transform hover:translate-y-[1px] motion-reduce:transition-none"
                    >
                      <MessageCircle className="h-4 w-4 transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
                      Pesan via WhatsApp
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-[16px] bg-surface-container px-4 py-3 text-sm font-black text-on-surface-variant"
                    >
                      Nomor WhatsApp belum dikonfigurasi
                    </button>
                  )
                ) : file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playTap}
                    className="press-soft group mt-5 inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#004883] px-4 py-3 text-sm font-black text-white shadow-[0_4px_0_0_#002f55] transition-transform hover:translate-y-[1px] motion-reduce:transition-none"
                  >
                    <Download className="h-4 w-4 transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" aria-hidden="true" />
                    Buka File
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-[16px] bg-surface-container px-4 py-3 text-sm font-black text-on-surface-variant"
                  >
                    File belum tersedia
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      <footer className="pb-4 text-center text-xs text-on-surface-variant">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}

function FilesHeader() {
  return (
    <div className="animate-fade-up overflow-hidden rounded-[24px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffe173] shadow-[0_6px_0_#e8c900]">
            <FileText className="h-7 w-7 text-[#0f1d24]" aria-hidden="true" />
          </div>
          <div>
            <BadgePill className="mb-2 bg-[#96f89f] text-[#00531d]">
              File Pembelajaran
            </BadgePill>
            <h1 className="text-2xl font-black text-[#004883] sm:text-3xl">
              Koleksi Worksheet
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Akses materi worksheet dan file pendukung perkembangan anak.
            </p>
          </div>
        </div>
        <Image
          src={APP_IMAGES.filesHero}
          alt="Ilustrasi worksheet dan file pembelajaran"
          width={260}
          height={210}
          priority
          className="animate-float-soft mx-auto h-auto w-full max-w-[180px] shrink-0 sm:mx-0 sm:max-w-[220px]"
        />
      </div>
    </div>
  );
}
