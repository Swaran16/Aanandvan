/**
 * ScreenWrapper Component
 * A safe-area-aware screen container used as the root wrapper for all screens.
 *
 * Usage:
 *   <ScreenWrapper>
 *     <YourContent />
 *   </ScreenWrapper>
 *
 *   <ScreenWrapper scrollable padding={false}>
 *     <YourContent />
 *   </ScreenWrapper>
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView */
  scrollable?: boolean;
  /** Apply default horizontal padding */
  padding?: boolean;
  /** Background color of the screen */
  backgroundColor?: string;
  /** Optional additional styles for the inner container */
  contentStyle?: ViewStyle;
  /** Avoid keyboard on text inputs */
  keyboardAvoiding?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  padding = true,
  backgroundColor = Colors.background,
  contentStyle,
  keyboardAvoiding = false,
}) => {
  const innerStyle: ViewStyle[] = [
    styles.inner,
    ...(padding ? [styles.padding] : []),
    ...(contentStyle ? [contentStyle] : []),
  ];

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={innerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={innerStyle}>{children}</View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      {wrapped}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: Spacing[5],
  },
});
