import { formatCurrency } from '@/lib/utils';

const DEFAULT_WHATSAPP_NUMBER = '628xxxxxxxxxx';

export interface FileOrderItem {
  title?: string | null;
  category?: string | null;
  variant?: string | null;
  price?: number | string | null;
  discountPrice?: number | string | null;
  badge?: string | null;
  url?: string | null;
}

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

export function getFilesWhatsAppNumber() {
  return normalizeWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  );
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasPriceValue(file: FileOrderItem) {
  return file.discountPrice !== null && file.discountPrice !== undefined && file.discountPrice !== ''
    ? true
    : file.price !== null && file.price !== undefined && file.price !== '';
}

export function getFileEffectivePrice(file: FileOrderItem) {
  return toNumber(file.discountPrice ?? file.price);
}

export function isPaidFile(file: FileOrderItem) {
  const variant = String(file.variant ?? '').trim().toUpperCase();

  if (variant === 'PAID' || variant === 'BERBAYAR' || variant === 'PREMIUM') {
    return true;
  }

  if (variant === 'FREE' || variant === 'GRATIS') {
    return false;
  }

  return getFileEffectivePrice(file) > 0;
}

export function isFreeFile(file: FileOrderItem) {
  return !isPaidFile(file);
}

export function buildWhatsAppOrderUrl(file: FileOrderItem, currentUrl?: string) {
  const whatsappNumber = getFilesWhatsAppNumber();

  if (!whatsappNumber) {
    return null;
  }

  const title = file.title?.trim() || 'Produk SkillPath Kids';
  const category = file.category?.trim() || '-';
  const badge = file.badge?.trim();
  const priceLine = hasPriceValue(file)
    ? `Harga: ${formatCurrency(getFileEffectivePrice(file))}`
    : null;
  const productUrl = currentUrl || file.url || '-';

  const message = [
    'Halo Admin SkillPath Kids, saya ingin memesan file/worksheet berikut:',
    '',
    `Nama Produk: ${title}`,
    `Kategori: ${category}`,
    'Tipe: Berbayar',
    priceLine,
    badge ? `Badge: ${badge}` : null,
    `Link Produk/File: ${productUrl}`,
    '',
    'Mohon informasi cara pembayaran dan akses filenya. Terima kasih.',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
