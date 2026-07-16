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
  icon: string;   // icon name resolved via getIcon() in client components
  href: string;   // Next.js route path
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export type LikertValue = 'BB' | 'MB' | 'BSH' | 'BSB';

export const LIKERT_SCORE: Record<LikertValue, number> = {
  BB: 1,
  MB: 2,
  BSH: 3,
  BSB: 4,
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
  icon: string;
  category: SkillCategory | string;
  /** Tailwind bg class for the question's icon pill */
  color: string;
  level?: 'CHILD' | 'TEACHER';
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



export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
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
  icon: string;
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
  icon: string;
  variant: WorksheetVariant;
  badge?: string;         // e.g. "PRODUK UTAMA", "PALING DICARI"
  accent: 'primary' | 'secondary' | 'tertiary';
  /** PDF url or product purchase url */
  url: string;
}

export interface WorksheetProduct {
  id: number | string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  category: string;
  subCategory?: string | null;
  price: number;
  discountPrice?: number | null;
  discountPercent?: number | null;
  variant: WorksheetVariant;
  url?: string | null;
  mainImageUrl?: string | null;
  galleryImages?: string[] | unknown;
  rating: number;
  reviewCount: number;
  soldCount: number;
  badges?: string[] | unknown;
  features?: string[] | unknown;
  specifications?: Record<string, string> | unknown;
  shippingInfo?: Record<string, string> | string | unknown;
  isBestSeller: boolean;
  isPromo: boolean;
  isPublished: boolean;
  accentColor?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Child Profile (future real auth) ────────────────────────────────────────

export interface ChildProfile {
  id: string;
  name: string;
  ageMonths: number;
  avatarUrl?: string;
}

// ─── RBAC / Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'PARENT' | 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR';

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
