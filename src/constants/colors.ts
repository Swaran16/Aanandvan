/**
 * App Color Palette — Aanandvan Brand
 * Central source of truth for all colors used across the app.
 * Update here to theme the entire application.
 */

export const Colors = {
  // ─── Brand: Aanandvan Forest Green ───────────────────────────────────────
  /** Deep forest green — splash bg, slide 4 bg, logo badge */
  brandDark: '#163421',
  /** Mid forest green — primary actions, buttons */
  brandPrimary: '#1B4332',
  /** Bright forest green — active states, icons, step badges */
  brandAccent: '#2D6A4F',
  /** Soft sage — onboarding content area tint */
  brandLight: '#EBF5EE',
  /** Very light mint — subtle backgrounds, step icon bg */
  brandMint: '#D8EFE1',
  /** Muted green — decorative leaf elements */
  brandMuted: '#4A7C5F',
  /** Warm cream — subtitle tints on dark bg */
  brandCream: '#A8D5BA',

  // ─── Neutrals ─────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',

  // ─── Grays ───────────────────────────────────────────────────────────────
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // ─── Backgrounds ─────────────────────────────────────────────────────────
  background: '#F5FAF6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // ─── Text ────────────────────────────────────────────────────────────────
  textPrimary: '#1A2E23',
  textSecondary: '#4B6E5A',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',

  // ─── Semantic ────────────────────────────────────────────────────────────
  success: '#2D6A4F',
  successLight: '#D8EFE1',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // ─── Border ──────────────────────────────────────────────────────────────
  border: '#D1E8DA',
  borderFocus: '#1B4332',

  // ─── Overlay ─────────────────────────────────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(22, 52, 33, 0.08)',

  // ─── Transparent ─────────────────────────────────────────────────────────
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
