/**
 * Admin Dashboard Screen — Aanandvan
 *
 * Streamlined per administrative requirements:
 * - 3 Consolidated Master KPIs: Total Plantation Requests, Total Volunteers, Trees Planted
 * - Volunteer Verification Required action card for pending volunteer registrations
 * - Quick Actions: Reports, Events, Ward & Zone Settings (no nurseries)
 * - Monthly Plantation & Nurturing Growth Chart with pixel-perfect alignment
 * - Header notification bell routes to Notifications
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

const CHART_BARS = [
  { month: 'AUG', completed: 54, inProgress: 22 },
  { month: 'SEP', completed: 68, inProgress: 30 },
  { month: 'OCT', completed: 85, inProgress: 25 },
  { month: 'NOV', completed: 110, inProgress: 38 },
];

export default function AdminDashboardScreen() {
  const { currentUser, requests, volunteers, approveVolunteer } = useApp();

  const totalVolunteersCount = volunteers.length || 5;
  const totalRequestsCount = requests.length || 12;
  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending');

  // Real calculation from planted activity updates + base
  const totalTreesPlanted = requests.reduce(
    (acc, r) => acc + (r.activityUpdate?.saplingsPlanted || (r.status === 'completed' ? 5 : 0)),
    1280
  );

  const quickActions: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'reports',
      label: 'Impact Reports',
      icon: 'document',
      onPress: () => router.push('/pages/admin-reports' as any),
    },
    {
      id: 'events',
      label: 'Community Drives',
      icon: 'calendar',
      onPress: () => router.push('/pages/admin-events' as any),
    },
    {
      id: 'settings',
      label: 'Dadar Zone Config',
      icon: 'settings',
      onPress: () => router.push('/pages/admin-settings' as any),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Greeting Header */}
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
              <Text style={styles.greetingText}>Aanandvan Administration</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser.name || 'Admin Console'}
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
              <Icon name="bell" size={18} color="#163E2B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── 3 Consolidated Master KPIs ─── */}
        <Text style={styles.sectionTitle}>Overview & Key Metrics</Text>
        <View style={styles.kpisContainer}>
          {/* 1. Plantation Requests */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.88}
            onPress={() => router.push('/(admin)/requests' as any)}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiNumber}>{totalRequestsCount}</Text>
              <View style={[styles.kpiBadge, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.kpiBadgeText, { color: '#0369A1' }]}>View All →</Text>
              </View>
            </View>
            <Text style={styles.kpiTitle}>Plantation Requests</Text>
            <Text style={styles.kpiSub}>
              {requests.filter((r) => r.status === 'pending').length} pending review •{' '}
              {requests.filter((r) => r.status === 'verified').length} open
            </Text>
          </TouchableOpacity>

          <View style={styles.kpiDoubleRow}>
            {/* 2. Total Volunteers */}
            <TouchableOpacity
              style={[styles.kpiHalfCard, { backgroundColor: '#FFFFFF' }]}
              activeOpacity={0.88}
              onPress={() => router.push('/(admin)/volunteers' as any)}
            >
              <View style={styles.kpiHalfTopRow}>
                <Text style={styles.kpiNumber}>{totalVolunteersCount}</Text>
                {pendingVolunteers.length > 0 && (
                  <View style={styles.kpiPendingBadge}>
                    <Text style={styles.kpiPendingBadgeText}>
                      {pendingVolunteers.length} Pending
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.kpiHalfTitle}>Total Volunteers</Text>
              <Text style={styles.kpiHalfSub}>
                {volunteers.filter((v) => !v.isBlocked && v.status === 'verified').length} active in Mumbai
              </Text>
            </TouchableOpacity>

            {/* 3. Trees Planted */}
            <View style={[styles.kpiHalfCard, { backgroundColor: '#FFFFFF' }]}>
              <View style={styles.kpiHalfTopRow}>
                <Text style={styles.kpiNumber}>
                  {totalTreesPlanted.toLocaleString()}
                </Text>
                <View style={styles.kpiActiveBadge}>
                  <Text style={styles.kpiActiveBadgeText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.kpiHalfTitle}>Trees Planted</Text>
              <Text style={styles.kpiHalfSub}>From field logs</Text>
            </View>
          </View>
        </View>

        {/* ─── Volunteer Verification Required Section (Surfaced Feature) ─── */}
        {pendingVolunteers.length > 0 && (
          <View style={styles.verificationSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Volunteer Verifications</Text>
                <View style={styles.verificationCountBadge}>
                  <Text style={styles.verificationCountText}>
                    {pendingVolunteers.length} Pending
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(admin)/volunteers' as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>

            {pendingVolunteers.map((vol) => (
              <View key={vol.id} style={styles.verificationCard}>
                <View style={styles.verificationTopRow}>
                  <Image
                    source={{
                      uri:
                        vol.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    }}
                    style={styles.verificationAvatar}
                  />
                  <View style={styles.verificationInfo}>
                    <View style={styles.verificationNameRow}>
                      <Text style={styles.verificationName} numberOfLines={1}>
                        {vol.name}
                      </Text>
                      <View style={styles.volCodeBadge}>
                        <Text style={styles.volCodeText}>
                          {vol.volunteerCode || `VOL-DAD-${vol.id.slice(-4).toUpperCase()}`}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.verificationMeta} numberOfLines={1}>
                      Applied {vol.appliedDate} • {vol.city || 'Dadar West, Mumbai'}
                    </Text>
                  </View>
                </View>

                {vol.bio && (
                  <Text style={styles.verificationBio} numberOfLines={2}>
                    &ldquo;{vol.bio}&rdquo;
                  </Text>
                )}

                <View style={styles.verificationActionsRow}>
                  <TouchableOpacity
                    style={styles.reviewVerifyBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/pages/volunteer-details',
                        params: { id: vol.id },
                      } as any)
                    }
                    activeOpacity={0.85}
                  >
                    <Icon name="profile" size={14} color="#163E2B" />
                    <Text style={styles.reviewVerifyBtnText}>Review Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickApproveBtn}
                    onPress={() => approveVolunteer(vol.id)}
                    activeOpacity={0.88}
                  >
                    <Icon name="check" size={14} color="#FFFFFF" />
                    <Text style={styles.quickApproveBtnText}>Verify & Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── Administrative Quick Actions ─── */}
        <Text style={styles.sectionTitle}>Administrative Actions</Text>
        <View style={styles.quickRow}>
          {quickActions.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={styles.quickItem}
              onPress={act.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.quickCircle}>
                <Icon name={act.icon} size={20} color="#163E2B" />
              </View>
              <Text style={styles.quickLabel}>{act.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Plantation & Nurturing Growth Chart ─── */}
        <Text style={styles.sectionTitle}>Plantation & Care Growth</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Dadar & Mumbai Canopy Trajectory</Text>
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>2026</Text>
            </View>
          </View>

          <View style={styles.legendWrap}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#163E2B' }]} />
              <Text style={styles.legendText}>Completed Drives</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
              <Text style={styles.legendText}>Ongoing Nurturing</Text>
            </View>
          </View>

          {/* Cleanly aligned chart plot */}
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

              {/* Bars Graphic Area */}
              <View style={styles.barsArea}>
                {/* Horizontal reference grid lines */}
                <View style={[styles.gridLine, { top: 0 }]} />
                <View style={[styles.gridLine, { top: '25%' }]} />
                <View style={[styles.gridLine, { top: '50%' }]} />
                <View style={[styles.gridLine, { top: '75%' }]} />

                {/* Bars */}
                <View style={styles.barsFlexRow}>
                  {CHART_BARS.map((bar) => (
                    <View key={bar.month} style={styles.barPairCol}>
                      <View
                        style={[
                          styles.barCompleted,
                          { height: Math.round((bar.completed / 120) * 100) },
                        ]}
                      />
                      <View
                        style={[
                          styles.barInProgress,
                          { height: Math.round((bar.inProgress / 120) * 100) },
                        ]}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* X-Axis Labels Row (Strictly aligned under the bars area) */}
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
    fontSize: 16,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  kpisContainer: {
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  kpiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.4,
  },
  kpiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  kpiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  kpiDoubleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiHalfCard: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'space-between',
    minHeight: 105,
  },
  kpiHalfTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  kpiPendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  kpiPendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  kpiActiveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  kpiActiveBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  kpiHalfTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  kpiHalfSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  /* Volunteer Verification Section */
  verificationSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verificationCountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  verificationCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#163E2B',
    marginBottom: 12,
  },
  verificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 10,
  },
  verificationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  verificationInfo: {
    flex: 1,
  },
  verificationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  volCodeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  volCodeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  verificationMeta: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  verificationBio: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  verificationActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  reviewVerifyBtn: {
    flex: 1,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  reviewVerifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#163E2B',
  },
  quickApproveBtn: {
    flex: 1.2,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#163E2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickApproveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  /* Quick Actions */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickCircle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },
  /* Chart */
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
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
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111827',
  },
  yearBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yearBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#163E2B',
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
    height: 110,
  },
  yAxisCol: {
    width: 28,
    height: 100,
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
    height: 100,
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
    backgroundColor: '#163E2B',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barInProgress: {
    width: 12,
    backgroundColor: '#D97706',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
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
