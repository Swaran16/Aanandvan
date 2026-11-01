/**
 * Button Component
 * A fully typed, styled button with multiple variants and sizes.
 *
 * Usage:
 *   <Button title="Continue" onPress={handlePress} />
 *   <Button title="Delete" variant="danger" size="sm" />
 *   <Button title="Loading..." loading />
 */

import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, FontWeight } from '@/constants';
import { ButtonVariant, ButtonSize } from '@/types';
import { Text } from './Text';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ─── Variant Config ───────────────────────────────────────────────────────────

const variantConfig: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary:   { bg: Colors.brandPrimary, text: Colors.white },
  secondary: { bg: Colors.brandAccent,  text: Colors.white },
  outline:   { bg: Colors.transparent,  text: Colors.brandPrimary, border: Colors.brandPrimary },
  ghost:     { bg: Colors.transparent,  text: Colors.brandPrimary },
  danger:    { bg: Colors.error,        text: Colors.white },
};

const sizeConfig: Record<ButtonSize, { height: number; px: number; fontSize: number }> = {
  sm: { height: 36, px: Spacing[4], fontSize: FontSize.sm },
  md: { height: 48, px: Spacing[6], fontSize: FontSize.base },
  lg: { height: 56, px: Spacing[8], fontSize: FontSize.lg },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const vc = variantConfig[variant];
  const sc = sizeConfig[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          height: sc.height,
          paddingHorizontal: sc.px,
          backgroundColor: vc.bg,
          borderColor: vc.border ?? Colors.transparent,
          borderWidth: vc.border ? 1.5 : 0,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={vc.text} size="small" />
      ) : (
        <Text
          style={[{ color: vc.text, fontSize: sc.fontSize, fontWeight: FontWeight.semiBold }, ...(textStyle ? [textStyle] : [])]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    gap: Spacing[2],
  },
});
