import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillPath Kids',
  description:
    'Platform asesmen dan pengembangan motorik anak berbasis Montessori dengan antarmuka yang ceria dan edukatif.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
