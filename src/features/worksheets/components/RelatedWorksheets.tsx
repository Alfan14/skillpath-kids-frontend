import { ProductCard } from '@/components/shop/ProductCard';
import type { WorksheetProduct } from '@/types';

interface RelatedWorksheetsProps {
  products: WorksheetProduct[];
}

export function RelatedWorksheets({ products }: RelatedWorksheetsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black italic text-on-surface">
          Mungkin Anda Juga Suka
        </h2>
        <a href="/worksheets" className="text-sm font-bold text-primary hover:underline">
          Lihat Semua
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
