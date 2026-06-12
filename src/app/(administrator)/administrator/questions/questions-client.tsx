'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Edit2,
  Filter,
  Hash,
  HelpCircle,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

import { deleteQuestion, getQuestions } from '@/actions/question-actions';
import { Button } from '@/components/ui/button';
import {
  CATEGORY_OPTIONS,
  COLOR_OPTIONS,
  QuestionForm,
  getIconByName,
} from '@/components/forms/question-form';
import { APP_IMAGES } from '@/lib/assets';
import { getToken } from '@/lib/auth';
import type { AssessmentQuestion } from '@/types';

type AdminQuestion = AssessmentQuestion & { createdAt?: string };
type FilterLevel = 'Semua' | 'CHILD' | 'TEACHER';

const CATEGORY_COLOR: Record<string, { bg: string; fg: string; swatch: string }> = {
  'Motorik Halus': { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', swatch: '#d4e3ff' },
  'Motorik Kasar': { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', swatch: '#96f89f' },
  Keseimbangan: { bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', swatch: '#ffddb7' },
  Kognitif: { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
  Sensorial: { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', swatch: '#ffd6d6' },
  Bahasa: { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', swatch: '#ffe173' },
  Sosial: { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', swatch: '#ffd6d6' },
  'Asesmen Profesional': { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', swatch: '#d4e3ff' },
  Diferensiasi: { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', swatch: '#96f89f' },
  Komunikasi: { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', swatch: '#ffe173' },
  'Analitik Kelas': { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', swatch: '#f3e8ff' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLOR[category] ?? { bg: 'bg-[#e5e7eb]', fg: 'text-[#374151]', swatch: '#e5e7eb' };
}

function getLevelStyle(level: AssessmentQuestion['level'] | undefined) {
  return level === 'TEACHER'
    ? { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', label: 'TEACHER' }
    : { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', label: 'CHILD' };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getQuestionColor(question: AssessmentQuestion) {
  const categoryStyle = getCategoryStyle(question.category);
  const colorOption = COLOR_OPTIONS.find((color) => color.value === question.color);

  return {
    bg: colorOption?.bg ?? categoryStyle.bg,
    fg: colorOption?.fg ?? categoryStyle.fg,
    swatch: colorOption?.swatch ?? categoryStyle.swatch,
  };
}

export function QuestionsClient() {
  const router = useRouter();

  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<AssessmentQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('Semua');

  const fetchQuestions = async (token: string) => {
    setFetchError(null);
    setLoadingQuestions(true);
    try {
      const data = await getQuestions('ALL', token);
      setQuestions(data as AdminQuestion[]);
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

  const handleAddNew = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleEdit = (question: AssessmentQuestion) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const confirmDelete = (question: AssessmentQuestion) => {
    setQuestionToDelete(question);
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

  const filtered = questions.filter((question) => {
    const matchCategory = filterCategory === 'Semua' || question.category === filterCategory;
    const matchLevel = filterLevel === 'Semua' || question.level === filterLevel;
    return matchCategory && matchLevel;
  });

  const childCount = questions.filter((question) => question.level !== 'TEACHER').length;
  const teacherCount = questions.filter((question) => question.level === 'TEACHER').length;
  const lastUpdated = questions.length > 0
    ? formatDate(
        [...questions].sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )[0]?.createdAt
      )
    : '-';
  const isFilterActive = filterCategory !== 'Semua' || filterLevel !== 'Semua';

  if (isFormOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1d24]/50 p-4 backdrop-blur-sm">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white shadow-[0_24px_70px_rgba(15,29,36,0.24)]">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 rounded-t-[24px] border-b border-[#d4e3ff] bg-white px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4e3ff]">
                <ClipboardList className="h-5 w-5 text-[#004883]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-on-surface">
                  {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {editingQuestion
                    ? 'Perbarui isi pertanyaan asesmen tanpa mengubah struktur payload.'
                    : 'Buat pertanyaan baru untuk bank soal assessment CHILD atau TEACHER.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:bg-surface-container-low"
              aria-label="Tutup form"
            >
              <X className="h-4 w-4" aria-hidden="true" />
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

  if (loadingQuestions && questions.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-64 animate-pulse rounded-[28px] bg-[#d4e3ff]" />
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[28px] border border-[#d4e3ff] bg-[#d4e3ff] p-5 shadow-[0_16px_40px_rgba(0,72,131,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#96f89f] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#00531d]">
                Question Management
              </span>
              <span className="rounded-full bg-[#ffe173] px-3 py-1 text-xs font-black text-[#0f1d24]">
                CHILD & TEACHER Level
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight text-[#004883]">
              Kelola Pertanyaan
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#004883]">
              Atur soal assessment untuk anak dan guru berdasarkan level yang sesuai.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={Hash} label="Total Pertanyaan" value={questions.length} tone="blue" />
              <SummaryCard icon={Layers3} label="CHILD" value={childCount} tone="green" />
              <SummaryCard icon={BookOpenCheck} label="TEACHER" value={teacherCount} tone="yellow" />
            </div>
          </div>

          <Image
            src={APP_IMAGES.adminQuestionsManagement}
            alt="Ilustrasi manajemen pertanyaan administrator"
            width={340}
            height={270}
            priority
            className="admin-float mx-auto h-auto w-full max-w-[200px] shrink-0 motion-reduce:animate-none sm:max-w-[240px] lg:mx-0 lg:max-w-[320px]"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)]">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-on-surface">
            <Filter className="h-4 w-4 text-[#004883]" aria-hidden="true" />
            Filter Pertanyaan
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-on-surface-variant">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {['Semua', ...CATEGORY_OPTIONS].map((category) => {
                  const isActive = filterCategory === category;
                  const style = category === 'Semua' ? null : getCategoryStyle(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFilterCategory(category)}
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs font-black transition-all',
                        isActive
                          ? category === 'Semua'
                            ? 'border-[#004883] bg-[#004883] text-white'
                            : `border-transparent ${style!.bg} ${style!.fg}`
                          : 'border-[#d4e3ff] bg-white text-on-surface-variant hover:border-[#004883] hover:text-[#004883]',
                      ].join(' ')}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-on-surface-variant">Level</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'Semua', label: 'Semua' },
                  { value: 'CHILD', label: 'Child' },
                  { value: 'TEACHER', label: 'Teacher' },
                ].map((option) => {
                  const isActive = filterLevel === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilterLevel(option.value as FilterLevel)}
                      className={[
                        'rounded-full border px-4 py-1.5 text-xs font-black transition-all',
                        isActive
                          ? option.value === 'TEACHER'
                            ? 'border-transparent bg-[#d4e3ff] text-[#004883]'
                            : option.value === 'CHILD'
                              ? 'border-transparent bg-[#96f89f] text-[#00531d]'
                              : 'border-[#004883] bg-[#004883] text-white'
                          : 'border-[#d4e3ff] bg-white text-on-surface-variant hover:border-[#004883] hover:text-[#004883]',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] lg:w-64">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#004883]">Status Bank Soal</p>
            <p className="mt-2 text-sm font-semibold text-on-surface-variant">
              Terakhir diperbarui: <span className="font-black text-on-surface">{lastUpdated}</span>
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Menampilkan {filtered.length} dari {questions.length} pertanyaan.
            </p>
          </div>
          <Button
            variant="primary"
            className="rounded-[16px] font-black shadow-[0_5px_0_0_#004883]"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Pertanyaan
          </Button>
        </div>
      </section>

      {fetchError ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#ffd6d6] bg-white p-8 text-center shadow-[0_16px_40px_rgba(186,26,26,0.06)]">
          <Image
            src={APP_IMAGES.adminEmptyState}
            alt="Ilustrasi error pertanyaan"
            width={220}
            height={180}
            className="mb-4 h-auto w-full max-w-[190px]"
          />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
            <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-lg font-black text-on-surface">Gagal Memuat Pertanyaan</h3>
          <p className="mb-6 max-w-md text-sm text-on-surface-variant">{fetchError}</p>
          <Button variant="outline" icon={RefreshCw} onClick={() => fetchQuestions(getToken() || '')}>
            Coba Lagi
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyQuestionsState
          isFilterActive={isFilterActive}
          onAdd={handleAddNew}
        />
      ) : (
        <section className="grid gap-3">
          {loadingQuestions && questions.length > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#d4e3ff] bg-white px-4 py-3 text-xs font-bold text-[#004883] shadow-[0_8px_22px_rgba(0,72,131,0.06)]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Memperbarui daftar pertanyaan
            </div>
          ) : null}

          {filtered.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          ))}
        </section>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1d24]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_70px_rgba(15,29,36,0.24)]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd6d6]">
              <AlertTriangle className="h-7 w-7 text-[#ba1a1a]" aria-hidden="true" />
            </div>

            <h3 className="mb-1 text-lg font-black text-on-surface">Hapus Pertanyaan?</h3>
            <p className="mb-2 text-sm text-on-surface-variant">
              Pertanyaan berikut akan dihapus permanen:
            </p>

            {questionToDelete && (
              <div className="mb-5 rounded-2xl border border-[#d4e3ff] bg-surface-container-lowest p-4">
                <LevelBadge level={questionToDelete.level} />
                <p className="mt-3 line-clamp-3 text-sm font-bold text-on-surface">
                  {questionToDelete.text}
                </p>
              </div>
            )}

            <p className="mb-5 text-xs text-on-surface-variant">
              Tindakan ini tidak dapat dibatalkan.
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone: 'blue' | 'green' | 'yellow';
}) {
  const toneClass = {
    blue: 'bg-[#d4e3ff] text-[#004883]',
    green: 'bg-[#96f89f] text-[#00531d]',
    yellow: 'bg-[#ffe173] text-[#0f1d24]',
  }[tone];

  return (
    <div className="rounded-2xl bg-white/75 p-3 shadow-[0_8px_22px_rgba(0,72,131,0.08)] transition-all duration-200 hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xl font-black text-[#0f1d24]">{value}</p>
          <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
        </div>
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: AssessmentQuestion['level'] | undefined }) {
  const style = getLevelStyle(level);

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${style.bg} ${style.fg}`}>
      {style.label}
    </span>
  );
}

function QuestionCard({
  question,
  onEdit,
  onDelete,
}: {
  question: AdminQuestion;
  onEdit: (question: AssessmentQuestion) => void;
  onDelete: (question: AssessmentQuestion) => void;
}) {
  const categoryStyle = getCategoryStyle(question.category);
  const questionColor = getQuestionColor(question);
  const Icon = getIconByName(question.icon ?? 'ClipboardCheck');

  return (
    <article className="group rounded-[22px] border border-[#d4e3ff] bg-white p-4 shadow-[0_10px_28px_rgba(0,72,131,0.06)] transition-all duration-200 hover:scale-[1.005] hover:shadow-[0_14px_34px_rgba(0,72,131,0.11)] motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${questionColor.bg}`}>
            <Icon className={`h-6 w-6 ${questionColor.fg}`} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${categoryStyle.bg} ${categoryStyle.fg}`}>
                {question.category}
              </span>
              <LevelBadge level={question.level} />
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[10px] font-black text-[#374151]">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: questionColor.swatch }}
                  aria-hidden="true"
                />
                Color
              </span>
            </div>

            <p className="line-clamp-3 text-sm font-bold leading-relaxed text-on-surface">
              {question.text}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-on-surface-variant">
              <span>ID #{question.id}</span>
              <span>Icon: {question.icon || 'ClipboardCheck'}</span>
              <span>Dibuat: {formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 md:flex-col lg:flex-row">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d4e3ff] bg-white px-3 py-2 text-xs font-black text-[#004883] transition-colors hover:bg-[#d4e3ff]"
            aria-label={`Edit pertanyaan ${question.id}`}
          >
            <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(question)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ffd6d6] bg-white px-3 py-2 text-xs font-black text-[#ba1a1a] transition-colors hover:bg-[#ffd6d6]"
            aria-label={`Hapus pertanyaan ${question.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyQuestionsState({
  isFilterActive,
  onAdd,
}: {
  isFilterActive: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#d4e3ff] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,72,131,0.08)]">
      <Image
        src={APP_IMAGES.adminEmptyState}
        alt="Ilustrasi pertanyaan kosong"
        width={220}
        height={180}
        className="mb-4 h-auto w-full max-w-[190px]"
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4e3ff] text-[#004883]">
        {isFilterActive ? (
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
        ) : (
          <ClipboardList className="h-6 w-6" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-lg font-black text-on-surface">
        {isFilterActive ? 'Tidak ada pertanyaan untuk filter ini.' : 'Belum ada pertanyaan'}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
        {isFilterActive
          ? 'Coba ubah filter kategori atau level.'
          : 'Tambahkan pertanyaan assessment untuk mulai menyusun modul.'}
      </p>
      <Button variant="primary" className="mt-6 rounded-[14px] font-black" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah Pertanyaan
      </Button>
    </div>
  );
}
