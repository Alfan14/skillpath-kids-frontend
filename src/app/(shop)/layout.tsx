import { ReactNode } from 'react';
import { ShopHeader } from '@/components/shop/ShopHeader';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <ShopHeader />
      <main className="flex-1 w-full pb-24">
        {children}
      </main>
    </div>
  );
}
