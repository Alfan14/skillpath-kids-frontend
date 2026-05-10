import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessmentScreen } from '@/features/assessment/components/assessment-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { AssessmentSkeleton } from '@/components/ui/skeletons';

export const metadata: Metadata = {
  title: 'Asesmen Montessori — SkillPath Kids',
};

export default function AssessmentPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AssessmentSkeleton />}>
        <AssessmentScreen />
      </Suspense>
    </ErrorBoundary>
  );
}
