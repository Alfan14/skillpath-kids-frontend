import type { Metadata } from 'next';
import { TipsScreen } from '@/features/tips/components/tips-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';

export const metadata: Metadata = {
  title: 'Tips & Rekomendasi — SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TipsPage() {
  return (
    <ErrorBoundary>
      <TipsScreen />
    </ErrorBoundary>
  );
}
