/**
 * Explore Screen
 * Replace this placeholder with your Figma design.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/layout';
import { Text } from '@/components/common';
import { Colors, Spacing } from '@/constants';

export default function ExploreScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="h2">Explore</Text>
        <Text variant="body1" color={Colors.textSecondary}>
          Your explore screen content goes here.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing[3],
    paddingTop: Spacing[6],
  },
});
