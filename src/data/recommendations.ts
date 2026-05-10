import type { Recommendation, SkillResult, Worksheet } from '@/types';

// ─── Recommendations ──────────────────────────────────────────────────────────

/**
 * Recommendation cards shown on the Tips screen.
 * The item with `isMain: true` is the large featured card.
 * The rest appear in the sidebar column.
 */
export const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Latihan menggunting garis lurus',
    description:
      'Membantu koordinasi mata dan tangan serta memperkuat otot jari untuk persiapan menulis.',
    icon: 'Scissors',
    duration: '15 Menit',
    category: 'Motorik Halus',
    isMain: true,
  },
  {
    id: '2',
    title: 'Mewarnai dalam pola kecil',
    description: 'Melatih fokus dan kontrol gerakan tangan presisi.',
    icon: 'Palette',
    duration: '20 Menit',
    category: 'Konsentrasi',
  },
  {
    id: '3',
    title: 'Tracing bentuk sederhana',
    description: 'Dasar pra-menulis dan koordinasi alur.',
    icon: 'Brush',
    duration: '10 Menit',
    category: 'Pra-Menulis',
  },
  {
    id: '4',
    title: 'Menyusun Balok Kayu',
    description: 'Melatih persepsi ruang dan koordinasi motorik kasar.',
    icon: 'Shapes',
    duration: '30 Menit',
    category: 'Sensorial',
  },
];

// ─── Skill results (static — will come from API after real assessment) ────────

/**
 * Default skill results shown on the Results screen after an assessment.
 * In production, replace with the output of the Gemini scoring endpoint.
 */
export const defaultSkillResults: SkillResult[] = [
  {
    label: 'Motorik Kasar (Keseimbangan)',
    score: 85,
    status: 'Bagus',
    color: 'bg-tertiary-fixed-dim',
    barColor: 'text-tertiary',
  },
  {
    label: 'Motorik Halus (Genggaman)',
    score: 60,
    status: 'Cukup',
    color: 'bg-secondary-fixed-dim',
    barColor: 'text-secondary',
  },
  {
    label: 'Koordinasi Mata & Tangan',
    score: 45,
    status: 'Perlu Latihan',
    color: 'bg-error-container',
    barColor: 'text-error',
  },
];

// ─── Worksheets (Files screen) ────────────────────────────────────────────────

export const worksheets: Worksheet[] = [
  {
    id: 'buku-montessori',
    title: 'Buku Montessori',
    description:
      'Panduan sensorial lengkap untuk mengasah kemampuan motorik si kecil secara natural.',
    icon: 'Shapes',
    variant: 'paid',
    badge: 'PRODUK UTAMA',
    accent: 'secondary',
    url: '#beli-buku-montessori',
  },
  {
    id: 'lembar-gunting',
    title: 'Lembar Gunting',
    description: 'Melatih koordinasi bilateral dan kekuatan otot tangan si kecil.',
    icon: 'Scissors',
    variant: 'free',
    badge: 'PALING DICARI',
    accent: 'primary',
    url: '/worksheets/lembar-gunting.pdf',
  },
  {
    id: 'lembar-mewarnai',
    title: 'Lembar Mewarnai',
    description: 'Eksplorasi warna sekaligus melatih kontrol pensil yang presisi.',
    icon: 'Palette',
    variant: 'free',
    accent: 'tertiary',
    url: '/worksheets/lembar-mewarnai.pdf',
  },
  {
    id: 'lembar-tracing',
    title: 'Lembar Tracing',
    description: 'Dasar pra-menulis dengan mengikuti garis putus-putus yang seru.',
    icon: 'Brush',
    variant: 'free',
    accent: 'secondary',
    url: '/worksheets/lembar-tracing.pdf',
  },
];

// ─── Daily tip (static — future: fetch from CMS / Gemini) ────────────────────

export interface DailyTip {
  title: string;
  body: string;
}

export const dailyTip: DailyTip = {
  title: 'Tips Hari Ini: Berjalan Jinjit',
  body: 'Latih keseimbangan statis anak dengan mengajaknya berjalan jinjit di atas garis lurus selama 10 detik.',
};
