import { getWorksheets } from '@/actions/file-actions';
import { applyProductOverrides } from '@/data/files/product-overrides';
import type { WorksheetProduct } from '@/types';
import { TeacherFilesClient } from './teacher-files-client';

export const dynamic = 'force-dynamic';

export default async function TeacherFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const params: Record<string, string | number | boolean> = {};

  if (resolvedSearchParams.search) params.search = resolvedSearchParams.search as string;
  if (resolvedSearchParams.category) params.category = resolvedSearchParams.category as string;
  if (resolvedSearchParams.variant) params.variant = resolvedSearchParams.variant as string;

  const [allRes, filteredRes] = await Promise.all([
    getWorksheets(),
    getWorksheets(params),
  ]);

  const allProducts = applyProductOverrides((allRes.data || []) as WorksheetProduct[]);
  const worksheets = applyProductOverrides((filteredRes.data || []) as WorksheetProduct[]);

  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  ) as string[];

  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const sidebarProducts = bestSellers.length > 0 ? bestSellers : allProducts;

  return (
    <TeacherFilesClient
      worksheets={worksheets}
      bestSellers={sidebarProducts}
      categories={categories}
    />
  );
}
