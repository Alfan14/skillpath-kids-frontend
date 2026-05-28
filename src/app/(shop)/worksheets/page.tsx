import { getWorksheets } from '@/actions/file-actions';
import { WorksheetCatalog } from '@/features/worksheets/components/WorksheetCatalog';
import type { WorksheetProduct } from '@/types';

export const dynamic = 'force-dynamic';

export default async function WorksheetsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const params: Record<string, string | number | boolean> = {};
  
  if (resolvedSearchParams.search) params.search = resolvedSearchParams.search as string;
  if (resolvedSearchParams.category) params.category = resolvedSearchParams.category as string;
  if (resolvedSearchParams.variant) params.variant = resolvedSearchParams.variant as string;

  // Fetch all for categories (simple workaround since we don't have a categories endpoint)
  const allRes = await getWorksheets();
  const allProducts: WorksheetProduct[] = allRes.data || [];
  
  const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));
  const bestSellers = allProducts.filter(p => p.isBestSeller);
  
  // If no best sellers, fallback to regular products
  const sidebarProducts = bestSellers.length > 0 ? bestSellers : allProducts;

  // Fetch filtered
  const filteredRes = await getWorksheets(params);
  const worksheets: WorksheetProduct[] = filteredRes.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
      <div className="bg-primary/5 rounded-3xl p-8 mb-8 border border-primary/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-primary mb-4 leading-tight">
            Koleksi Worksheet & Buku Anak
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg">
            Temukan berbagai materi edukatif yang dirancang khusus untuk mendukung perkembangan kognitif dan motorik si kecil.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-[200px] opacity-10 rotate-[-15deg] pointer-events-none select-none">
          🎨
        </div>
      </div>
      
      <WorksheetCatalog 
        worksheets={worksheets} 
        bestSellers={sidebarProducts}
        categories={categories}
      />
    </div>
  );
}
