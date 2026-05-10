import type { AssessmentQuestion } from '@/types';

/**
 * Full Montessori assessment question bank.
 * Each question maps to a skill category assessed by the Gemini API.
 * Expand this list to reach the desired total (currently 10 for the MVP).
 * Icons are strings resolved via getIcon() in components.
 */
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    text: 'Anak menunjukkan kemandirian saat mengeksplorasi buku dengan fitur push-and-pull atau lift-and-flap.',
    icon: 'Home',
    category: 'Motorik Halus',
    color: 'bg-primary-container',
  },
  {
    id: 2,
    text: 'Anak lebih tertarik pada buku dengan gambar objek nyata daripada ilustrasi fantasi.',
    icon: 'Star',
    category: 'Sensorial',
    color: 'bg-tertiary',
  },
  {
    id: 3,
    text: 'Anak dapat menyelesaikan aktivitas pada worksheet (menggunting/mewarnai) dengan fokus yang baik.',
    icon: 'FileText',
    category: 'Motorik Halus',
    color: 'bg-secondary',
  },
  {
    id: 4,
    text: 'Anak mampu menggunting mengikuti garis lurus tanpa keluar jalur lebih dari 1 cm.',
    icon: 'Scissors',
    category: 'Motorik Halus',
    color: 'bg-primary-container',
  },
  {
    id: 5,
    text: 'Anak dapat berjalan di atas garis lurus sepanjang 3 meter tanpa kehilangan keseimbangan.',
    icon: 'Shapes',
    category: 'Keseimbangan',
    color: 'bg-tertiary',
  },
  {
    id: 6,
    text: 'Anak dapat memegang pensil atau krayon dengan posisi tripod grip (3 jari) secara alami.',
    icon: 'Palette',
    category: 'Motorik Halus',
    color: 'bg-secondary',
  },
  {
    id: 7,
    text: 'Anak mampu menelusuri (tracing) bentuk dasar seperti lingkaran dan kotak tanpa bantuan.',
    icon: 'Brush',
    category: 'Motorik Halus',
    color: 'bg-primary-container',
  },
  {
    id: 8,
    text: 'Anak menunjukkan ketertarikan membalik halaman buku satu per satu tanpa merobek.',
    icon: 'BookOpen',
    category: 'Motorik Halus',
    color: 'bg-tertiary',
  },
  {
    id: 9,
    text: 'Anak dapat menyusun balok kayu membentuk menara setinggi 6 balok atau lebih.',
    icon: 'Hand',
    category: 'Motorik Kasar',
    color: 'bg-secondary',
  },
  {
    id: 10,
    text: 'Anak mampu mengikuti gerakan sederhana (menirukan tepuk tangan berpola) dengan koordinasi yang baik.',
    icon: 'Eye',
    category: 'Kognitif',
    color: 'bg-primary-container',
  },
];

export const TOTAL_QUESTIONS = assessmentQuestions.length;
