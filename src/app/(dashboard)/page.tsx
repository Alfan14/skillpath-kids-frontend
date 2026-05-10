import { DashboardShell } from '@/features/dashboard/components/dashboard-shell';
import { DashboardHero } from '@/features/dashboard/components/dashboard-hero';
import { DashboardProgress, DashboardProgressSkeleton } from '@/features/dashboard/components/dashboard-progress';
import { DashboardRecommendation } from '@/features/dashboard/components/dashboard-recommendation';
import { DashboardTip, DashboardTipSkeleton } from '@/features/dashboard/components/dashboard-tip';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

/**
 * Dashboard — Server Component.
 * Orchestrates dashboard sections following feature-driven architecture.
 */
export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHero />

      <Suspense fallback={<DashboardProgressSkeleton />}>
        <DashboardProgress />
      </Suspense>

      <DashboardRecommendation />

      <Suspense fallback={<DashboardTipSkeleton />}>
        <DashboardTip />
      </Suspense>
    </DashboardShell>
  );
}
