'use client';

import Image from 'next/image';
import { useState } from 'react';

import { APP_IMAGES } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { parseGalleryImages } from '@/features/worksheets/utils/worksheet-parsers';

interface WorksheetGalleryProps {
  mainImage: string | null | undefined;
  galleryImages: unknown;
  title: string;
  isBestSeller: boolean;
  isPromo: boolean;
}

export function WorksheetGallery({
  mainImage,
  galleryImages,
  title,
  isBestSeller,
  isPromo,
}: WorksheetGalleryProps) {
  const parsedGallery = parseGalleryImages(galleryImages);
  const allImages = [];
  if (mainImage) allImages.push(mainImage);
  allImages.push(...parsedGallery.filter((img) => img !== mainImage));

  const [activeImage, setActiveImage] = useState<string | null>(
    allImages.length > 0 ? allImages[0] : null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#d4e3ff] bg-[#d4e3ff]/45">
        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <Image
              src={APP_IMAGES.worksheetLibrary}
              alt="Ilustrasi worksheet"
              width={320}
              height={260}
              className="h-auto w-full max-w-[260px]"
            />
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {isBestSeller && (
            <span className="rounded-md bg-[#f3e8ff] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#6b21a8] shadow-sm">
              Best Seller
            </span>
          )}
          {isPromo && (
            <span className="rounded-md bg-[#ffd6d6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#ba1a1a] shadow-sm">
              Promo Spesial
            </span>
          )}
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {allImages.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveImage(img)}
              className={cn(
                'h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                activeImage === img ? 'border-[#004883]' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
