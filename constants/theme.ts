export const colors = {
  background: '#EEF6FF',
  foreground: '#0F172A',
  card: '#FFFFFF',
  muted: '#DBEAFE',
  mutedForeground: 'rgba(15, 23, 42, 0.62)',
  primary: '#0F172A',
  accent: '#2563EB',
  accentDark: '#1D4ED8',
  accentSoft: '#BFDBFE',
  border: 'rgba(37, 99, 235, 0.14)',
  success: '#059669',
  warning: '#D97706',
  destructive: '#DC2626',
  studyBlue: '#DBEAFE',
  studyCyan: '#CFFAFE',
  studyIndigo: '#E0E7FF',
  studySky: '#BAE6FD',
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
