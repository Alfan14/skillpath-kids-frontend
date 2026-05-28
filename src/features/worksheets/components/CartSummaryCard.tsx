'use client';

import { useWorksheetCart } from '@/features/worksheets/hooks/useWorksheetCart';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartSummaryCard() {
  const { items, updateQuantity, removeItem, subtotal, shippingCost, total, isLoaded } = useWorksheetCart();

  if (!isLoaded) {
    return <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden sticky top-24" id="cart-summary">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container-lowest">
        <h3 className="font-black text-on-surface flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Keranjang Belanja
        </h3>
      </div>
      
      <div className="p-5">
        {items.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">🛒</div>
            <p className="text-sm text-on-surface-variant">Keranjang belanja Anda masih kosong.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-16 h-16 bg-surface-container-low rounded-xl flex-shrink-0 overflow-hidden">
                  {item.product.mainImageUrl ? (
                    <img src={item.product.mainImageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">📄</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-on-surface line-clamp-2 leading-tight">
                      {item.product.title}
                    </h4>
                    <p className="text-[10px] text-primary font-bold mt-1">
                      {formatCurrency(item.product.discountPrice ?? item.product.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-surface-container rounded-lg border border-outline-variant/30">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-5 bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="font-bold text-on-surface">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Ongkos Kirim</span>
            <span className="font-bold text-on-surface">{formatCurrency(shippingCost)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-outline-variant/30 flex justify-between">
            <span className="font-bold text-on-surface">Total</span>
            <span className="font-black text-primary text-lg">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <button 
          disabled={items.length === 0}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          onClick={() => {
            alert('Checkout dummy. Order backend belum dibuat.');
          }}
        >
          Lanjut Pembayaran
        </button>
        <Link href="/worksheets" className="block text-center text-xs text-primary font-bold mt-4 hover:underline">
          Lanjut Belanja
        </Link>
      </div>
    </div>
  );
}
