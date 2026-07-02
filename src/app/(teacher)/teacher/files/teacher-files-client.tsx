'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { WorksheetCatalog } from '@/features/worksheets/components/WorksheetCatalog';
import { BadgePill } from '@/components/ui/badge';
import { APP_IMAGES } from '@/lib/assets';
import { getSession } from '@/lib/auth';
import type { WorksheetProduct } from '@/types';

interface TeacherFilesClientProps {
  worksheets: WorksheetProduct[];
  bestSellers: WorksheetProduct[];
  categories: string[];
}

export function TeacherFilesClient({ worksheets, bestSellers, categories }: TeacherFilesClientProps) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const user = getSession();
    setUserName(user?.name ?? null);
  }, []);

  const greeting = userName ? `Hai ${userName} 👋` : 'Hai Guru 👋';

  return (
    <div className="mx-auto max-w-7xl">
      <section
        aria-label="Hero section files guru"
        className="animate-fade-up mb-8 overflow-hidden rounded-3xl border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-7"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1 backdrop-blur-sm">
              <span className="text-sm font-bold text-[#004883]">{greeting}</span>
            </div>
            <p className="mb-3 mt-1 text-sm font-semibold text-[#004883]/70">
              Selamat datang kembali.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              <BadgePill className="bg-[#96f89f] text-[#00531d]">Teacher Resource</BadgePill>
              <BadgePill className="bg-[#ffe173] text-[#0f1d24]">Materi Kelas</BadgePill>
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
            className="animate-float-soft mx-auto h-auto w-full max-w-[190px] shrink-0 motion-reduce:animate-none md:mx-0 md:max-w-[260px]"
          />
        </div>
      </section>

      <WorksheetCatalog
        worksheets={worksheets}
        bestSellers={bestSellers}
        categories={categories}
        basePath="/teacher/files"
        breadcrumbLabel="Files Guru"
      />
    </div>
  );
}
