/**
 * Events Screen — Volunteer Tab (Aanandvan)
 * Placeholder for volunteer events and plantation drives.
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, Shadow } from '@/constants';

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>📅</Text>
          </View>
          <Text style={styles.emptyTitle}>Upcoming Events</Text>
          <Text style={styles.emptyDesc}>
            Plantation drives, community meetups, and environmental workshops will appear here. Stay tuned!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },
  header: {
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    gap: Spacing[4],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  emoji: { fontSize: 36 },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing[6],
  },
});
