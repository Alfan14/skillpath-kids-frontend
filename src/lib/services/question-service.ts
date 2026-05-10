import { assessmentQuestions } from '@/data/questions';
import type { AssessmentQuestion } from '@/types';

type QuestionItem = AssessmentQuestion & { createdAt?: string };

// Use global to persist across HMR in dev
const globalForQuestions = global as unknown as { questionsData: QuestionItem[] };

if (!globalForQuestions.questionsData) {
  globalForQuestions.questionsData = assessmentQuestions.map(q => ({
    ...q,
    createdAt: new Date().toISOString(),
  }));
}

export const QuestionService = {
  async getQuestions(): Promise<QuestionItem[]> {
    return [...globalForQuestions.questionsData];
  },

  async getQuestionById(id: number): Promise<QuestionItem | undefined> {
    return globalForQuestions.questionsData.find((q) => q.id === id);
  },

  async createQuestion(data: Omit<QuestionItem, 'id' | 'createdAt'>): Promise<QuestionItem> {
    const newId = globalForQuestions.questionsData.length > 0
      ? Math.max(...globalForQuestions.questionsData.map(q => q.id)) + 1
      : 1;

    const newQuestion: QuestionItem = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    globalForQuestions.questionsData.push(newQuestion);
    return newQuestion;
  },

  async updateQuestion(id: number, data: Partial<Omit<QuestionItem, 'id' | 'createdAt'>>): Promise<QuestionItem | null> {
    const index = globalForQuestions.questionsData.findIndex((q) => q.id === id);
    if (index === -1) return null;

    globalForQuestions.questionsData[index] = {
      ...globalForQuestions.questionsData[index],
      ...data,
    };
    
    return globalForQuestions.questionsData[index];
  },

  async deleteQuestion(id: number): Promise<boolean> {
    const initialLength = globalForQuestions.questionsData.length;
    globalForQuestions.questionsData = globalForQuestions.questionsData.filter((q) => q.id !== id);
    return globalForQuestions.questionsData.length !== initialLength;
  }
};
