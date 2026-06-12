import Image from 'next/image';

import { getWorksheets } from '@/actions/file-actions';
import { BadgePill } from '@/components/ui/badge';
import { WorksheetCatalog } from '@/features/worksheets/components/WorksheetCatalog';
import { APP_IMAGES } from '@/lib/assets';
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

  // Fetch all for categories because the API does not expose a category endpoint.
  const allRes = await getWorksheets();
  const allProducts: WorksheetProduct[] = allRes.data || [];

  const categories = Array.from(new Set(allProducts.map((product) => product.category).filter(Boolean)));
  const bestSellers = allProducts.filter((product) => product.isBestSeller);
  const sidebarProducts = bestSellers.length > 0 ? bestSellers : allProducts;

  const filteredRes = await getWorksheets(params);
  const worksheets: WorksheetProduct[] = filteredRes.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-3xl border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <BadgePill className="bg-[#96f89f] text-[#00531d]">
                Teacher Resource
              </BadgePill>
              <BadgePill className="bg-[#ffe173] text-[#0f1d24]">
                Materi Kelas
              </BadgePill>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883] md:text-4xl">
              Files & Worksheet Guru
            </h1>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-[#004883] md:text-base">
              Akses materi, worksheet, dan resource pendukung aktivitas kelas.
            </p>
          </div>

          <Image
            src={APP_IMAGES.teacherFilesHero}
            alt="Ilustrasi files dan worksheet guru"
            width={300}
            height={240}
            priority
            className="files-float mx-auto h-auto w-full max-w-[190px] shrink-0 motion-reduce:animate-none md:mx-0 md:max-w-[260px]"
          />
        </div>
      </section>

      <WorksheetCatalog
        worksheets={worksheets}
        bestSellers={sidebarProducts}
        categories={categories}
      />
    </div>
  );
}
