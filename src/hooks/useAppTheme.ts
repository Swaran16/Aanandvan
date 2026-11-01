/**
 * useAppTheme Hook
 * Provides access to the app's color palette and theme tokens.
 * Use this hook in any component to access design tokens.
 *
 * Usage:
 *   const { colors, spacing, radius } = useAppTheme();
 */

import { Colors, Spacing, BorderRadius } from '@/constants';

export const useAppTheme = () => {
  return {
    colors: Colors,
    spacing: Spacing,
    radius: BorderRadius,
  };
};
