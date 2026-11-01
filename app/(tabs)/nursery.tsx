/**
 * Nursery Screen — Aanandvan
 *
 * Placeholder screen for future nursery functionalities.
 * Currently displays a friendly message and a background illustration.
 */

import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadow, FontSize, FontWeight } from '@/constants';
import { Text as StyledText } from '@/components/common';

export default function NurseryScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Nursery (Coming Soon)</Text>
        <Text style={styles.sub}>We are nurturing new green spaces. Stay tuned!</Text>
        {/* Optional illustration */}
        <Image source={require('../../assets/images/nursery1.png')} style={styles.image} resizeMode="contain" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[5],
    gap: Spacing[4],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sub: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  image: { width: '80%', height: 200 },
});
