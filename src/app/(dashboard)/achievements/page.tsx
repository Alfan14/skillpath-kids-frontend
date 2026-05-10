import type { Metadata } from 'next';
import { AchievementsScreen } from '@/features/achievements/components/achievements-screen';

export const metadata: Metadata = {
  title: 'Koleksi Lencana — SkillPath Kids',
};

export default function AchievementsPage() {
  return <AchievementsScreen />;
}
