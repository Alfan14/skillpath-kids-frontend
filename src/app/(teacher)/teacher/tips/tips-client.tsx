'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { TipForm } from '@/components/forms/tip-form';
import { deleteTip } from '@/actions/tip-actions';
import { useRouter } from 'next/navigation';
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
      await deleteTip(tipToDelete.id);
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

  if (isFormOpen) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">
            {editingTip ? 'Edit Tip' : 'Tambah Tip Baru'}
          </h2>
          <Button variant="ghost" onClick={() => setIsFormOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <TipForm 
          initialData={editingTip} 
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      </Card>
    );
  }

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
