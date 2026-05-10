import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FilesScreen } from '@/features/files/components/files-screen';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { WorksheetGridSkeleton } from '@/components/ui/skeletons';

export const metadata: Metadata = {
  title: 'Koleksi Worksheet — SkillPath Kids',
};

export default function FilesPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<WorksheetGridSkeleton />}>
        <FilesScreen />
      </Suspense>
    </ErrorBoundary>
  );
}
