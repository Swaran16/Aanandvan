/**
 * Design Tokens — Typography System
 *
 * Disciplined type scale (11 / 12 / 14 / 16 / 20 / 24 / 32)
 * Tight letter-spacing for large titles, comfortable reading line-height for body.
 */

export const FontSize = {
  caption: 11,
  xs: 11,
  sm: 12,
  bodySmall: 13,
  body: 14,
  base: 14,
  md: 14,
  bodyLarge: 16,
  lg: 16,
  titleSmall: 16,
  titleMedium: 18,
  titleLarge: 20,
  xl: 20,
  headingMedium: 24,
  headingLarge: 32,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
} as const;

export const LineHeight = {
  tight: 1.25,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.6,
} as const;

export const LetterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 0.3,
} as const;

export const FontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
