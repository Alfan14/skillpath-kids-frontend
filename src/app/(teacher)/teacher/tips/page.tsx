import { getTips } from '@/actions/tip-actions';
import { TipsClient } from './tips-client';

export const metadata = {
  title: 'Kelola Tips - SkillPath Teacher',
};

export default async function TipsPage() {
  const tips = await getTips();
  
  return <TipsClient tips={tips} />;
}
