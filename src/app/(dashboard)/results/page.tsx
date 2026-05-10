import type { Metadata } from 'next';
import { ResultsScreen } from '@/features/results/components/results-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export const metadata: Metadata = {
  title: 'Hasil Asesmen — SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function ResultsPage() {
  return (
    <ErrorBoundary>
      <ResultsScreen />
    </ErrorBoundary>
  );
}
