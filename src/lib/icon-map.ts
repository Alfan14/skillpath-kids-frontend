import {
  Pencil,
  Shapes,
  Scissors,
  Lightbulb,
  FileText,
  Home,
  Star,
  Palette,
  Brush,
  BookOpen,
  Hand,
  Eye,
  MessageCircle,
  Users,
  Brain,
  Activity,
  Circle,
  Calculator,
  ClipboardCheck,
  Heart,
  Book,
  Music,
  Medal,
  LineChart,
  BarChart3,
  Trophy,
  Award,
  Rocket,
  Flame,
  type LucideIcon,
} from 'lucide-react';

/**
 * Canonical icon map — resolves backend `iconName` strings
 * to Lucide React components.
 *
 * Usage (Client Components only):
 *   const Icon = getIcon('Scissors');
 *   <Icon className="w-5 h-5" />
 */
const iconMap: Record<string, LucideIcon> = {
  // assessment / general
  Pencil,
  Shapes,
  Scissors,
  Lightbulb,
  FileText,
  Home,
  Star,
  Palette,
  Brush,
  BookOpen,
  Hand,
  Eye,
  MessageCircle,
  Users,
  Brain,
  Activity,
  Circle,
  Calculator,
  ClipboardCheck,
  Heart,
  Book,
  Music,
  Medal,
  LineChart,
  BarChart3,
  Trophy,
  Award,
  Rocket,
  Flame,

  // lowercase aliases (backend may send either)
  pencil: Pencil,
  shapes: Shapes,
  scissors: Scissors,
  lightbulb: Lightbulb,
  fileText: FileText,
  home: Home,
  star: Star,
  palette: Palette,
  brush: Brush,
  bookOpen: BookOpen,
  hand: Hand,
  eye: Eye,
  messageCircle: MessageCircle,
  users: Users,
  brain: Brain,
  activity: Activity,
  circle: Circle,
  calculator: Calculator,
  clipboardCheck: ClipboardCheck,
  heart: Heart,
  book: Book,
  music: Music,
  medal: Medal,
  lineChart: LineChart,
  barChart3: BarChart3,
  trophy: Trophy,
  award: Award,
  rocket: Rocket,
  flame: Flame,
};

/** Resolve an icon name to a Lucide component. Falls back to ClipboardCheck. */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return ClipboardCheck;
  return iconMap[name] ?? ClipboardCheck;
}

/** @deprecated Use `getIcon` instead. Kept for backward compat during migration. */
export const getIconFromName = getIcon;

export { iconMap };
