/**
 * Text Component
 * A typed wrapper around React Native's Text with design system variants.
 *
 * Usage:
 *   <Text variant="h1">Hello</Text>
 *   <Text variant="body1" color={Colors.textSecondary}>Description</Text>
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps as RNTextProps } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants';
import { TextVariant } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

// ─── Variant Styles ───────────────────────────────────────────────────────────

const variantStyles: Record<TextVariant, TextStyle> = {
  h1: { fontSize: FontSize['4xl'], fontWeight: FontWeight.bold, lineHeight: FontSize['4xl'] * 1.2 },
  h2: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, lineHeight: FontSize['3xl'] * 1.25 },
  h3: { fontSize: FontSize['2xl'], fontWeight: FontWeight.semiBold, lineHeight: FontSize['2xl'] * 1.3 },
  h4: { fontSize: FontSize.xl, fontWeight: FontWeight.semiBold, lineHeight: FontSize.xl * 1.35 },
  body1: { fontSize: FontSize.base, fontWeight: FontWeight.regular, lineHeight: FontSize.base * 1.5 },
  body2: { fontSize: FontSize.sm, fontWeight: FontWeight.regular, lineHeight: FontSize.sm * 1.5 },
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular, lineHeight: FontSize.xs * 1.4 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, lineHeight: FontSize.sm * 1.4 },
  overline: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: FontSize.xs * 1.6,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  align,
  style,
  children,
  ...rest
}) => {
  return (
    <RNText
      style={[
        styles.base,
        variantStyles[variant],
        color ? { color } : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    color: Colors.textPrimary,
  },
});
