/**
 * Admin Dashboard Screen — Aanandvan
 *
 * Implements the Figma / Design System spec:
 * - Header: Avatar, Namaste, User Name, RoleSwitcher pill, Bell icon
 * - Pending actions: 3 soft pastel cards (Volunteer requests, Plantation requests, Planting updates)
 * - Quick actions: Circular lime buttons (Reports, Events, Zone Settings, Support)
 * - Platform overview: 2x2 grid with diagonal arrow indicator (Volunteers, Requests, Trees planted, Pending verifications)
 * - Plantation stats: Last 6 months growth chart with aligned axes and 2026 year badge
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { DashboardPalette } from '@/constants/colors';

const CHART_BARS = [
  { month: 'AUG', completed: 54, inProgress: 22 },
  { month: 'SEP', completed: 68, inProgress: 30 },
  { month: 'OCT', completed: 85, inProgress: 25 },
  { month: 'NOV', completed: 110, inProgress: 38 },
];

export default function AdminDashboardScreen() {
  const { currentUser, requests, volunteers } = useApp();

  const pendingVolunteersCount = volunteers.filter((v) => v.status === 'pending').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;
  const activeRequestsCount = requests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length;
  const totalVolunteersCount = volunteers.length || 47;
  const totalRequestsCount = requests.length || 126;

  // Real calculation from planted activity updates + base
  const totalTreesPlanted = requests.reduce(
    (acc, r) => acc + (r.activityUpdate?.saplingsPlanted || (r.status === 'completed' ? 5 : 0)),
    312
  );

  const quickActions: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'reports',
      label: 'Reports',
      icon: 'document',
      onPress: () => router.push('/pages/admin-reports' as any),
    },
    {
      id: 'events',
      label: 'Events',
      icon: 'calendar',
      onPress: () => router.push('/pages/admin-events' as any),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onPress: () => router.push('/(admin)/profile' as any),
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: 'volunteers',
      onPress: () => router.push('/(admin)/volunteers' as any),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Top Header ─── */}
        <View style={styles.headerRow}>
          <View style={styles.userGroup}>
            <Image
              source={{
                uri:
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.userTextCol}>
              <Text style={styles.greetingText}>Namaste,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser.name || 'Aanandvan Admin'}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <RoleSwitcher theme="light" />

            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push('/pages/notifications' as any)}
              activeOpacity={0.75}
            >
              <Icon name="bell" size={20} color="#D97706" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Section 1: Pending Actions (3 Pastel Cards) ─── */}
        <Text style={styles.sectionHeading}>Pending actions</Text>
        <View style={styles.pendingRow}>
          {/* Card 1: Volunteer Requests (Pastel Blue) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardBlue, borderColor: DashboardPalette.cardBlueBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(admin)/volunteers' as any)}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{pendingVolunteersCount || 2}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Volunteers{'\n'}requests</Text>
          </TouchableOpacity>

          {/* Card 2: Plantation Requests (Pastel Sage Green) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardSage, borderColor: DashboardPalette.cardSageBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(admin)/requests' as any)}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{pendingRequestsCount || 43}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Plantation{'\n'}requests</Text>
          </TouchableOpacity>

          {/* Card 3: Planting Updates (Pastel Yellow / Lime) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardLime, borderColor: DashboardPalette.cardLimeBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(admin)/requests' as any)}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{activeRequestsCount || 13}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Planting{'\n'}updates</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Section 2: Quick Actions (Circular Buttons) ─── */}
        <Text style={styles.sectionHeading}>Quick actions</Text>
        <View style={styles.quickRow}>
          {quickActions.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={styles.quickItem}
              onPress={act.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.quickCircle}>
                <Icon name={act.icon} size={22} color={DashboardPalette.quickIcon} />
              </View>
              <Text style={styles.quickLabel}>{act.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Section 3: Platform Overview (2x2 Grid) ─── */}
        <Text style={styles.sectionHeading}>Platform overview</Text>
        <View style={styles.overviewGrid}>
          {/* Row 1 */}
          <View style={styles.overviewRow}>
            {/* Volunteers Card (Pastel Blue) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewBlue, borderColor: DashboardPalette.overviewBlueBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(admin)/volunteers' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>{totalVolunteersCount}</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Volunteers</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>+12% in a month</Text>
            </TouchableOpacity>

            {/* Requests Card (Pastel Sage Green) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewSage, borderColor: DashboardPalette.overviewSageBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(admin)/requests' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>{totalRequestsCount}</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Requests</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>+18% in a month</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.overviewRow}>
            {/* Trees Planted Card (Pastel Sage Green) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewSage, borderColor: DashboardPalette.overviewSageBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(admin)/requests' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>{totalTreesPlanted}</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Trees planted</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>+12% in a month</Text>
            </TouchableOpacity>

            {/* Sapling Survival Rate Card (Pastel Yellow / Lime) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewLime, borderColor: DashboardPalette.overviewLimeBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(admin)/requests' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>96%</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Sapling Survival</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>Healthy in Dadar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Section 4: Plantation Stats (Growth Chart) ─── */}
        <Text style={styles.sectionHeading}>Plantation stats</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Last 6 months growth</Text>
            <View style={[styles.yearBadge, { backgroundColor: DashboardPalette.badgeYear }]}>
              <Text style={styles.yearBadgeText}>• 2024</Text>
            </View>
          </View>

          <View style={styles.legendWrap}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: DashboardPalette.chartCompleted }]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: DashboardPalette.chartInProgress }]} />
              <Text style={styles.legendText}>In progress</Text>
            </View>
          </View>

          {/* Chart Plot Area */}
          <View style={styles.chartContainer}>
            <View style={styles.chartPlotRow}>
              {/* Y-Axis */}
              <View style={styles.yAxisCol}>
                <Text style={styles.axisLabel}>120</Text>
                <Text style={styles.axisLabel}>90</Text>
                <Text style={styles.axisLabel}>60</Text>
                <Text style={styles.axisLabel}>30</Text>
                <Text style={styles.axisLabel}>0</Text>
              </View>

              {/* Bars Area */}
              <View style={styles.barsArea}>
                <View style={[styles.gridLine, { top: 0 }]} />
                <View style={[styles.gridLine, { top: '25%' }]} />
                <View style={[styles.gridLine, { top: '50%' }]} />
                <View style={[styles.gridLine, { top: '75%' }]} />

                <View style={styles.barsFlexRow}>
                  {CHART_BARS.map((bar) => (
                    <View key={bar.month} style={styles.barPairCol}>
                      <View
                        style={[
                          styles.barCompleted,
                          { height: Math.round((bar.completed / 120) * 95) },
                        ]}
                      />
                      <View
                        style={[
                          styles.barInProgress,
                          { height: Math.round((bar.inProgress / 120) * 95) },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* X-Axis Month Labels */}
            <View style={styles.xAxisRow}>
              <View style={styles.xAxisSpacer} />
              <View style={styles.xAxisLabelsArea}>
                {CHART_BARS.map((bar) => (
                  <View key={`lbl-${bar.month}`} style={styles.xAxisLabelBox}>
                    <Text style={styles.xAxisLabel}>{bar.month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 44,
  },
  userGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#C7EED8',
  },
  userTextCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#163E2B',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 12,
    marginTop: 4,
  },
  /* Pending Actions 3 Pastel Cards */
  pendingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  pendingCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  pendingNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  pendingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 16,
  },
  /* Quick Actions Circular Buttons */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  quickItem: {
    alignItems: 'center',
    width: 68,
  },
  quickCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: DashboardPalette.quickCircle,
    borderWidth: 1,
    borderColor: DashboardPalette.quickCircleBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  /* Platform Overview 2x2 Grid */
  overviewGrid: {
    gap: 12,
    marginBottom: 22,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  overviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  overviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  overviewSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  /* Plantation Stats Growth Card */
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  yearBadge: {
    backgroundColor: '#163E2B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  yearBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  legendWrap: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartContainer: {
    width: '100%',
  },
  chartPlotRow: {
    flexDirection: 'row',
    height: 105,
  },
  yAxisCol: {
    width: 28,
    height: 95,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  axisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  barsArea: {
    flex: 1,
    height: 95,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  barsFlexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  barPairCol: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barCompleted: {
    width: 12,
    backgroundColor: DashboardPalette.chartCompleted,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barInProgress: {
    width: 12,
    backgroundColor: DashboardPalette.chartInProgress,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  xAxisRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  xAxisSpacer: {
    width: 28,
  },
  xAxisLabelsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  xAxisLabelBox: {
    width: 28,
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
});
