'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ClipboardCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AssessmentGroup } from '@/components/ui/assessment-option';
import { useAssessment } from '../hooks/use-assessment';
import { getIcon } from '@/lib/icon-map';
import { APP_IMAGES } from '@/lib/assets';
import type { AssessmentQuestion } from '@/types';

const DEFAULT_LIKERT_LEGEND = [
  { code: 'SS', label: 'Sangat Setuju', score: '(4)', chipBg: 'bg-[#96f89f]', chipText: 'text-[#00531d]' },
  { code: 'S', label: 'Setuju', score: '(3)', chipBg: 'bg-[#d4e3ff]', chipText: 'text-[#004883]' },
  { code: 'TS', label: 'Tidak Setuju', score: '(2)', chipBg: 'bg-[#ffe173]', chipText: 'text-[#0f1d24]' },
  { code: 'STS', label: 'Sangat Tidak Setuju', score: '(1)', chipBg: 'bg-error-container', chipText: 'text-on-error-container' },
];

const TEACHER_LIKERT_LEGEND = [
  { code: 'SS', label: 'Sangat Setuju', score: '(4)', chipBg: 'bg-[#96f89f]', chipText: 'text-[#00531d]' },
  { code: 'S', label: 'Setuju', score: '(3)', chipBg: 'bg-[#d4e3ff]', chipText: 'text-[#004883]' },
  { code: 'TS', label: 'Tidak Setuju', score: '(2)', chipBg: 'bg-[#ffe173]', chipText: 'text-[#0f1d24]' },
  { code: 'STS', label: 'Sangat Tidak Setuju', score: '(1)', chipBg: 'bg-error-container', chipText: 'text-on-error-container' },
];

const ALL_CATEGORIES = '__ALL__';

const CATEGORY_COLORS = [
  { bg: 'bg-[#d4e3ff]', fg: 'text-[#004883]', shadow: 'shadow-[0_6px_0_rgba(0,72,131,0.12)]' },
  { bg: 'bg-[#96f89f]', fg: 'text-[#00531d]', shadow: 'shadow-[0_6px_0_rgba(0,83,29,0.12)]' },
  { bg: 'bg-[#ffe173]', fg: 'text-[#0f1d24]', shadow: 'shadow-[0_6px_0_rgba(15,29,36,0.12)]' },
  { bg: 'bg-[#ffd6d6]', fg: 'text-[#ba1a1a]', shadow: 'shadow-[0_6px_0_rgba(186,26,26,0.12)]' },
  { bg: 'bg-[#f3e8ff]', fg: 'text-[#6b21a8]', shadow: 'shadow-[0_6px_0_rgba(107,33,168,0.12)]' },
  { bg: 'bg-[#ffddb7]', fg: 'text-[#7c2d12]', shadow: 'shadow-[0_6px_0_rgba(124,45,18,0.12)]' },
];

interface CategoryOption {
  key: string;
  label: string;
  count: number;
  icon: string;
  bg: string;
  fg: string;
  shadow: string;
}

function getCategoryLabel(category: string | null | undefined) {
  return category && category.trim() ? category.trim() : 'Umum';
}

function buildCategoryOptions(questions: AssessmentQuestion[]): CategoryOption[] {
  const map = new Map<string, { count: number; icon: string }>();

  questions.forEach((question) => {
    const label = getCategoryLabel(question.category);
    const current = map.get(label);
    map.set(label, {
      count: (current?.count ?? 0) + 1,
      icon: current?.icon ?? question.icon ?? 'ClipboardCheck',
    });
  });

  return Array.from(map.entries()).map(([label, data], index) => {
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
    return {
      key: label,
      label,
      count: data.count,
      icon: data.icon,
      ...color,
    };
  });
}

