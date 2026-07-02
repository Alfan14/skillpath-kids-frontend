'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, FileText, RotateCcw, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProductCard } from '@/components/shop/ProductCard';
import { useUiSound } from '@/hooks/use-ui-sound';
import { APP_IMAGES } from '@/lib/assets';
import type { WorksheetProduct } from '@/types';
import {
  formatWorksheetPrice,
  getWorksheetEffectivePrice,
} from '@/features/worksheets/utils/whatsapp-order';

interface WorksheetCatalogProps {
  worksheets: WorksheetProduct[];
  bestSellers: WorksheetProduct[];
  categories: string[];
  basePath?: string;
  breadcrumbLabel?: string;
}

export function WorksheetCatalog({ worksheets, bestSellers, categories, basePath = '/worksheets', breadcrumbLabel = 'Worksheets' }: WorksheetCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playTap, playSoft } = useUiSound();

  const currentCategory = searchParams.get('category') || '';
  const currentVariant = searchParams.get('variant') || '';

  const handleFilter = (key: string, value: string) => {
    playTap();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  const getFilterClass = (active: boolean) => [
    'press-soft w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors duration-150 motion-reduce:transition-none',
    active
      ? 'bg-[#d4e3ff] text-[#004883]'
      : 'text-on-surface-variant hover:bg-[#d4e3ff]/60 hover:text-[#004883]',
  ].join(' ');

  return (
    <div className="animate-fade-up mt-6 flex flex-col gap-6 md:flex-row">
      <aside className="flex w-full flex-shrink-0 flex-col gap-6 md:w-64">
        <div className="rounded-2xl border border-[#d4e3ff] bg-white p-5 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
          <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-on-surface">
            Kategori
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                type="button"
                onClick={() => handleFilter('category', '')}
                className={getFilterClass(!currentCategory)}
              >
                Semua Produk
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => handleFilter('category', cat)}
                  className={getFilterClass(currentCategory === cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#d4e3ff] bg-white p-5 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
          <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-on-surface">
            Harga
          </h3>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                type="button"
                onClick={() => handleFilter('variant', '')}
                className={getFilterClass(!currentVariant)}
              >
                Semua
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleFilter('variant', 'FREE')}
                className={getFilterClass(currentVariant === 'FREE')}
              >
                Gratis
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleFilter('variant', 'PAID')}
                className={getFilterClass(currentVariant === 'PAID')}
              >
                Berbayar
              </button>
            </li>
          </ul>
        </div>

        <div className="hidden rounded-2xl border border-[#d4e3ff] bg-white p-5 shadow-[0_10px_28px_rgba(0,72,131,0.06)] md:block">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-on-surface">
            <Star className="h-4 w-4 fill-[#ffe173] text-[#0f1d24]" aria-hidden="true" />
            Terlaris
          </h3>
          <div className="flex flex-col gap-4">
            {bestSellers.slice(0, 3).map((product) => (
              <Link
                href={`/worksheets/${product.slug}`}
                key={product.id}
                onClick={playTap}
                className="group flex gap-3"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#d4e3ff]/45">
                  {product.mainImageUrl ? (
                    <img
                      src={product.mainImageUrl}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-2">
                      <Image
                        src={APP_IMAGES.worksheetLibrary}
                        alt="Ilustrasi worksheet"
                        width={64}
                        height={64}
                        className="h-auto w-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <h4 className="line-clamp-2 text-xs font-bold text-on-surface transition-colors group-hover:text-[#004883]">
                    {product.title}
                  </h4>
                  <p className="mt-1 text-[10px] font-bold text-[#004883]">
                    {formatWorksheetPrice(getWorksheetEffectivePrice(product))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-[#004883]">Beranda</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="font-bold text-on-surface">{breadcrumbLabel}</span>
          <span className="ml-2 rounded-full bg-[#d4e3ff] px-2 py-0.5 font-bold text-[#004883]">
            {worksheets.length} Produk
          </span>
        </div>

        {worksheets.length > 0 ? (
          <div className="animate-fade-up grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {worksheets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
            <Image
              src={APP_IMAGES.teacherEmptyState}
              alt="Ilustrasi data worksheet kosong"
              width={220}
              height={180}
              className="mb-4 h-auto w-full max-w-[190px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
            />
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d4e3ff] text-[#004883]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-black text-on-surface">Belum ada file tersedia</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
              Materi dan worksheet akan muncul setelah ditambahkan oleh administrator.
            </p>
            <button
              type="button"
              onClick={() => {
                playSoft();
                router.push(basePath);
              }}
              className="press-soft mt-6 inline-flex items-center gap-2 rounded-xl bg-[#004883] px-5 py-2.5 text-sm font-black text-white transition-colors duration-150 hover:bg-[#003b6b] motion-reduce:transition-none"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
