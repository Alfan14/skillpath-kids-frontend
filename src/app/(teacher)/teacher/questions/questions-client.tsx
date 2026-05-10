'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { QuestionForm } from '@/components/forms/question-form';
import { deleteQuestion } from '@/actions/question-actions';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import type { AssessmentQuestion } from '@/types';

export function QuestionsClient({ questions }: { questions: AssessmentQuestion[] }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<AssessmentQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleEdit = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setIsFormOpen(true);
  };

  const confirmDelete = (q: AssessmentQuestion) => {
    setQuestionToDelete(q);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      await deleteQuestion(questionToDelete.id, token || '');
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pertanyaan');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFormOpen) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">
            {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </h2>
          <Button variant="ghost" onClick={() => setIsFormOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <QuestionForm 
          initialData={editingQuestion} 
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
          <h1 className="text-2xl font-black text-on-surface">Manajemen Pertanyaan</h1>
          <p className="text-sm text-on-surface-variant">Kelola bank soal untuk asesmen montessori.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleAddNew}>
          <Plus className="w-4 h-4" /> Tambah Baru
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {questions.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-card border border-outline-variant/30">
            Belum ada pertanyaan.
          </div>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <BadgePill color="primary">{q.category}</BadgePill>
                </div>
                <p className="text-sm font-bold text-on-surface">{q.text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => handleEdit(q)}>
                  <Edit2 className="w-4 h-4 text-on-surface-variant" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => confirmDelete(q)} className="hover:bg-error hover:text-white border-error/30 text-error">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-black text-on-surface mb-2">Hapus Pertanyaan?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.
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