function getCategoryAsset(label: string, isTeacher = false): string | null {
  const normalized = label.toLowerCase();

  if (isTeacher) {
    if (normalized.includes('pedagogi') || normalized.includes('pedagogy')) {
      return APP_IMAGES.teacherAssessmentPedagogy;
    }

    if (normalized.includes('observasi') || normalized.includes('observation')) {
      return APP_IMAGES.teacherAssessmentObservation;
    }

    if (normalized.includes('komunikasi') || normalized.includes('communication')) {
      return APP_IMAGES.teacherAssessmentCommunication;
    }

    if (normalized.includes('evaluasi') || normalized.includes('evaluation')) {
      return APP_IMAGES.teacherAssessmentEvaluation;
    }

    if (
      normalized.includes('kelas') ||
      normalized.includes('classroom') ||
      normalized.includes('management') ||
      normalized.includes('manajemen')
    ) {
      return APP_IMAGES.teacherAssessmentClassroom;
    }
  }

  if (normalized.includes('bahasa') || normalized.includes('komunikasi')) {
    return APP_IMAGES.assessmentCategoryBahasa;
  }

  if (normalized.includes('kognitif')) {
    return APP_IMAGES.assessmentCategoryKognitif;
  }

  if (normalized.includes('halus')) {
    return APP_IMAGES.assessmentCategoryMotorikHalus;
  }

  if (normalized.includes('kasar') || normalized === 'motorik') {
    return APP_IMAGES.assessmentCategoryMotorikKasar;
  }

  if (normalized.includes('sosial') || normalized.includes('emosional')) {
    return APP_IMAGES.assessmentCategorySosialEmosional;
  }

  return null;
}

