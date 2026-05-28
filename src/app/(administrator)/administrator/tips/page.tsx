import { getTips } from '@/actions/tip-actions';
import { TipsClient } from './tips-client';

export const metadata = {
  title: 'Kelola Tips - SkillPath Admin',
};

export const dynamic = 'force-dynamic';

export default async function TipsPage() {
  const tips = await getTips();

  return <TipsClient tips={tips} />;
}
