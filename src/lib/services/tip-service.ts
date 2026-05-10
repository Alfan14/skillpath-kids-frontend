import { recommendations } from '@/data/recommendations';
import type { Recommendation } from '@/types';

type TipItem = Recommendation & { createdAt?: string };

const globalForTips = global as unknown as { tipsData: TipItem[] };

if (!globalForTips.tipsData) {
  globalForTips.tipsData = recommendations.map(r => ({
    ...r,
    createdAt: new Date().toISOString(),
  }));
}

export const TipService = {
  async getTips(): Promise<TipItem[]> {
    return [...globalForTips.tipsData];
  },

  async getTipById(id: string): Promise<TipItem | undefined> {
    return globalForTips.tipsData.find((t) => t.id === id);
  },

  async createTip(data: Omit<TipItem, 'id' | 'createdAt'>): Promise<TipItem> {
    const newId = Date.now().toString();

    const newTip: TipItem = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    globalForTips.tipsData.push(newTip);
    return newTip;
  },

  async updateTip(id: string, data: Partial<Omit<TipItem, 'id' | 'createdAt'>>): Promise<TipItem | null> {
    const index = globalForTips.tipsData.findIndex((t) => t.id === id);
    if (index === -1) return null;

    globalForTips.tipsData[index] = {
      ...globalForTips.tipsData[index],
      ...data,
    };
    
    return globalForTips.tipsData[index];
  },

  async deleteTip(id: string): Promise<boolean> {
    const initialLength = globalForTips.tipsData.length;
    globalForTips.tipsData = globalForTips.tipsData.filter((t) => t.id !== id);
    return globalForTips.tipsData.length !== initialLength;
  }
};
