/**
 * Reusable skeleton loaders matching the exact shape of
 * Progress Cards, Tip Cards, and Worksheet Cards.
 * Use inside <Suspense fallback={<...Skeleton />} /> blocks.
 */

/* ── Progress Card Skeleton ────────────────────────────────────────────────── */
export function ProgressCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 bg-surface-container rounded-card p-5 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 bg-surface-container-high rounded" />
        <div className="h-4 w-10 bg-surface-container-high rounded" />
      </div>
      <div className="w-full h-3 bg-surface-container-high rounded-pill" />
      <div className="flex items-center gap-1.5 mt-1">
        <div className="h-3 w-3 bg-surface-container-high rounded-full" />
        <div className="h-3 w-20 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}

export function ProgressGridSkeleton() {
  return (
    <section className="flex flex-col gap-4 animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-40 bg-surface-container-high rounded" />
        <div className="h-5 w-24 bg-surface-container-high rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <ProgressCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Tip Card Skeleton ─────────────────────────────────────────────────────── */
export function TipCardSkeleton() {
  return (
    <section className="animate-pulse" aria-hidden="true">
      <div className="h-32 sm:h-28 rounded-card bg-surface-container" />
    </section>
  );
}

/* ── Worksheet Card Skeleton ───────────────────────────────────────────────── */
export function WorksheetCardSkeleton() {
  return (
    <div className="bg-surface-container rounded-card p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-5 w-3/4 bg-surface-container-high rounded" />
          <div className="h-3 w-full bg-surface-container-high rounded" />
        </div>
      </div>
      <div className="h-10 w-full bg-surface-container-high rounded-card" />
    </div>
  );
}

export function WorksheetGridSkeleton() {
  return (
    <section className="flex flex-col gap-6 animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-4 pt-4">
        <div className="w-14 h-14 bg-surface-container-high rounded-2xl" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-44 bg-surface-container-high rounded" />
          <div className="h-4 w-72 bg-surface-container-high rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <WorksheetCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Full-page Skeleton (assessment-like) ──────────────────────────────────── */
export function AssessmentSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto animate-pulse" aria-hidden="true">
      <div className="flex flex-col items-center gap-3 w-full pt-4">
        <div className="w-16 h-16 bg-surface-container-high rounded-2xl" />
        <div className="flex items-center justify-between w-full">
          <div className="h-7 w-52 bg-surface-container-high rounded" />
          <div className="h-6 w-20 bg-surface-container-high rounded-full" />
        </div>
        <div className="w-full h-3 bg-surface-container-high rounded-pill" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full bg-surface-container rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 bg-surface-container-high rounded-full shrink-0" />
            <div className="h-5 w-full bg-surface-container-high rounded" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-10 flex-1 bg-surface-container-high rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
