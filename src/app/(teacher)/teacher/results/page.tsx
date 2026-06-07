import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { TeacherResultsClient } from './teacher-results-client';

export const metadata: Metadata = {
  title: 'Teacher Results - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherResultsPage() {
  return (
    <ErrorBoundary>
      <TeacherResultsClient />
    </ErrorBoundary>
  );
}
