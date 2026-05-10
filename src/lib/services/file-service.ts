import { worksheets } from '@/data/recommendations';
import type { Worksheet } from '@/types';

type WorksheetItem = Worksheet & { createdAt?: string };

const globalForFiles = global as unknown as { filesData: WorksheetItem[] };

if (!globalForFiles.filesData) {
  globalForFiles.filesData = worksheets.map(w => ({
    ...w,
    createdAt: new Date().toISOString(),
  }));
}

export const FileService = {
  async getFiles(): Promise<WorksheetItem[]> {
    return [...globalForFiles.filesData];
  },

  async getFileById(id: string): Promise<WorksheetItem | undefined> {
    return globalForFiles.filesData.find((f) => f.id === id);
  },

  async createFile(data: Omit<WorksheetItem, 'id' | 'createdAt'>): Promise<WorksheetItem> {
    const newId = Date.now().toString();

    const newFile: WorksheetItem = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    globalForFiles.filesData.push(newFile);
    return newFile;
  },

  async updateFile(id: string, data: Partial<Omit<WorksheetItem, 'id' | 'createdAt'>>): Promise<WorksheetItem | null> {
    const index = globalForFiles.filesData.findIndex((f) => f.id === id);
    if (index === -1) return null;

    globalForFiles.filesData[index] = {
      ...globalForFiles.filesData[index],
      ...data,
    };
    
    return globalForFiles.filesData[index];
  },

  async deleteFile(id: string): Promise<boolean> {
    const initialLength = globalForFiles.filesData.length;
    globalForFiles.filesData = globalForFiles.filesData.filter((f) => f.id !== id);
    return globalForFiles.filesData.length !== initialLength;
  }
};
