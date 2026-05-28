'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseSpecifications, parseShippingInfo } from '@/features/worksheets/utils/worksheet-parsers';

interface WorksheetTabsProps {
  description: string;
  specifications: unknown;
  shippingInfo: unknown;
  rating: number;
  reviewCount: number;
}

export function WorksheetTabs({ description, specifications, shippingInfo, rating, reviewCount }: WorksheetTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');

  const specs = parseSpecifications(specifications);
  const shipping = parseShippingInfo(shippingInfo);

  const tabs = [
    { id: 'desc', label: 'Deskripsi' },
    { id: 'specs', label: 'Spesifikasi' },
    { id: 'reviews', label: `Ulasan (${reviewCount})` },
    { id: 'shipping', label: 'Pengiriman' },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b border-outline-variant/30 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative",
              activeTab === tab.id 
                ? "text-primary" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        
        {/* Deskripsi */}
        <div className={cn("prose prose-sm md:prose-base max-w-none prose-p:text-on-surface-variant", activeTab !== 'desc' && "hidden")}>
          <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} />
        </div>

        {/* Spesifikasi */}
        <div className={cn(activeTab !== 'specs' && "hidden")}>
          {Object.keys(specs).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="w-1/3 text-on-surface-variant text-sm font-bold">{key}</span>
                  <span className="w-2/3 text-on-surface text-sm">{value as string}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant text-sm italic">Tidak ada informasi spesifikasi khusus untuk produk ini.</p>
          )}
        </div>

        {/* Ulasan */}
        <div className={cn(activeTab !== 'reviews' && "hidden")}>
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl min-w-[200px]">
              <span className="text-5xl font-black text-on-surface">{rating.toFixed(1)}</span>
              <div className="flex gap-1 my-2 text-secondary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("w-5 h-5", s <= Math.round(rating) ? "fill-current" : "text-outline-variant fill-transparent")} />
                ))}
              </div>
              <span className="text-xs text-on-surface-variant font-bold">Dari {reviewCount} ulasan</span>
            </div>
            
            <div className="flex-1 w-full">
              <p className="text-sm text-on-surface-variant mb-4">
                Ini adalah ulasan produk contoh (dummy). Pada versi produksi, ulasan dari pengguna akan ditampilkan di sini.
              </p>
              
              {/* Dummy reviews */}
              {[1, 2].map((i) => (
                <div key={i} className="mb-4 pb-4 border-b border-outline-variant/30 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                        U{i}
                      </div>
                      <span className="font-bold text-sm text-on-surface">User {i}</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">2 hari yang lalu</span>
                  </div>
                  <div className="flex gap-0.5 text-secondary mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant">Materi sangat bagus dan edukatif! Anak saya sangat suka mengerjakannya.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pengiriman */}
        <div className={cn(activeTab !== 'shipping' && "hidden")}>
           {Object.keys(shipping).length > 0 ? (
            <div className="flex flex-col gap-3">
              {Object.entries(shipping).map(([key, value]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="sm:w-1/4 text-on-surface-variant text-sm font-bold mb-1 sm:mb-0">{key}</span>
                  <span className="sm:w-3/4 text-on-surface text-sm">{value as string}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-on-surface-variant text-sm">Informasi pengiriman standar:</p>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
                <li>Pesanan diproses dalam 1-2 hari kerja.</li>
                <li>Pengiriman reguler 2-5 hari kerja (tergantung lokasi).</li>
                <li>Tersedia fitur lacak pesanan (tracking) melalui dashboard.</li>
                <li>File PDF (untuk produk digital) akan langsung dikirimkan ke email setelah pembayaran dikonfirmasi.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
