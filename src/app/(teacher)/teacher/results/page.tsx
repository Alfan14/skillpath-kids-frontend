import type { Metadata } from 'next';
import { ResultsScreen } from '@/features/results/components/results-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export const metadata: Metadata = {
  title: 'Teacher Results - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherResultsPage() {
  return (
    <ErrorBoundary>
      <ResultsScreen
        assessmentPath="/teacher/assessment"
        recommendationsPath="/tips"
        title="Hasil Assessment Guru"
        subtitle="Ringkasan kompetensi profesional berdasarkan jawaban teacher-level."
      />
    </ErrorBoundary>
  );
}
