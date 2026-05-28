import { notFound } from 'next/navigation';
import { getWorksheetBySlug, getRelatedWorksheets, getWorksheets } from '@/actions/file-actions';
import { WorksheetDetail } from '@/features/worksheets/components/WorksheetDetail';
import { RelatedWorksheets } from '@/features/worksheets/components/RelatedWorksheets';
import type { WorksheetProduct } from '@/types';

export const dynamic = 'force-dynamic';

export default async function WorksheetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product: WorksheetProduct | null = await getWorksheetBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch best sellers for sidebar
  const allRes = await getWorksheets();
  const allProducts: WorksheetProduct[] = allRes.data || [];
  const bestSellers = allProducts.filter(p => p.isBestSeller);
  const sidebarProducts = bestSellers.length > 0 ? bestSellers : allProducts;

  // Fetch related products
  const relatedProducts: WorksheetProduct[] = await getRelatedWorksheets(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-4">
      <WorksheetDetail product={product} bestSellers={sidebarProducts} />
      <RelatedWorksheets products={relatedProducts} />
    </div>
  );
}
