import React from 'react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-section">
      {children}
    </div>
  );
}
