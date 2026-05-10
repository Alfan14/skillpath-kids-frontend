import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-error" />
      </div>
      <h1 className="text-3xl font-black text-on-surface mb-2">Akses Ditolak</h1>
      <p className="text-on-surface-variant max-w-md mx-auto mb-8">
        Maaf, Anda tidak memiliki izin untuk mengakses fitur atau halaman ini. Tindakan ini memerlukan akses tingkat administrator atau peran khusus.
      </p>
      <Button asChild variant="primary">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
