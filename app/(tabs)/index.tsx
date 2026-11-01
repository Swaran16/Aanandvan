/**
 * Home Screen — Aanandvan
 * Main landing screen after onboarding is complete.
 * Replace placeholder sections with your actual Figma design.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout';
import { Text } from '@/components/common';
import { Colors, Spacing, BorderRadius, Shadow } from '@/constants';

const statusBgMap = {
  Pending:   Colors.warningLight,
  Approved:  Colors.brandMint,
  Completed: Colors.infoLight,
} as const;

export default function HomeScreen() {
  return (
    <ScreenWrapper scrollable backgroundColor={Colors.background}>
      <View style={styles.container}>

        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 🌱</Text>
            <Text style={styles.title}>Aanandvan</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* ─── Hero Card ─── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TODAY'S MISSION</Text>
          <Text style={styles.heroTitle}>Plant a tree,{'\n'}heal the Earth 🌍</Text>
          <Text style={styles.heroSub}>
            Join a global community of eco-warriors.
          </Text>
          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85} onPress={() => router.push('/request')}>
            <Text style={styles.heroBtnText}>Report a Location</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Stats Row ─── */}
        <View style={styles.statsRow}>
          {[
            { label: 'Trees Planted', value: '12,840' },
            { label: 'Volunteers', value: '3,290' },
            { label: 'Cities', value: '48' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ─── Section: Nearby Spots ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Plantation Spots</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {[
          { place: 'Sector 12 Park', status: 'Pending', distance: '0.8 km' },
          { place: 'MG Road Divider', status: 'Approved', distance: '1.4 km' },
          { place: 'Lake View Garden', status: 'Completed', distance: '2.1 km' },
        ].map((spot) => (
          <TouchableOpacity key={spot.place} style={styles.spotCard} activeOpacity={0.85}>
            <View style={styles.spotIconBg}>
              <Text style={styles.spotIcon}>🌳</Text>
            </View>
            <View style={styles.spotInfo}>
              <Text style={styles.spotName}>{spot.place}</Text>
              <Text style={styles.spotDistance}>{spot.distance} away</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBgMap[spot.status as keyof typeof statusBgMap] }]}>
              <Text style={styles.statusText}>{spot.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[8],
    gap: Spacing[5],
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },

  // Hero Card
  heroCard: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    gap: Spacing[2],
    ...Shadow.lg,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandCream,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 30,
    marginTop: Spacing[1],
  },
  heroSub: {
    fontSize: 13,
    color: Colors.brandCream,
    opacity: 0.85,
    lineHeight: 20,
  },
  heroBtn: {
    marginTop: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: BorderRadius['3xl'],
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[6],
  },
  heroBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    alignItems: 'center',
    gap: Spacing[1],
    ...Shadow.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.brandPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.brandAccent,
    fontWeight: '600',
  },

  // Spot cards
  spotCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    ...Shadow.sm,
  },
  spotIconBg: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotIcon: { fontSize: 24 },
  spotInfo: { flex: 1, gap: 2 },
  spotName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  spotDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Status badges
  statusBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPending: {
    backgroundColor: Colors.warningLight,
  },
  statusApproved: {
    backgroundColor: Colors.brandMint,
  },
  statusCompleted: {
    backgroundColor: Colors.infoLight,
  },
});
