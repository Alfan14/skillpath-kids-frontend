import type { WorksheetProduct } from '@/types';
import { formatCurrency } from '@/lib/utils';

function normalizeWhatsAppNumber(value: string | undefined) {
  const digits = (value || '').replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasPriceValue(product: WorksheetProduct) {
  return product.discountPrice !== null && product.discountPrice !== undefined
    ? true
    : product.price !== null && product.price !== undefined;
}

export function getWorksheetWhatsAppNumber() {
  return normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
}

export function isPaidWorksheet(product: WorksheetProduct) {
  const variant = String(product.variant ?? '').trim().toUpperCase();

  if (variant === 'PAID' || variant === 'BERBAYAR' || variant === 'PREMIUM') {
    return true;
  }

  if (variant === 'FREE' || variant === 'GRATIS') {
    return false;
  }

  return toNumber(product.discountPrice ?? product.price) > 0;
}

export function isFreeWorksheet(product: WorksheetProduct) {
  return !isPaidWorksheet(product);
}

export function getWorksheetEffectivePrice(product: WorksheetProduct) {
  if (isFreeWorksheet(product)) return 0;
  return toNumber(product.discountPrice ?? product.price);
}

export function formatWorksheetPrice(value: number) {
  return value <= 0 ? 'Gratis' : formatCurrency(value);
}

export function createWhatsAppOrderUrl(
  product: WorksheetProduct,
  quantity = 1,
  currentUrl?: string
) {
  const whatsappNumber = getWorksheetWhatsAppNumber();
  if (!whatsappNumber) return null;

  const safeQuantity = Math.max(1, quantity);
  const effectivePrice = getWorksheetEffectivePrice(product);
  const total = effectivePrice * safeQuantity;
  const productUrl =
    currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const title = product.title?.trim() || 'Produk SkillPath Kids';
  const category = product.category?.trim() || '-';
  const priceLine = hasPriceValue(product)
    ? `Harga: ${formatWorksheetPrice(effectivePrice)}`
    : null;
  const quantityLines = safeQuantity > 1
    ? [`Jumlah: ${safeQuantity}`, `Total: ${formatWorksheetPrice(total)}`]
    : [];

  const message = [
    'Halo Admin SkillPath Kids, saya ingin memesan file/worksheet berikut:',
    '',
    `Nama Produk: ${title}`,
    `Kategori: ${category}`,
    'Tipe: Berbayar',
    priceLine,
    ...quantityLines,
    `Link Produk: ${productUrl || '-'}`,
    '',
    'Mohon informasi cara pembayaran dan akses filenya. Terima kasih.',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
