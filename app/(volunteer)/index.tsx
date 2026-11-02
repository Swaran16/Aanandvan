/**
 * Volunteer Home / Dashboard — Aanandvan
 *
 * Matches Figma: dark green header with welcome message,
 * "Verified Volunteer" badge, 4 stat cards (Assigned, Available,
 * Completed, Maintenance Due), Quick Actions grid, Priority Alerts,
 * and Assigned Requests carousel.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

// ─── Dummy data ──────────────────────────────────────────────────────────────

const stats = [
  { label: 'Assigned', value: '3', bg: Colors.brandPrimary },
  { label: 'Available', value: '7', bg: Colors.brandPrimary },
  { label: 'Completed', value: '23', bg: Colors.brandAccent },
  { label: 'Maintenance Due', value: '2', bg: '#C0392B' },
];

const quickActions = [
  { icon: '🔍', label: 'Available Requests', route: '/available-requests' as const },
  { icon: '✅', label: 'My Assigned Work', route: '/assignment-details' as const },
  { icon: '🌿', label: 'Partnered Nurseries', route: null },
  { icon: '📤', label: 'Upload Update', route: '/upload-update' as const },
];

const priorityAlert = {
  type: 'Maintenance Due',
  time: 'In 2 days',
  title: 'Central Park Saplings (Zone 4)',
  description:
    'Watering and mulching required for 12 oak saplings after the recent dry spell.',
};

const assignedRequests = [
  { id: 'TR-992', type: 'Watering', location: 'Riverside Willow Maintenance', area: 'North Bank, Station 4' },
  { id: 'TR-887', type: 'Planting', location: 'Community Orchard Expansion', area: 'Greenway Heights' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function VolunteerHomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ─── Dark Green Header ─── */}
      <View style={styles.headerBg}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          {/* Top row: brand + icons */}
          <View style={styles.topRow}>
            <View style={styles.brandRow}>
              <Text style={styles.brandIcon}>🌿</Text>
              <Text style={styles.brandName}>Aanandvan</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.bellBtn}>
                <Text style={styles.bellIcon}>🔔</Text>
              </TouchableOpacity>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>A</Text>
              </View>
            </View>
          </View>

          {/* Welcome row */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back, Amit Kumar</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedDot}>●</Text>
              <Text style={styles.verifiedText}>Verified Volunteer</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <View
                key={s.label}
                style={[
                  styles.statCard,
                  i < 2 ? styles.statCardTop : styles.statCardBottom,
                  i === 3 ? { borderColor: '#E74C3C', borderWidth: 1 } : {},
                ]}
              >
                <Text
                  style={[
                    styles.statValue,
                    { color: i === 3 ? '#E74C3C' : Colors.brandPrimary },
                  ]}
                >
                  {s.value}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </View>

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => a.route && router.push(a.route)}
            >
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionEmoji}>{a.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Priority Alerts */}
        <Text style={styles.sectionTitle}>Priority Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeIcon}>⚠</Text>
              <Text style={styles.alertBadgeText}>{priorityAlert.type}</Text>
            </View>
            <Text style={styles.alertTime}>{priorityAlert.time}</Text>
          </View>
          <Text style={styles.alertTitle}>{priorityAlert.title}</Text>
          <Text style={styles.alertDesc}>{priorityAlert.description}</Text>
          <TouchableOpacity style={styles.alertBtn} activeOpacity={0.85}>
            <Text style={styles.alertBtnText}>Take Action</Text>
          </TouchableOpacity>
        </View>

        {/* Assigned Requests */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Assigned Requests</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.requestsScroll}>
          {assignedRequests.map((r) => (
            <View key={r.id} style={styles.requestCard}>
              {/* Placeholder image area */}
              <View style={styles.requestImagePlaceholder}>
                <Text style={styles.requestImageEmoji}>🌳</Text>
              </View>
              <View style={styles.requestInfo}>
                <View style={styles.requestBadgeRow}>
                  <View style={[styles.requestTypeBadge, r.type === 'Watering' ? styles.wateringBadge : styles.plantingBadge]}>
                    <Text style={styles.requestTypeText}>{r.type}</Text>
                  </View>
                  <Text style={styles.requestId}>ID: #{r.id}</Text>
                </View>
                <Text style={styles.requestLocation} numberOfLines={1}>{r.location}</Text>
                <View style={styles.requestAreaRow}>
                  <Text style={styles.requestAreaIcon}>📍</Text>
                  <Text style={styles.requestAreaText} numberOfLines={1}>{r.area}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Header
  headerBg: {
    backgroundColor: Colors.brandPrimary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: Spacing[5],
  },
  headerSafe: {
    paddingHorizontal: Spacing[5],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
    paddingTop: Spacing[2],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  brandIcon: { fontSize: 18 },
  brandName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  bellBtn: { padding: 4 },
  bellIcon: { fontSize: 20 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Welcome
  welcomeSection: {
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  verifiedDot: {
    fontSize: 8,
    color: '#2ECC71',
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  statCard: {
    width: '47%' as any,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[4],
    alignItems: 'center',
    gap: Spacing[1],
    ...Shadow.sm,
  },
  statCardTop: {},
  statCardBottom: {},
  statValue: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },

  // Scroll content
  scrollWrap: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
  },

  // Section titles
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  viewAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandAccent,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  actionCard: {
    width: '47%' as any,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    gap: Spacing[3],
    ...Shadow.sm,
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: { fontSize: 18 },
  actionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  // Priority Alert
  alertCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[3],
    marginBottom: Spacing[6],
    ...Shadow.md,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  alertBadgeIcon: { fontSize: 12 },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
  },
  alertTime: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  alertTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  alertDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  alertBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: BorderRadius['3xl'],
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  alertBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },

  // Assigned Requests
  requestsScroll: {
    marginBottom: Spacing[4],
  },
  requestCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing[4],
    overflow: 'hidden',
    ...Shadow.sm,
  },
  requestImagePlaceholder: {
    height: 110,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestImageEmoji: { fontSize: 40, opacity: 0.5 },
  requestInfo: {
    padding: Spacing[3],
    gap: Spacing[2],
  },
  requestBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  requestTypeBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  wateringBadge: { backgroundColor: '#DBEAFE' },
  plantingBadge: { backgroundColor: Colors.brandMint },
  requestTypeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  requestId: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  requestLocation: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  requestAreaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requestAreaIcon: { fontSize: 11, opacity: 0.6 },
  requestAreaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
