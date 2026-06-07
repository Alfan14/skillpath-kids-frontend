'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/badge';
import { Lightbulb, Plus, Edit2, Trash2, X } from 'lucide-react';
import { TipForm } from '@/components/forms/tip-form';
import { deleteTip } from '@/actions/tip-actions';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import type { Recommendation } from '@/types';

export function TipsClient({ tips }: { tips: Recommendation[] }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Recommendation | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tipToDelete, setTipToDelete] = useState<Recommendation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingTip(null);
    setIsFormOpen(true);
  };

  const handleEdit = (t: Recommendation) => {
    setEditingTip(t);
    setIsFormOpen(true);
  };

  const confirmDelete = (t: Recommendation) => {
    setTipToDelete(t);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tipToDelete) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      await deleteTip(Number(tipToDelete.id), token || '');
      setIsDeleteModalOpen(false);
      setTipToDelete(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus tip');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">Manajemen Tips & Rekomendasi</h1>
          <p className="text-sm text-on-surface-variant">Kelola saran aktivitas untuk orang tua.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleAddNew}>
          <Plus className="w-4 h-4" /> Tambah Baru
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {tips.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-card border border-outline-variant/30">
            Belum ada tips.
          </div>
        ) : (
          tips.map((t) => (
            <Card key={t.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2 items-center">
                  <BadgePill color="secondary">{t.category}</BadgePill>
                  {t.isMain && <BadgePill color="primary">Utama</BadgePill>}
                  <span className="text-xs text-on-surface-variant">⏱ {t.duration}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1">{t.title}</h3>
                <p className="text-sm text-on-surface-variant">{t.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                  <Edit2 className="w-4 h-4 text-on-surface-variant" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => confirmDelete(t)} className="hover:bg-error hover:text-white border-error/30 text-error">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <div className="shrink-0 flex items-start justify-between gap-3 border-b border-outline-variant/20 bg-white px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-secondary-container shadow-[0_4px_0_0_#ffe173]">
                  <Lightbulb className="h-5 w-5 text-on-secondary-container" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-on-surface">
                    {editingTip ? 'Edit Tip' : 'Tambah Tip'}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant">
                    {editingTip ? 'Perbarui rekomendasi aktivitas untuk anak.' : 'Buat rekomendasi aktivitas baru untuk orang tua.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Tutup form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <TipForm
                initialData={editingTip}
                onSuccess={() => setIsFormOpen(false)}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-black text-on-surface mb-2">Hapus Tip?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus tip ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
              <Button variant="danger" onClick={handleDelete} loading={isDeleting}>Hapus</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
