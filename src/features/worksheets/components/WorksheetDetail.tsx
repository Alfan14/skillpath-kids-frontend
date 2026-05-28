'use client';

import Link from 'next/link';
import { ChevronRight, Star, Tag, Share2, Heart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { WorksheetProduct } from '@/types';
import { WorksheetGallery } from './WorksheetGallery';
import { WorksheetTabs } from './WorksheetTabs';
import { CartSummaryCard } from './CartSummaryCard';
import { TrustBadges } from '@/components/shop/TrustBadges';
import { useWorksheetCart } from '@/features/worksheets/hooks/useWorksheetCart';
import { parseFeatures, parseBadges } from '@/features/worksheets/utils/worksheet-parsers';

interface WorksheetDetailProps {
  product: WorksheetProduct;
  bestSellers: WorksheetProduct[];
}

export function WorksheetDetail({ product, bestSellers }: WorksheetDetailProps) {
  const { addItem } = useWorksheetCart();
  
  const isFree = product.variant?.toUpperCase() === 'FREE';
  const features = parseFeatures(product.features);
  
  const handleBuyNow = () => {
    addItem(product, 1);
    const cartEl = document.getElementById('cart-summary');
    if (cartEl) {
      cartEl.scrollIntoView({ behavior: 'smooth' });
      // Add a quick highlight effect
      cartEl.classList.add('ring-4', 'ring-primary', 'ring-offset-2');
      setTimeout(() => cartEl.classList.remove('ring-4', 'ring-primary', 'ring-offset-2'), 1000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6">
      
      {/* Left Column: Sidebar (Desktop only) */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-6">
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/30">
          <h3 className="font-black text-on-surface mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
            ⭐ Terlaris
          </h3>
          <div className="flex flex-col gap-4">
            {bestSellers.slice(0, 4).map((item) => (
              <Link 
                href={`/worksheets/${item.slug}`} 
                key={item.id}
                className="flex gap-3 group"
              >
                <div className="w-16 h-16 rounded-xl bg-surface-container flex-shrink-0 overflow-hidden">
                  {item.mainImageUrl ? (
                    <img src={item.mainImageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl">📄</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-primary font-bold mt-1">
                    {item.discountPrice ? formatCurrency(item.discountPrice) : formatCurrency(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Middle Column: Gallery & Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="w-3 h-3 mx-1 flex-shrink-0" />
          <Link href="/worksheets" className="hover:text-primary">Worksheets</Link>
          <ChevronRight className="w-3 h-3 mx-1 flex-shrink-0" />
          <span className="hover:text-primary cursor-pointer">{product.category}</span>
          <ChevronRight className="w-3 h-3 mx-1 flex-shrink-0" />
          <span className="font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">{product.title}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Gallery */}
          <div className="w-full md:w-1/2">
            <WorksheetGallery 
              mainImage={product.mainImageUrl} 
              galleryImages={product.galleryImages} 
              title={product.title}
              isBestSeller={product.isBestSeller}
              isPromo={product.isPromo}
            />
          </div>
          
          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="inline-block bg-primary-fixed text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface leading-tight mb-3">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-on-surface-variant">
                  <span className="font-bold">{product.reviewCount}</span> Ulasan
                </span>
                <span className="text-on-surface-variant/30">•</span>
                <span className="text-sm text-on-surface-variant">
                  Terjual <span className="font-bold">{product.soldCount}+</span>
                </span>
              </div>
            </div>

            <div className="mb-6">
              {isFree ? (
                <div className="text-primary font-black text-3xl">Gratis</div>
              ) : (
                <div className="flex flex-col">
                  {product.discountPrice ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded">
                          Hemat {product.discountPercent}%
                        </span>
                        <span className="text-sm text-on-surface-variant line-through decoration-error/50">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <div className="text-primary font-black text-3xl">
                        {formatCurrency(product.discountPrice)}
                      </div>
                    </>
                  ) : (
                    <div className="text-primary font-black text-3xl">
                      {formatCurrency(product.price)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {product.shortDescription || "Lembar kerja edukatif dan menyenangkan untuk anak."}
              </p>
            </div>

            {features.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">Fitur Utama</h4>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-tertiary-container/30 text-tertiary px-3 py-1.5 rounded-full text-xs font-bold border border-tertiary/20">
                      <Tag className="w-3.5 h-3.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile CTA (Hidden on lg, shown on sm/md) */}
            <div className="lg:hidden mt-auto pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={() => addItem(product, 1)}
                  className="flex-1 bg-surface-container text-on-surface font-bold py-3 px-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                >
                  Tambah
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-[2] bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  Beli Sekarang
                </button>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <button className="flex items-center gap-2 text-on-surface-variant hover:text-error text-xs font-bold">
                  <Heart className="w-4 h-4" /> Wishlist
                </button>
                <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-xs font-bold">
                  <Share2 className="w-4 h-4" /> Bagikan
                </button>
              </div>
            </div>

          </div>
        </div>

        <WorksheetTabs 
          description={product.description}
          specifications={product.specifications}
          shippingInfo={product.shippingInfo}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
        
        <TrustBadges />

      </div>

      {/* Right Column: Cart (Desktop only) */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <CartSummaryCard />
        
        {/* Actions under cart */}
        <div className="flex justify-center gap-6 mt-6">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-error text-sm font-bold transition-colors">
            <Heart className="w-4 h-4" /> Wishlist
          </button>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-bold transition-colors">
            <Share2 className="w-4 h-4" /> Bagikan
          </button>
        </div>
      </aside>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-outline-variant/30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden z-50 flex gap-3 safe-area-inset-bottom">
         <button 
          onClick={() => addItem(product, 1)}
          className="flex-1 bg-surface-container text-on-surface font-bold py-3 px-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-sm"
        >
          Tambah
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-[2] bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 text-sm"
        >
          Beli Sekarang
        </button>
      </div>

    </div>
  );
}
