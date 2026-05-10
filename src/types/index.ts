import type { LucideIcon } from 'lucide-react';

// ─── Navigation ───────────────────────────────────────────────────────────────

export type Page =
  | 'dashboard'
  | 'assessment'
  | 'results'
  | 'tips'
  | 'files'
  | 'achievements'
  | 'login'
  | 'signup';

export interface NavItem {
  id: Page;
  label: string;
  icon: LucideIcon;
  href: string; // Next.js route path
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export type LikertValue = 'SS' | 'S' | 'TS' | 'STS';

export const LIKERT_SCORE: Record<LikertValue, number> = {
  SS: 4,
  S: 3,
  TS: 2,
  STS: 1,
};

export type SkillCategory =
  | 'Motorik Kasar'
  | 'Motorik Halus'
  | 'Keseimbangan'
  | 'Kognitif'
  | 'Sensorial';

export interface AssessmentQuestion {
  id: number;
  text: string;
  iconName: string;
  category: SkillCategory | string;
  /** Tailwind bg class for the question's icon pill */
  color: string;
}

/** One answer keyed by question id */
export type AssessmentAnswers = Record<number, LikertValue>;

// ─── Results / Skills ─────────────────────────────────────────────────────────

export type SkillStatus = 'Bagus' | 'Cukup' | 'Perlu Latihan';

export interface SkillResult {
  label: string;
  score: number;          // 0–100
  status: SkillStatus;
  /** Tailwind bg class for the progress bar fill */
  color: string;
  /** Tailwind text class for the status label */
  barColor: string;
}

export interface OverallResult {
  score: number;          // 0–100
  category: string;       // e.g. "Cukup"
  focusAreas: string[];   // e.g. ["Ketelitian", "Koordinasi"]
  focusSummary: string;   // Short sentence shown in "Area Perhatian"
  skills: SkillResult[];
}

// ─── Badges ───────────────────────────────────────────────────────────────────
export type BadgeIcon =
  | 'star'
  | 'fileText'
  | 'award'
  | 'trophy'
  | 'lightbulb'
  | 'rocket'
  | 'flame';


export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: BadgeIcon;
  unlocked: boolean;
  date?: string;          // e.g. "30 Apr 2026" — only when unlocked
  /** Tailwind bg class for the unlocked card background tint */
  color: string;
}

// ─── Recommendations / Tips ───────────────────────────────────────────────────

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  iconName: string;
  duration: string;       // e.g. "15 Menit"
  category: string;       // e.g. "Motorik Halus"
  isMain?: boolean;       // The featured card on the Tips screen
}

// ─── Worksheets / Files ───────────────────────────────────────────────────────

export type WorksheetVariant = 'FREE' | 'PAID' | 'free' | 'paid';

export interface Worksheet {
  id: string;
  title: string;
  description: string;
  iconName: string;
  variant: WorksheetVariant;
  badge?: string;         // e.g. "PRODUK UTAMA", "PALING DICARI"
  accent: 'primary' | 'secondary' | 'tertiary';
  /** PDF url or product purchase url */
  url: string;
}

// ─── Child Profile (future real auth) ────────────────────────────────────────

export interface ChildProfile {
  id: string;
  name: string;
  ageMonths: number;
  avatarUrl?: string;
}

// ─── RBAC / Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'parent' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface HistoryResult {
  id: string | number;
  overallScore: number;
  categoryResult: string;
  focusSummary: string;
  focusAreas: string[];
  skillsData: {
    motorik: number;
    bahasa: number;
    sosial: number;
  };
  createdAt: string;
}
