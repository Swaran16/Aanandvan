/**
 * Design Tokens — Color Palette
 *
 * Refined design system:
 * - One primary brand accent (Aanandvan Deep Forest Green #163E2B)
 * - Strict warm-neutral scale (9 steps)
 * - Restrained semantic colors (WCAG AA compliant)
 * - No decorative gradients or muddy shadows
 */

export const Colors = {
  // Brand Primary (Deep Forest Green)
  primary: '#163E2B',
  primaryHover: '#102F20',
  primaryMuted: '#EBF4EF',
  primaryBorder: '#C9E2D4',
  primaryContrast: '#FFFFFF',

  // Warm Neutral Scale
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',

  // Semantic Accents (Restrained)
  success: '#15803D',
  successSurface: '#F0FDF4',
  successBorder: '#BBF7D0',

  warning: '#B45309',
  warningSurface: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#B91C1C',
  dangerSurface: '#FEF2F2',
  dangerBorder: '#FECACA',

  info: '#1D4ED8',
  infoSurface: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Surfaces
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSubtle: '#F3F4F6',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  // Text
  textHeading: '#111827',
  textBody: '#374151',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',

  // Compatibility aliases
  brandDark: '#163E2B',
  brandPrimary: '#163E2B',
  brandAccent: '#246143',
  brandLight: '#EBF4EF',
  brandMint: '#D8EFE1',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textDisabled: '#9CA3AF',
  textLight: '#A8D5BA',
  transparent: 'transparent',
  brandCream: '#FAFBF9',
  brandMuted: '#6B7280',
} as const;

/**
 * Exact Dashboard & Home Screen Color System
 * Extracted directly from reference design spec for full cross-app consistency.
 */
export const DashboardPalette = {
  // Pending Actions / 3 Pastel Cards
  cardBlue: '#DBE8F0',
  cardBlueBorder: '#C5D9E5',
  cardSage: '#CDE1D2',
  cardSageBorder: '#B7D0BE',
  cardLime: '#EBF29D',
  cardLimeBorder: '#DCE588',

  // Quick Action Circular Buttons
  quickCircle: '#E8F29E',
  quickCircleBorder: '#DCE888',
  quickIcon: '#163E2B',

  // Platform / Community / Field Overview (2x2 Grid)
  overviewBlue: '#DBE8F0',
  overviewBlueBorder: '#C5D9E5',
  overviewSage: '#CDE1D2',
  overviewSageBorder: '#B7D0BE',
  overviewLime: '#EBF29D',
  overviewLimeBorder: '#DCE588',
  overviewArrow: '#4B5563',

  // RoleSwitcher Pill
  rolePillBg: '#D8EBE0',
  rolePillBorder: '#C5DCCF',
  rolePillText: '#163E2B',

  // Headings & Brand Accents
  heading: '#163E2B',
  brandDark: '#163E2B',
  badgeYear: '#163E2B',

  // Growth Stats & Metrics
  chartCompleted: '#163E2B',
  chartInProgress: '#EAB308',

  // Bottom Navigation Active Indicator
  tabActivePill: '#C7EED8',
} as const;

export type ColorKey = keyof typeof Colors;
