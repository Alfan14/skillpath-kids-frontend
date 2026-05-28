'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';
import type { WorksheetProduct } from '@/types';
import { ChevronRight } from 'lucide-react';

interface WorksheetCatalogProps {
  worksheets: WorksheetProduct[];
  bestSellers: WorksheetProduct[];
  categories: string[];
}

export function WorksheetCatalog({ worksheets, bestSellers, categories }: WorksheetCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentVariant = searchParams.get('variant') || '';

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/worksheets?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
        
        {/* Category Filter */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/30">
          <h3 className="font-black text-on-surface mb-4 uppercase text-xs tracking-wider">Kategori</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleFilter('category', '')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!currentCategory ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                Semua Produk
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleFilter('category', cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentCategory === cat ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Variant Filter */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/30">
          <h3 className="font-black text-on-surface mb-4 uppercase text-xs tracking-wider">Harga</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleFilter('variant', '')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!currentVariant ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                Semua
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilter('variant', 'FREE')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentVariant === 'FREE' ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                Gratis
              </button>
            </li>
            <li>
              <button
                onClick={() => handleFilter('variant', 'PAID')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${currentVariant === 'PAID' ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                Premium
              </button>
            </li>
          </ul>
        </div>

        {/* Best Sellers (Sidebar) */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant/30 hidden md:block">
          <h3 className="font-black text-on-surface mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
            ⭐ Terlaris
          </h3>
          <div className="flex flex-col gap-4">
            {bestSellers.slice(0, 3).map((product) => (
              <Link 
                href={`/worksheets/${product.slug}`} 
                key={product.id}
                className="flex gap-3 group"
              >
                <div className="w-16 h-16 rounded-xl bg-surface-container flex-shrink-0 overflow-hidden">
                  {product.mainImageUrl ? (
                    <img src={product.mainImageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl">📄</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-[10px] text-primary font-bold mt-1">
                    {product.discountPrice ? `Rp${product.discountPrice.toLocaleString('id-ID')}` : `Rp${product.price.toLocaleString('id-ID')}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Breadcrumb / Status */}
        <div className="flex items-center text-xs text-on-surface-variant mb-4">
          <Link href="/" className="hover:text-primary">Beranda</Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="font-bold text-on-surface">Worksheets</span>
          <span className="ml-2 bg-surface-container-low px-2 py-0.5 rounded-full">
            {worksheets.length} Produk
          </span>
        </div>

        {worksheets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {worksheets.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white border border-outline-variant/30 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Belum ada worksheet tersedia</h3>
            <p className="text-sm text-on-surface-variant max-w-md">
              Maaf, kami tidak dapat menemukan produk yang sesuai dengan filter Anda. Silakan coba kata kunci atau kategori lain.
            </p>
            <button 
              onClick={() => router.push('/worksheets')}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-pill font-bold hover:bg-primary/90 transition-colors text-sm"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
