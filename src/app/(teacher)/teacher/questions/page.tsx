import { getQuestions } from '@/actions/question-actions';
import { QuestionsClient } from './questions-client';

export const metadata = {
  title: 'Kelola Pertanyaan - SkillPath Teacher',
};

export default async function QuestionsPage() {
  const questions = await getQuestions();
  
  return <QuestionsClient questions={questions} />;
}
