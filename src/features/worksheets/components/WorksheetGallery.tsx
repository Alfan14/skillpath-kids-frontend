'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { parseGalleryImages } from '@/features/worksheets/utils/worksheet-parsers';

interface WorksheetGalleryProps {
  mainImage: string | null | undefined;
  galleryImages: unknown;
  title: string;
  isBestSeller: boolean;
  isPromo: boolean;
}

export function WorksheetGallery({ mainImage, galleryImages, title, isBestSeller, isPromo }: WorksheetGalleryProps) {
  const parsedGallery = parseGalleryImages(galleryImages);
  
  // Gather all available images. Main image first, then gallery images.
  const allImages = [];
  if (mainImage) allImages.push(mainImage);
  allImages.push(...parsedGallery.filter(img => img !== mainImage));

  const [activeImage, setActiveImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-hidden flex items-center justify-center">
        {activeImage ? (
          <img 
            src={activeImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-6xl">
            📄
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isBestSeller && (
            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-md shadow-sm uppercase tracking-wider">
              ⭐ Best Seller
            </span>
          )}
          {isPromo && (
            <span className="bg-error text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm uppercase tracking-wider">
              Promo Spesial
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={cn(
                "w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                activeImage === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img} alt={`${title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
