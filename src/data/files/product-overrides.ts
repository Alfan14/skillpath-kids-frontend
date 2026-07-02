import type { WorksheetProduct } from '@/types';

export const EXCLUDED_PRODUCT_TITLES = new Set([
  'Flashcard Alfabet Anak',
  'Worksheet Motorik Halus',
  'Busy Book Elementary Cognition',
]);

export const PRICE_OVERRIDES: Record<string, { price: number; discountPrice: number }> = {
  'Paket Montessori Complete Set': { price: 49000, discountPrice: 30000 },
  'Busy Book Look! Animal': { price: 35000, discountPrice: 20000 },
};

export function applyProductOverrides(products: WorksheetProduct[]): WorksheetProduct[] {
  return products
    .filter((p) => !EXCLUDED_PRODUCT_TITLES.has(p.title))
    .map((p) => {
      const override = PRICE_OVERRIDES[p.title];
      if (!override) return p;
      return { ...p, price: override.price, discountPrice: override.discountPrice };
    });
}
