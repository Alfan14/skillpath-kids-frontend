'use client';

import { ClipboardCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AssessmentGroup } from '@/components/ui/assessment-option';
import { useAssessment } from '../hooks/use-assessment';
import { getIcon } from '@/lib/icon-map';

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

interface AssessmentScreenProps {
  level?: 'CHILD' | 'TEACHER';
  resultPath?: string;
  title?: string;
  subtitle?: string;
}

export function AssessmentScreen({
  level = 'CHILD',
  resultPath = '/results',
  title = 'Asesmen Montessori',
  subtitle = 'Yuk, ceritakan tentang si Kecil! 💕',
}: AssessmentScreenProps = {}) {
  const {
    answers,
    status,
    error,
    message,
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
  } = useAssessment({ level, resultPath });
  const isTeacher = level === 'TEACHER';
  const likertLegend = isTeacher ? TEACHER_LIKERT_LEGEND : DEFAULT_LIKERT_LEGEND;

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">

      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden rounded-b-[32px] bg-primary px-5 pb-6 pt-4">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#004883] opacity-50" />
        <div className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-secondary opacity-20" />

        {/* top row */}
        <div className="relative z-10 mb-4 flex items-center gap-3">
          {/* icon badge */}
          <div className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] ${isTeacher ? 'bg-[#ffe173] shadow-[0_4px_0_0_#d9b739]' : 'bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)]'}`}>
            <ClipboardCheck className="h-7 w-7 text-[#0f1d24]" aria-hidden="true" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-black text-xl leading-tight text-white tracking-wide uppercase italic">
              {title}
            </h1>
            <p className="mt-0.5 text-[11px] font-bold text-primary-container">
              {subtitle}
            </p>
          </div>

          {/* answered counter pill */}
          <div className={`ml-auto shrink-0 rounded-2xl px-4 py-1.5 text-center ${isTeacher ? 'bg-[#ffe173] shadow-[0_4px_0_0_#d9b739]' : 'bg-[#ffe173] shadow-[0_4px_0_0_rgba(15,29,36,0.12)]'}`}>
            <p className="text-2xl font-black leading-none text-[#0f1d24]">{totalAnswered}</p>
            <p className="text-[10px] font-bold text-[#0f1d24]">dari {totalQuestions}</p>
          </div>
        </div>

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
      <div className="flex flex-col gap-4">
        {questionsOnPage.map((question) => {
          const Icon = getIcon(question.icon);
          const isAnswered = answers[question.id] !== undefined;

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
                  <Icon className="h-5 w-5 text-on-surface" aria-hidden="true" />
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wide text-on-surface-variant">
                    Pertanyaan {question.id} dari {totalQuestions}
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
