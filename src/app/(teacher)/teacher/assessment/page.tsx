import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessmentScreen } from '@/features/assessment/components/assessment-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { AssessmentSkeleton } from '@/components/ui/skeletons';

export const metadata: Metadata = {
  title: 'Teacher Assessment - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherAssessmentPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AssessmentSkeleton />}>
        <AssessmentScreen
          level="TEACHER"
          resultPath="/teacher/results"
          title="Teacher Assessment"
          subtitle="Soal advanced untuk kompetensi profesional guru."
        />
      </Suspense>
    </ErrorBoundary>
  );
}
