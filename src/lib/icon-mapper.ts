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
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
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
};

export function getIconFromName(name: string | null): LucideIcon {
  if (!name) return ClipboardCheck;
  return iconMap[name] || ClipboardCheck;
}