function CategorySelectionScreen({
  categories,
  totalQuestions,
  loading,
  title,
  subtitle,
  eyebrow = 'Assessment',
  isTeacher = false,
  onSelect,
}: {
  categories: CategoryOption[];
  totalQuestions: number;
  loading: boolean;
  title: string;
  subtitle: string;
  eyebrow?: string;
  isTeacher?: boolean;
  onSelect: (category: string) => void;
}) {
  const allColor = CATEGORY_COLORS[0];
  const AllIcon = getIcon('ClipboardCheck');
  const containerClassName = isTeacher
    ? 'mx-auto flex max-w-4xl flex-col gap-5'
    : 'mx-auto flex max-w-2xl flex-col gap-5';
  const gridClassName = isTeacher
    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid gap-4 sm:grid-cols-2';

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 py-10">
        <div className="h-32 animate-pulse rounded-[28px] bg-surface-container-high" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-[22px] bg-surface-container-high" />
          ))}
        </div>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20 text-center">
        {isTeacher ? (
          <Image
            src={APP_IMAGES.teacherEmptyState}
            alt="Ilustrasi soal assessment guru kosong"
            width={220}
            height={180}
            className="h-auto w-full max-w-[180px] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:max-w-[220px]"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#ffe173]">
            <AlertCircle className="h-8 w-8 text-[#0f1d24]" aria-hidden="true" />
          </div>
        )}
        <h1 className="text-xl font-black text-on-surface">
          {isTeacher ? 'Belum ada soal assessment guru' : 'Belum ada soal asesmen.'}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          {isTeacher
            ? 'Silakan hubungi administrator untuk menambahkan soal level Teacher.'
            : 'Soal akan tampil di sini setelah tersedia.'}
        </p>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className={`relative overflow-hidden rounded-[28px] px-5 py-6 shadow-[0_8px_32px_rgba(0,93,167,0.14)] ${isTeacher ? 'border border-[#d4e3ff] bg-[#d4e3ff] text-[#004883]' : 'bg-primary text-white'}`}>
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-xs font-black uppercase tracking-wide ${isTeacher ? 'text-[#00531d]' : 'text-[#d4e3ff]'}`}>
              {eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight">{title}</h1>
            <p className={`mt-2 max-w-md text-sm font-semibold leading-relaxed ${isTeacher ? 'text-[#004883]' : 'text-white/85'}`}>
              {subtitle}
            </p>
            {isTeacher && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#96f89f] px-3 py-1 text-[11px] font-black text-[#00531d]">
                  Level Soal: Teacher
                </span>
                <span className="rounded-full bg-[#ffe173] px-3 py-1 text-[11px] font-black text-[#0f1d24]">
                  Observasi Perkembangan
                </span>
              </div>
            )}
          </div>
          {isTeacher && (
            <Image
              src={APP_IMAGES.teacherAssessmentHero}
              alt="Ilustrasi assessment guru"
              width={260}
              height={210}
              priority
              className="teacher-float mx-auto h-auto w-full max-w-[180px] shrink-0 motion-reduce:animate-none sm:mx-0 sm:max-w-[230px]"
            />
          )}
        </div>
      </div>

      <div className={gridClassName}>
        <button
          type="button"
          onClick={() => onSelect(ALL_CATEGORIES)}
          className={`group flex min-h-36 flex-col items-start justify-between rounded-[22px] border border-outline-variant/20 p-5 text-left transition-all hover:-translate-y-0.5 hover:scale-[1.01] motion-reduce:hover:scale-100 ${allColor.bg} ${allColor.fg} ${allColor.shadow}`}
        >
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/55 sm:h-20 sm:w-20">
              <AllIcon className="h-7 w-7" aria-hidden="true" />
            </div>
            <span className="rounded-full bg-white/55 px-3 py-1 text-[10px] font-black">
              {totalQuestions} soal
            </span>
          </div>
          <div>
            <h2 className="text-lg font-black">Semua Kategori</h2>
            <p className="mt-1 text-xs font-bold opacity-80">Mulai asesmen penuh</p>
          </div>
        </button>

        {categories.map((category) => {
          const Icon = getIcon(category.icon);
          const categoryAsset = getCategoryAsset(category.label, isTeacher);
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onSelect(category.key)}
              className={`group flex min-h-36 flex-col items-start justify-between rounded-[22px] border border-outline-variant/20 p-5 text-left transition-all hover:-translate-y-0.5 hover:scale-[1.01] motion-reduce:hover:scale-100 ${category.bg} ${category.fg} ${category.shadow}`}
            >
              <div className="flex w-full items-start justify-between gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/55 sm:h-20 sm:w-20">
                  {categoryAsset ? (
                    <Image
                      src={categoryAsset}
                      alt=""
                      width={96}
                      height={96}
                      className="h-auto w-full max-w-[72px] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 sm:max-w-[88px]"
                    />
                  ) : (
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>
                <span className="rounded-full bg-white/55 px-3 py-1 text-[10px] font-black">
                  {category.count} soal
                </span>
              </div>
              <div>
                <h2 className="text-lg font-black">{category.label}</h2>
                <p className="mt-1 text-xs font-bold opacity-80">Mulai</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AssessmentScreenProps {
  level?: 'CHILD' | 'TEACHER';
  resultPath?: string;
  title?: string;
  subtitle?: string;
  enableCategorySelection?: boolean;
  categorySelectionTitle?: string;
  categorySelectionSubtitle?: string;
}

export function AssessmentScreen({
  level = 'CHILD',
  resultPath = '/results',
  title = 'Asesmen Montessori',
  enableCategorySelection,
  subtitle = 'Yuk, ceritakan tentang si Kecil! 💕',
  categorySelectionTitle = 'Halo, ayo pilih kategori asesmen!',
  categorySelectionSubtitle = 'Pilih area perkembangan yang ingin dinilai hari ini.',
}: AssessmentScreenProps = {}) {
  const isTeacher = level === 'TEACHER';
  const shouldEnableCategorySelection = enableCategorySelection ?? !isTeacher;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    answers,
    status,
    error,
    message,
    questions,
    filteredQuestions,
    isLoadingQuestions,
    page,
    totalPages,
    totalQuestions,
    questionsOnPage,
    answeredOnPage,
    totalAnswered,
    progress,
    isLastPage,
    isSubmitting,
    answer,
    nextPage,
    prevPage,
    submitAssessment,
  } = useAssessment({
    level,
    resultPath,
    selectedCategory: shouldEnableCategorySelection ? selectedCategory : null,
  });
  const likertLegend = isTeacher ? TEACHER_LIKERT_LEGEND : DEFAULT_LIKERT_LEGEND;
  const categoryOptions = useMemo(() => buildCategoryOptions(questions), [questions]);
  const selectedCategoryLabel = selectedCategory === ALL_CATEGORIES ? 'Semua Kategori' : selectedCategory;
  const teacherHeaderAsset = isTeacher
    ? getCategoryAsset(selectedCategoryLabel ?? '', true) ?? APP_IMAGES.teacherAssessmentHero
    : null;

  const handleBackToCategories = () => {
    if (totalAnswered > 0 && !window.confirm('Ganti kategori? Jawaban yang sudah dipilih tetap tersimpan.')) {
      return;
    }
    setSelectedCategory(null);
  };

  if (shouldEnableCategorySelection && !selectedCategory) {
    return (
      <CategorySelectionScreen
        categories={categoryOptions}
        totalQuestions={questions.length}
        loading={isLoadingQuestions}
        title={categorySelectionTitle}
        subtitle={categorySelectionSubtitle}
        eyebrow={isTeacher ? 'Teacher Assessment' : 'Assessment'}
        isTeacher={isTeacher}
        onSelect={setSelectedCategory}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">

      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className={`relative -mx-4 overflow-hidden rounded-b-[32px] px-5 pb-6 pt-4 md:-mx-8 ${isTeacher ? 'border-b border-[#d4e3ff] bg-[#d4e3ff]' : 'bg-primary'}`}>
        {isTeacher && teacherHeaderAsset ? (
          <Image
            src={teacherHeaderAsset}
            alt=""
            width={150}
            height={120}
            priority
            className="teacher-float pointer-events-none absolute right-3 top-2 hidden h-auto w-24 opacity-95 drop-shadow-[0_12px_22px_rgba(0,72,131,0.16)] motion-reduce:animate-none md:block"
          />
        ) : (
          <Image
            src={APP_IMAGES.assessmentHeader}
            alt=""
            width={140}
            height={100}
            priority
            className="pointer-events-none absolute right-3 top-2 hidden h-auto w-24 opacity-95 drop-shadow-[0_12px_22px_rgba(0,72,131,0.20)] md:block"
          />
        )}

        {/* top row */}
        <div className={`relative z-10 mb-4 flex items-center gap-3 md:pr-24`}>
          {/* icon badge */}
          <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] ${isTeacher ? 'bg-[#ffe173] shadow-[0_4px_0_0_#d9b739]' : 'bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)]'}`}>
            <ClipboardCheck className="h-7 w-7 text-[#0f1d24]" aria-hidden="true" />
          </div>

          <div className="flex flex-col">
            <h1 className={`font-black text-xl leading-tight tracking-wide uppercase italic ${isTeacher ? 'text-[#004883]' : 'text-white'}`}>
              {title}
            </h1>
            <p className={`mt-0.5 text-[11px] font-bold ${isTeacher ? 'text-[#004883]' : 'text-primary-container'}`}>
              {subtitle}
            </p>
          </div>

          {/* answered counter pill */}
          <div className={`ml-auto shrink-0 rounded-2xl px-4 py-1.5 text-center ${isTeacher ? 'bg-[#ffe173] shadow-[0_4px_0_0_#d9b739]' : 'bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)]'}`}>
            <p className="text-2xl font-black leading-none text-[#0f1d24]">{totalAnswered}</p>
            <p className="text-[10px] font-bold text-[#0f1d24]">dari {totalQuestions}</p>
          </div>
        </div>

        {shouldEnableCategorySelection && (
          <div className={`relative z-10 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 ${isTeacher ? 'bg-white/65' : 'bg-white/12'}`}>
            <span className={`text-[11px] font-black ${isTeacher ? 'text-[#004883]' : 'text-white'}`}>
              Kategori: {selectedCategoryLabel}
            </span>
            <button
              type="button"
              onClick={handleBackToCategories}
              className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#004883] transition-colors hover:bg-[#d4e3ff]"
            >
              Ganti Kategori
            </button>
          </div>
        )}

        {/* progress bar */}
        <div
          className="relative z-10"
          aria-live="polite"
          aria-label={`Progres: ${progress}%`}
        >
          <ProgressBar
            value={progress}
            fillClass={isTeacher ? 'bg-[#ffe173]' : 'bg-[#ffe173]'}
            heightClass="h-3.5"
            label={`Progres asesmen: ${progress}%`}
            className={isTeacher ? 'border-transparent bg-[#d4e3ff] shadow-none' : 'border-transparent bg-[#004883] shadow-none'}
          />
          <div className={`mt-1.5 flex justify-between text-[11px] font-bold ${isTeacher ? 'text-[#0f1d24]' : 'text-[#004883]'}`}>
            <span>Mulai</span>
            <span>{progress}% selesai ⭐</span>
          </div>
        </div>
      </div>

      {/* ── Page dots ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === page ? 24 : 8,
              background: i === page ? '#005da7' : i < page ? '#96f89f' : '#e0f0fa',
            }}
          />
        ))}
      </div>

      {/* ── Legend strip ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 rounded-[18px] border-2 border-primary-container bg-white px-3 py-2.5">
        {likertLegend.map(({ code, label, score, chipBg, chipText }) => (
          <div key={code} className="flex flex-1 basis-[40%] items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[10px] font-black ${chipBg} ${chipText}`}
            >
              {code}
            </span>
            <div>
              <p className={`text-[10px] font-extrabold leading-none ${chipText}`}>{label}</p>
              <p className="text-[9px] text-on-surface-variant">{score}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Question cards ───────────────────────────────────────────────────── */}
      {filteredQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed border-primary-container bg-white p-8 text-center">
          <AlertCircle className="h-10 w-10 text-primary" aria-hidden="true" />
          <div>
            <p className="text-base font-black text-on-surface">Belum ada soal pada kategori ini.</p>
            <p className="mt-1 text-sm text-on-surface-variant">Silakan pilih kategori lain.</p>
          </div>
          {shouldEnableCategorySelection && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedCategory(null)}
              className="rounded-[14px] font-black"
            >
              Kembali ke Kategori
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {questionsOnPage.map((question, index) => {
          const Icon = getIcon(question.icon);
          const questionCategoryAsset = isTeacher
            ? getCategoryAsset(getCategoryLabel(question.category), true)
            : null;
          const isAnswered = answers[question.id] !== undefined;
          const questionNumber = page * 3 + index + 1;

          return (
            <div
              key={question.id}
              className={[
                'relative overflow-hidden rounded-[22px] border-2 p-5 transition-all duration-300',
                isAnswered
                  ? 'border-tertiary-container bg-[#f4fff5]'
                  : 'border-transparent bg-white shadow-[0_10px_30px_rgba(0,93,167,0.06)]',
              ].join(' ')}
            >
              {/* left accent bar */}
              <div className={`absolute inset-y-0 left-0 w-1.5 rounded-l-[22px] ${question.color}`} />

              {/* answered checkmark */}
              {isAnswered && (
                <CheckCircle2
                  className="absolute right-3 top-3 h-5 w-5 text-tertiary"
                  aria-hidden="true"
                />
              )}

              {/* Question icon + number label + text — single block, no duplication */}
              <div className="mb-5 flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${question.color}`}
                >
                  {questionCategoryAsset ? (
                    <Image
                      src={questionCategoryAsset}
                      alt=""
                      width={56}
                      height={56}
                      className="h-auto w-full max-w-[34px]"
                    />
                  ) : (
                    <Icon className="h-5 w-5 text-on-surface" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wide text-on-surface-variant">
                    Pertanyaan {questionNumber} dari {totalQuestions}
                  </p>
                  <p className="text-base font-bold leading-snug text-on-surface">
                    {question.text}
                  </p>
                </div>
              </div>

              {/* Likert radio group */}
              <AssessmentGroup
                questionId={String(question.id)}
                questionText={question.text}
                selectedValue={answers[question.id] ?? null}
                onChange={(val) => answer(question.id, val)}
                variant={isTeacher ? 'teacher' : 'default'}
              />
            </div>
          );
        })}
      </div>

      {/* ── Info message ─────────────────────────────────────────────────────── */}
      {message && (
        <div
          aria-live="polite"
          className="flex items-center gap-3 w-full p-4 rounded-2xl bg-secondary-container text-on-secondary-container"
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* ── Error alert ──────────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex w-full items-center gap-3 rounded-2xl bg-error-container p-4 text-on-error-container"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── Navigation buttons ───────────────────────────────────────────────── */}
      <div className="flex gap-3 w-full pb-4 pt-1">
        {page > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={isSubmitting}
            className="flex-1 rounded-[18px] border-2 border-primary font-extrabold text-primary hover:bg-primary-container"
            aria-label="Kembali ke halaman sebelumnya"
          >
            ← Sebelumnya
          </Button>
        )}

        {isLastPage ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => submitAssessment()}
            disabled={!answeredOnPage || isSubmitting}
            loading={isSubmitting}
            className="flex-1 rounded-[18px] font-black"
            aria-label="Simpan dan lihat hasil asesmen"
          >
            {isSubmitting ? 'Menyimpan...' : '🎉 Simpan & Lihat Hasil'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={nextPage}
            disabled={!answeredOnPage}
            className="flex-1 rounded-[18px] font-black"
            aria-label="Lanjut ke halaman berikutnya"
          >
            Simpan & Lanjutkan ✨
          </Button>
        )}
      </div>

      <footer className="pb-4 text-center text-xs text-on-surface-variant">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
