export const dashboardStatus = {
  success: {
    label: 'Sangat Baik',
    color: 'success',
    icon: '✅',
  },

  warning: {
    label: 'Perlu Perhatian',
    color: 'warning',
    icon: '⚠️',
  },

  danger: {
    label: 'Perlu Latihan',
    color: 'danger',
    icon: '❌',
  },

  neutral: {
    label: 'Belum Dimulai',
    color: 'neutral',
    icon: '🔵',
  },
} as const;