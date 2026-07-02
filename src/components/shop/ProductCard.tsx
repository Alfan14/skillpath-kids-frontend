'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ExternalLink,
  FileText,
  MessageCircle,
  ShoppingBag,
  Star,
} from 'lucide-react';

import {
  createWhatsAppOrderUrl,
  getWorksheetEffectivePrice,
  getWorksheetWhatsAppNumber,
  isFreeWorksheet,
  isPaidWorksheet,
} from '@/features/worksheets/utils/whatsapp-order';
import { useUiSound } from '@/hooks/use-ui-sound';
import { APP_IMAGES } from '@/lib/assets';
import { formatCurrency } from '@/lib/utils';
import type { WorksheetProduct } from '@/types';

interface ProductCardProps {
  product: WorksheetProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { playTap, playSuccess } = useUiSound();
  const isPaid = isPaidWorksheet(product);
  const isFree = isFreeWorksheet(product);
  const effectivePrice = getWorksheetEffectivePrice(product);
  const canOrderViaWhatsApp = Boolean(getWorksheetWhatsAppNumber());
  const category = product.category || 'Materi';
  const detailHref = `/worksheets/${product.slug}`;

  const handleWhatsAppOrder = () => {
    const productUrl = `${window.location.origin}${detailHref}`;
    const whatsappUrl = createWhatsAppOrderUrl(product, 1, productUrl);

    if (!whatsappUrl) return;

    playSuccess();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="group hover-lift-soft flex h-full flex-col overflow-hidden rounded-2xl border border-[#d4e3ff] bg-white shadow-[0_12px_32px_rgba(0,72,131,0.07)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(0,72,131,0.12)] motion-reduce:transition-none">
      <Link href={detailHref} onClick={playTap} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#d4e3ff]/45">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-5">
              <Image
                src={APP_IMAGES.worksheetLibrary}
                alt="Ilustrasi worksheet"
                width={220}
                height={170}
                priority={false}
                className="h-auto w-full max-w-[170px] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className={isPaid ? 'rounded-md bg-[#ffe173] px-2 py-1 text-[10px] font-black text-[#0f1d24] shadow-sm' : 'rounded-md bg-[#96f89f] px-2 py-1 text-[10px] font-black text-[#00531d] shadow-sm'}>
              {isPaid ? 'BERBAYAR' : 'GRATIS'}
            </span>
            {product.isBestSeller && (
              <span className="rounded-md bg-[#f3e8ff] px-2 py-1 text-[10px] font-black text-[#6b21a8] shadow-sm">
                BEST SELLER
              </span>
            )}
            {product.isPromo && (
              <span className="rounded-md bg-[#ffd6d6] px-2 py-1 text-[10px] font-black text-[#ba1a1a] shadow-sm">
                PROMO
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#d4e3ff] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#004883]">
            {category}
          </span>
          <div className="flex items-center gap-1 rounded-full bg-[#ffe173] px-2 py-1 text-[10px] font-black text-[#0f1d24]">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            {product.rating ?? 0}
          </div>
        </div>

        <Link href={detailHref} onClick={playTap}>
          <h3 className="line-clamp-2 text-sm font-black leading-tight text-on-surface transition-colors group-hover:text-[#004883]">
            {product.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
          {product.shortDescription || product.description || 'Materi pendukung aktivitas kelas.'}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-on-surface-variant">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Terjual {product.soldCount ?? 0}+</span>
        </div>

        <div className="mt-auto pt-4">
          {isFree ? (
            <div className="mb-3 text-lg font-black text-[#00531d]">Gratis</div>
          ) : (
            <div className="mb-3 flex min-h-[44px] flex-col justify-end">
              {product.discountPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    {product.discountPercent ? (
                      <span className="rounded bg-[#ffd6d6] px-1.5 py-0.5 text-[10px] font-black text-[#ba1a1a]">
                        {product.discountPercent}%
                      </span>
                    ) : null}
                    <span className="text-[10px] text-on-surface-variant line-through decoration-[#ba1a1a]/50">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="text-lg font-black text-[#ba1a1a]">
                    {formatCurrency(effectivePrice)}
                  </div>
                </>
              ) : (
                <div className="text-lg font-black text-[#004883]">
                  {formatCurrency(effectivePrice)}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Link
              href={detailHref}
              onClick={playTap}
              aria-label={`Lihat detail ${product.title}`}
              className="press-soft flex items-center justify-center gap-2 rounded-xl border border-[#004883]/30 px-3 py-2 text-xs font-black text-[#004883] transition-colors duration-150 hover:bg-[#d4e3ff] motion-reduce:transition-none"
            >
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none" aria-hidden="true" />
              Lihat Detail
            </Link>

            {isFree ? (
              product.url ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playTap}
                  aria-label={`Buka file ${product.title}`}
                  className="press-soft flex w-full items-center justify-center gap-2 rounded-xl bg-[#004883] px-3 py-2 text-xs font-black text-white transition-colors duration-150 hover:bg-[#003b6b] motion-reduce:transition-none"
                >
                  <ExternalLink className="h-4 w-4 transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none" aria-hidden="true" />
                  Buka File
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-surface-container px-3 py-2 text-xs font-black text-on-surface-variant"
                >
                  File belum tersedia
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                disabled={!canOrderViaWhatsApp}
                aria-label={`Pesan ${product.title} via WhatsApp`}
                className="press-soft flex w-full items-center justify-center gap-2 rounded-xl bg-[#96f89f] px-3 py-2 text-xs font-black text-[#00531d] transition-colors duration-150 hover:bg-[#83ee8e] disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant motion-reduce:transition-none"
              >
                {canOrderViaWhatsApp ? (
                  <MessageCircle className="h-4 w-4 transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none" aria-hidden="true" />
                ) : (
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                )}
                {canOrderViaWhatsApp ? 'Pesan via WhatsApp' : 'Nomor WhatsApp belum dikonfigurasi'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
