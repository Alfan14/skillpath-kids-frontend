'use client';

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { WorksheetProduct } from "@/types";
import { useWorksheetCart } from "@/features/worksheets/hooks/useWorksheetCart";
import { parseBadges } from "@/features/worksheets/utils/worksheet-parsers";

interface ProductCardProps {
  product: WorksheetProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useWorksheetCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    // Could add toast here
  };

  const isFree = product.variant?.toUpperCase() === 'FREE';
  const badges = parseBadges(product.badges);

  return (
    <Link 
      href={`/worksheets/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-outline-variant/30 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30"
    >
      <div className="relative aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
        {product.mainImageUrl ? (
          <img 
            src={product.mainImageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
              <span className="text-3xl">📄</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestSeller && (
            <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              BEST SELLER
            </span>
          )}
          {product.isPromo && (
            <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              PROMO
            </span>
          )}
          {isFree && (
            <span className="bg-tertiary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              GRATIS
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
          {product.category}
        </span>
        
        <h3 className="font-bold text-on-surface text-sm mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5 text-secondary">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold">{product.rating}</span>
          </div>
          <span className="text-xs text-on-surface-variant/50">|</span>
          <span className="text-[10px] text-on-surface-variant">Terjual {product.soldCount}+</span>
        </div>
        
        <div className="mt-auto">
          {isFree ? (
            <div className="text-primary font-black text-lg mb-3">Gratis</div>
          ) : (
            <div className="mb-3 flex flex-col justify-end min-h-[44px]">
              {product.discountPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="bg-error/10 text-error text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discountPercent}%
                    </span>
                    <span className="text-[10px] text-on-surface-variant line-through decoration-error/50">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="text-error font-black text-lg">
                    {formatCurrency(product.discountPrice)}
                  </div>
                </>
              ) : (
                <div className="text-primary font-black text-lg">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-primary-fixed hover:bg-primary hover:text-white text-primary font-bold py-2 px-4 rounded-xl transition-colors text-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>
    </Link>
  );
}
