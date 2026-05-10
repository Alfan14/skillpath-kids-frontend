'use client';

import { ClipboardCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AssessmentGroup } from '@/components/ui/assessment-option';
import { useAssessment } from '../hooks/use-assessment';
import { getIconFromName } from '@/lib/icon-mapper';

const LIKERT_LEGEND = [
  { code: 'SS', label: 'Sangat Setuju',      score: '(4)', color: 'text-tertiary' },
  { code: 'S',  label: 'Setuju',             score: '(3)', color: 'text-on-surface' },
  { code: 'TS', label: 'Tidak Setuju',       score: '(2)', color: 'text-error' },
  { code: 'STS',label: 'Sangat Tidak Setuju',score: '(1)', color: 'text-error' },
];

export function AssessmentScreen() {
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
  } = useAssessment();

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 w-full pt-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-secondary-container">
          <ClipboardCheck className="w-8 h-8 text-on-secondary-container" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-black italic text-primary tracking-wide uppercase">
            Asesmen Montessori
          </h1>
          <span className="bg-secondary-container text-on-secondary-container font-bold text-sm px-4 py-1.5 rounded-full">
            {totalAnswered} dari {totalQuestions}
          </span>
        </div>
        <div className="w-full" aria-live="polite" aria-label={`Progres: ${progress}%`}>
          <ProgressBar
            value={progress}
            fillClass="bg-secondary-container"
            heightClass="h-3"
            label={`Progres asesmen: ${progress}%`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm w-full">
        {LIKERT_LEGEND.map(({ code, label, score, color }) => (
          <span key={code} className="flex items-center gap-1">
            <strong className={`font-black ${color}`}>{code}:</strong>
            <span className="text-on-surface-variant">{label} {score}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {questionsOnPage.map((question) => {
          const Icon = getIconFromName(question.iconName);
          return (
            <div
              key={question.id}
              className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,96,172,0.06)]
                         border border-surface-container-highest"
            >
              {/* Question icon + text */}
              <div className="flex items-start gap-3 mb-5">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full
                              ${question.color} shrink-0`}
                >
                  <Icon className="w-5 h-5 text-on-surface" aria-hidden="true" />
                </div>
                <p className="text-base font-semibold text-on-surface leading-snug">
                  {question.text}
                </p>
              </div>

              {/* Likert radio group */}
              <AssessmentGroup
                questionId={String(question.id)}
                questionText={question.text}
                selectedValue={answers[question.id] ?? null}
                onChange={(val) => answer(question.id, val)}
              />
            </div>
          );
        })}
      </div>

      {message && (
        <div
          aria-live="polite"
          className="flex items-center gap-3 w-full p-4 rounded-2xl bg-secondary-container text-on-secondary-container"
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-3 w-full p-4 rounded-2xl bg-error-container text-on-error-container"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-3 w-full">
        {page > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={isSubmitting}
            className="flex-1"
            aria-label="Kembali ke halaman sebelumnya"
          >
            ← Sebelumnya
          </Button>
        )}

        {isLastPage ? (
          <Button
            variant="primary"
            size="lg"
            onClick={submitAssessment}
            disabled={!answeredOnPage || isSubmitting}
            loading={isSubmitting}
            className="flex-1"
            aria-label="Simpan dan lihat hasil asesmen"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan & Lihat Hasil →'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={nextPage}
            disabled={!answeredOnPage}
            className="flex-1"
            aria-label="Lanjut ke halaman berikutnya"
          >
            Simpan & Lanjutkan →
          </Button>
        )}
      </div>

      <footer className="text-center text-xs text-on-surface-variant pb-4">
        © 2026 SkillPath Kids. Didesain dengan penuh kasih sayang.
      </footer>
    </div>
  );
}
