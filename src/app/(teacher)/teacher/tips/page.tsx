import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { TeacherTipsClient } from './teacher-tips-client';

export const metadata: Metadata = {
  title: 'Teacher Tips - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherTipsPage() {
  return (
    <ErrorBoundary>
      <TeacherTipsClient />
    </ErrorBoundary>
  );
}
