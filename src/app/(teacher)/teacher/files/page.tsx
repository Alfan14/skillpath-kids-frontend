import { getFiles } from '@/actions/file-actions';
import { FilesClient } from './files-client';

export const metadata = {
  title: 'Kelola Worksheet - SkillPath Teacher',
};

export default async function FilesPage() {
  const files = await getFiles();
  
  return <FilesClient files={files} />;
}
