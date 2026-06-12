'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ExternalLink,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Star,
  Tag,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { WorksheetProduct } from '@/types';
import { WorksheetGallery } from './WorksheetGallery';
import { WorksheetTabs } from './WorksheetTabs';
import { TrustBadges } from '@/components/shop/TrustBadges';
import { parseFeatures } from '@/features/worksheets/utils/worksheet-parsers';
import {
  createWhatsAppOrderUrl,
  formatWorksheetPrice,
  getWorksheetEffectivePrice,
  getWorksheetWhatsAppNumber,
  isFreeWorksheet,
  isPaidWorksheet,
} from '@/features/worksheets/utils/whatsapp-order';

interface WorksheetDetailProps {
  product: WorksheetProduct;
  bestSellers: WorksheetProduct[];
}

export function WorksheetDetail({ product, bestSellers }: WorksheetDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const isPaid = isPaidWorksheet(product);
  const isFree = isFreeWorksheet(product);
  const features = parseFeatures(product.features);
  const effectivePrice = getWorksheetEffectivePrice(product);
  const total = effectivePrice * quantity;
  const canOrderViaWhatsApp = Boolean(getWorksheetWhatsAppNumber());
  const canOpenFile = Boolean(product.url);
  const primaryActionLabel = isFree
    ? canOpenFile
      ? 'Buka File'
      : 'File belum tersedia'
    : canOrderViaWhatsApp
      ? 'Pesan via WhatsApp'
      : 'Nomor WhatsApp belum dikonfigurasi';

  const handlePrimaryAction = () => {
    if (isFree) {
      if (!product.url) return;
      window.open(product.url, '_blank', 'noopener,noreferrer');
      return;
    }

    const whatsappUrl = createWhatsAppOrderUrl(product, quantity, window.location.href);
    if (!whatsappUrl) return;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: product.shortDescription || product.description,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  return (
    <div className="mt-6 flex flex-col gap-8 lg:flex-row">
      <aside className="hidden w-64 flex-shrink-0 flex-col gap-6 lg:flex">
        <div className="rounded-2xl border border-outline-variant/30 bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-on-surface">
            ⭐ Terlaris
          </h3>
          <div className="flex flex-col gap-4">
            {bestSellers.slice(0, 4).map((item) => (
              <Link
                href={`/worksheets/${item.slug}`}
                key={item.id}
                className="group flex gap-3"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
                  {item.mainImageUrl ? (
                    <img src={item.mainImageUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl text-primary">📄</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-xs font-bold text-on-surface transition-colors group-hover:text-primary">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[10px] font-bold text-primary">
                    {formatWorksheetPrice(getWorksheetEffectivePrice(item))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-wrap items-center text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="mx-1 h-3 w-3 flex-shrink-0" />
          <Link href="/worksheets" className="hover:text-primary">Worksheets</Link>
          <ChevronRight className="mx-1 h-3 w-3 flex-shrink-0" />
          <span className="cursor-pointer hover:text-primary">{product.category}</span>
          <ChevronRight className="mx-1 h-3 w-3 flex-shrink-0" />
          <span className="max-w-[150px] truncate font-bold text-on-surface sm:max-w-xs">{product.title}</span>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/2">
            <WorksheetGallery
              mainImage={product.mainImageUrl}
              galleryImages={product.galleryImages}
              title={product.title}
              isBestSeller={product.isBestSeller}
              isPromo={product.isPromo}
            />
          </div>

          <div className="flex w-full flex-col md:w-1/2">
            <div className="mb-2">
              <span className="mb-2 inline-block rounded-md bg-primary-fixed px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {product.category}
              </span>
              <h1 className="mb-3 text-2xl font-black leading-tight text-on-surface md:text-3xl">
                {product.title}
              </h1>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-surface-container px-2 py-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-on-surface-variant">
                  <span className="font-bold">{product.reviewCount}</span> Ulasan
                </span>
                <span className="text-on-surface-variant/30">•</span>
                <span className="text-sm text-on-surface-variant">
                  Terjual <span className="font-bold">{product.soldCount}+</span>
                </span>
              </div>
            </div>

            <div className="mb-6">
              {isFree ? (
                <div className="text-3xl font-black text-primary">Gratis</div>
              ) : (
                <div className="flex flex-col">
                  {product.discountPrice ? (
                    <>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded bg-error/10 px-2 py-0.5 text-xs font-bold text-error">
                          Hemat {product.discountPercent}%
                        </span>
                        <span className="text-sm text-on-surface-variant line-through decoration-error/50">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <div className="text-3xl font-black text-primary">
                        {formatCurrency(effectivePrice)}
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-black text-primary">
                      {formatCurrency(effectivePrice)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {product.shortDescription || 'Lembar kerja edukatif dan menyenangkan untuk anak.'}
              </p>
            </div>

            {isPaid && (
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface">Jumlah</h4>
                <div className="inline-flex items-center rounded-xl border border-outline-variant/30 bg-surface-container">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="p-3 text-on-surface-variant transition-colors hover:text-primary"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-black text-on-surface">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="p-3 text-on-surface-variant transition-colors hover:text-primary"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div className="mb-8">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface">Fitur Utama</h4>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded-full border border-tertiary/20 bg-tertiary-container/30 px-3 py-1.5 text-xs font-bold text-tertiary">
                      <Tag className="h-3.5 w-3.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3 border-t border-outline-variant/30 pt-6 lg:hidden">
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={isFree ? !canOpenFile : !canOrderViaWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#96f89f] px-4 py-3 text-sm font-black text-[#00531d] transition-colors hover:bg-[#83ee8e] disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant"
              >
                {isFree ? (
                  <ExternalLink className="h-5 w-5" />
                ) : canOrderViaWhatsApp ? (
                  <MessageCircle className="h-5 w-5" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
                {primaryActionLabel}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>

        <WorksheetTabs
          description={product.description}
          specifications={product.specifications}
          shippingInfo={product.shippingInfo}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        <TrustBadges />
      </div>

      <aside className="hidden w-80 flex-shrink-0 lg:block">
        <div className="sticky top-24 overflow-hidden rounded-2xl border border-outline-variant/30 bg-white" id="order-summary">
          <div className="border-b border-outline-variant/30 bg-surface-container-lowest p-5">
            <h3 className="flex items-center gap-2 font-black text-on-surface">
              {isFree ? (
                <ExternalLink className="h-5 w-5 text-primary" />
              ) : (
                <MessageCircle className="h-5 w-5 text-primary" />
              )}
              {isFree ? 'Akses File' : 'Ringkasan Pesanan'}
            </h3>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div>
              <p className="line-clamp-2 text-sm font-black text-on-surface">{product.title}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{product.category}</p>
            </div>

            {isPaid && (
              <div className="flex items-center justify-between rounded-xl bg-surface-container px-3 py-2">
                <span className="text-sm font-bold text-on-surface-variant">Jumlah</span>
                <div className="flex items-center rounded-lg border border-outline-variant/30 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="p-2 text-on-surface-variant hover:text-primary"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="p-2 text-on-surface-variant hover:text-primary"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Harga</span>
                <span className="font-bold text-on-surface">{formatWorksheetPrice(effectivePrice)}</span>
              </div>
              {isPaid && (
                <div className="flex justify-between border-t border-outline-variant/30 pt-3">
                  <span className="font-bold text-on-surface">Total</span>
                  <span className="text-lg font-black text-primary">{formatWorksheetPrice(total)}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={isFree ? !canOpenFile : !canOrderViaWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#96f89f] px-4 py-3 text-sm font-black text-[#00531d] transition-colors hover:bg-[#83ee8e] disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant"
            >
              {isFree ? (
                <ExternalLink className="h-5 w-5" />
              ) : canOrderViaWhatsApp ? (
                <MessageCircle className="h-5 w-5" />
              ) : (
                <ShoppingBag className="h-5 w-5" />
              )}
              {primaryActionLabel}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant transition-colors hover:text-error">
            <Heart className="h-4 w-4" /> Wishlist
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
          >
            <Share2 className="h-4 w-4" /> Bagikan
          </button>
        </div>
      </aside>

      <div className="safe-area-inset-bottom fixed bottom-0 left-0 right-0 z-50 flex gap-3 border-t border-outline-variant/30 bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm font-bold text-on-surface"
        >
          Bagikan
        </button>
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isFree ? !canOpenFile : !canOrderViaWhatsApp}
          className="flex-[2] rounded-xl bg-[#96f89f] px-4 py-3 text-sm font-black text-[#00531d] shadow-md transition-colors hover:bg-[#83ee8e] disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant"
        >
          {primaryActionLabel}
        </button>
      </div>
    </div>
  );
}
