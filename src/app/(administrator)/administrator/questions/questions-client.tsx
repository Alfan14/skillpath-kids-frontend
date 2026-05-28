'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus, Edit2, Trash2, X, ClipboardList,
  AlertTriangle, Hash, CheckCircle2, Clock, Filter, BookOpen, Users,
} from 'lucide-react';
import { QuestionForm, getIconByName, COLOR_OPTIONS, CATEGORY_OPTIONS } from '@/components/forms/question-form';
import { deleteQuestion, getQuestions } from '@/actions/question-actions';
import type { QuestionLevel } from '@/actions/question-actions';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import type { AssessmentQuestion } from '@/types';

// ── Category → color mapping (fallback palette) ───────────────────────────────
const CATEGORY_COLOR: Record<string, { bg: string; fg: string; swatch: string }> = {
  'Motorik Halus':  { bg: 'bg-primary-container',   fg: 'text-primary',                swatch: '#d4e3ff' },
  'Motorik Kasar':  { bg: 'bg-tertiary-container',  fg: 'text-tertiary',               swatch: '#96f89f' },
  'Keseimbangan':   { bg: 'bg-[#fff3e0]',           fg: 'text-[#c2410c]',             swatch: '#fff3e0' },
  'Kognitif':       { bg: 'bg-[#f3e8ff]',           fg: 'text-[#6d28d9]',             swatch: '#f3e8ff' },
  'Sensorial':      { bg: 'bg-[#fce7f3]',           fg: 'text-[#be185d]',             swatch: '#fce7f3' },
  'Bahasa':         { bg: 'bg-secondary-container', fg: 'text-on-secondary-container', swatch: '#ffe173' },
  'Sosial':         { bg: 'bg-error-container',     fg: 'text-error',                  swatch: '#ffd6d6' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLOR[category] ?? { bg: 'bg-surface-container', fg: 'text-on-surface-variant', swatch: '#e0f0fa' };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────
export function QuestionsClient() {
  const router = useRouter();

  const [questions, setQuestions] = useState<(AssessmentQuestion & { createdAt?: string })[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isFormOpen,       setIsFormOpen]       = useState(false);
  const [editingQuestion,  setEditingQuestion]  = useState<AssessmentQuestion | null>(null);
  const [isDeleteModalOpen,setIsDeleteModalOpen]= useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<AssessmentQuestion | null>(null);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [filterCategory,   setFilterCategory]   = useState<string>('Semua');
  const [filterLevel,      setFilterLevel]      = useState<QuestionLevel | 'Semua'>('Semua');

  const fetchQuestions = async (token: string) => {
    setFetchError(null);
    try {
      const data = await getQuestions('ALL', token);
      setQuestions(data as any);
    } catch (err: any) {
      setFetchError(err.message || 'Gagal memuat pertanyaan');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchQuestions(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAddNew = () => { setEditingQuestion(null); setIsFormOpen(true); };
  const handleEdit   = (q: AssessmentQuestion) => { setEditingQuestion(q); setIsFormOpen(true); };
  const confirmDelete= (q: AssessmentQuestion) => { setQuestionToDelete(q); setIsDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      const token = getToken();
      await deleteQuestion(questionToDelete.id, token || '');
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
      
      // refetch
      if (token) {
        await fetchQuestions(token);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus pertanyaan');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = async () => {
    setIsFormOpen(false);
    const token = getToken();
    if (token) {
      await fetchQuestions(token);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filtered = questions.filter(q => {
    const matchCategory = filterCategory === 'Semua' || q.category === filterCategory;
    const matchLevel = filterLevel === 'Semua' || q.level === filterLevel;
    return matchCategory && matchLevel;
  });

  const lastUpdated = questions.length > 0
    ? (() => {
        const sorted = [...questions].sort((a: any, b: any) =>
          new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime()
        );
        return formatDate((sorted[0] as any).createdAt);
      })()
    : '—';

  // ── Form view ────────────────────────────────────────────────────────────────
  if (isFormOpen) {
    return (
      // full-screen modal overlay
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">

          {/* modal header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 rounded-t-[24px] border-b border-outline-variant/20 bg-white px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary-container shadow-[0_4px_0_0_#d4e3ff]">
                <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-on-surface">
                  {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                </h2>
                <p className="text-[11px] text-on-surface-variant">
                  {editingQuestion ? 'Perbarui isi pertanyaan asesmen.' : 'Buat pertanyaan baru untuk menambah bank soal asesmen.'}
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

          <div className="px-6 py-5">
            <QuestionForm
              initialData={editingQuestion}
              onSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-on-surface-variant font-medium">Memuat pertanyaan...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">Manajemen Pertanyaan</h1>
          <p className="text-sm text-on-surface-variant">Kelola bank soal untuk asesmen montessori.</p>
        </div>
        <Button
          variant="primary"
          className="rounded-[18px] font-black shadow-[0_5px_0_0_#004883] gap-2 shrink-0"
          onClick={handleAddNew}
        >
          <Plus className="h-4 w-4" />
          Tambah Pertanyaan
        </Button>
      </div>

      {/* ── Stat bar ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Hash,          label: 'Total Pertanyaan', value: questions.length,          bg: 'bg-primary-container',   fg: 'text-primary'  },
          { icon: CheckCircle2,  label: 'Aktif',            value: questions.length,          bg: 'bg-tertiary-container',  fg: 'text-tertiary' },
          { icon: Clock,         label: 'Terakhir Diperbarui', value: lastUpdated,            bg: 'bg-secondary-container', fg: 'text-on-secondary-container' },
          { icon: Filter,        label: 'Filter',           value: filterCategory,            bg: 'bg-surface-container',   fg: 'text-on-surface-variant' },
        ].map(({ icon: Icon, label, value, bg, fg }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-[16px] border border-outline-variant/30 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,93,167,0.06)]"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${bg}`}>
              <Icon className={`h-4 w-4 ${fg}`} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
              <p className="truncate text-sm font-black text-on-surface">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Category filter pills ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {['Semua', ...CATEGORY_OPTIONS].map((cat) => {
          const isActive = filterCategory === cat;
          const style = cat === 'Semua' ? null : getCategoryStyle(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={[
                'rounded-full px-4 py-1.5 text-xs font-black transition-all border-2',
                isActive
                  ? cat === 'Semua'
                    ? 'bg-primary text-white border-primary shadow-[0_3px_0_0_#004883]'
                    : `${style!.bg} ${style!.fg} border-transparent shadow-[0_3px_0_0_rgba(0,0,0,0.1)]`
                  : 'bg-white text-on-surface-variant border-outline-variant/40 hover:border-primary/30',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Level filter pills ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {['Semua', 'CHILD', 'TEACHER'].map((lvl) => {
          const isActive = filterLevel === lvl;
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl as QuestionLevel | 'Semua')}
              className={[
                'rounded-full px-4 py-1.5 text-xs font-black transition-all border-2',
                isActive
                  ? 'bg-secondary text-white border-secondary shadow-[0_3px_0_0_#9a6b00]'
                  : 'bg-white text-on-surface-variant border-outline-variant/40 hover:border-secondary/30',
              ].join(' ')}
            >
              {lvl === 'Semua' ? 'Semua Level' : lvl}
            </button>
          );
        })}
      </div>

      {/* ── Question list ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {fetchError ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-error bg-error-container p-12 text-center">
            <AlertTriangle className="h-8 w-8 text-error" />
            <p className="font-black text-error">{fetchError}</p>
            <Button variant="outline" onClick={() => fetchQuestions(getToken() || '')}>Coba Lagi</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-primary-container bg-surface-container-lowest p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary-container shadow-[0_4px_0_0_#d4e3ff]">
              <ClipboardList className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-black text-on-surface">
                {filterCategory === 'Semua' ? 'Belum ada pertanyaan' : `Tidak ada pertanyaan "${filterCategory}"`}
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {filterCategory === 'Semua'
                  ? 'Mulai tambah pertanyaan pertama untuk bank soal asesmen.'
                  : 'Coba pilih kategori lain atau tambah pertanyaan baru.'}
              </p>
            </div>
            <Button variant="primary" className="rounded-[14px] font-black" onClick={handleAddNew}>
              <Plus className="h-4 w-4" /> Tambah Pertanyaan
            </Button>
          </div>
        ) : (
          filtered.map((q) => {
            const catStyle = getCategoryStyle(q.category);
            const colorOpt = COLOR_OPTIONS.find(c => c.value === q.color);
            const iconBg   = colorOpt?.bg  ?? catStyle.bg;
            const iconFg   = colorOpt?.fg  ?? catStyle.fg;
            const Icon     = getIconByName(q.icon ?? 'Home');

            return (
              <div
                key={q.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[20px] border border-outline-variant/30 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,93,167,0.05)] transition-all hover:border-primary/30 hover:shadow-[0_6px_20px_rgba(0,93,167,0.10)]"
              >
                {/* icon + content */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* icon badge */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ${iconBg} shadow-sm`}>
                    <Icon className={`h-6 w-6 ${iconFg}`} aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* category & level badge */}
                    <div className="mb-1.5 flex gap-2 flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black ${catStyle.bg} ${catStyle.fg}`}>
                        {q.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black ${q.level === 'TEACHER' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-container text-tertiary'}`}>
                        {q.level || 'CHILD'}
                      </span>
                    </div>
                    {/* question text */}
                    <p className="text-sm font-bold text-on-surface leading-snug line-clamp-2">
                      {q.text}
                    </p>
                    {/* meta */}
                    <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-on-surface-variant">
                      {(q as any).createdAt && (
                        <span className="flex items-center gap-1">
                          📅 Dibuat {formatDate((q as any).createdAt)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        🕐 ID #{q.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(q)}
                    className="flex items-center gap-1.5 rounded-[12px] border border-outline-variant/40 bg-white px-3 py-2 text-xs font-bold text-on-surface-variant transition-all hover:border-primary/40 hover:bg-primary-container hover:text-primary"
                    aria-label={`Edit pertanyaan ${q.id}`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(q)}
                    className="flex items-center gap-1.5 rounded-[12px] border border-error/20 bg-white px-3 py-2 text-xs font-bold text-error transition-all hover:bg-error-container"
                    aria-label={`Hapus pertanyaan ${q.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)]">

            {/* icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-error-container shadow-[0_4px_0_0_#ffd6d6]">
              <AlertTriangle className="h-7 w-7 text-error" aria-hidden="true" />
            </div>

            <h3 className="text-lg font-black text-on-surface mb-1">Hapus Pertanyaan?</h3>
            <p className="text-sm text-on-surface-variant mb-2">
              Pertanyaan berikut akan dihapus permanen:
            </p>

            {/* question preview */}
            {questionToDelete && (
              <div className="mb-5 rounded-[14px] border border-outline-variant/30 bg-surface-container-lowest p-3">
                <span className={`mb-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black ${getCategoryStyle(questionToDelete.category).bg} ${getCategoryStyle(questionToDelete.category).fg}`}>
                  {questionToDelete.category}
                </span>
                <p className="text-sm font-bold text-on-surface line-clamp-2">{questionToDelete.text}</p>
              </div>
            )}

            <p className="mb-5 text-xs text-on-surface-variant">
              ⚠️ Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-[14px] border-2 border-outline-variant font-bold"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                className="rounded-[14px] font-black shadow-[0_4px_0_0_rgba(186,26,26,0.4)]"
                onClick={handleDelete}
                loading={isDeleting}
              >
                Hapus Sekarang
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}