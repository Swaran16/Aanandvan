/**
 * Admin Panel Overview / Dashboard (Tab 1)
 * Matches Batch 4 — Image 1:
 * - Admin Panel header + notification bell + AD initials
 * - Pending Actions: Volunteers (5 Pending) & Requests (8 Pending)
 * - Quick Navigation: Volunteers, Requests, Reports, Events, Settings (Nurseries removed)
 * - Platform Overview: 47 Volunteers (+12%), 124 Requests (+18), 312 Trees (+34), 08 Pending Verify (Alert)
 * - Plantation Activity growth chart & monthly telemetry
 * - Recent Activity list (Sector 14 completed, Verified REQ-0042, New Applicant Priya)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function AdminOverviewScreen() {
  const { requests, volunteers } = useApp();

  const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const totalRequests = requests.length + 116; // demo platform count
  const totalVolunteers = volunteers.length + 44;
  const treesPlanted = 312;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <View style={styles.treeCircle}>
            <Icon name="tree" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.panelTitle}>Admin Panel</Text>
            <Text style={styles.panelSub}>AANANDVAN</Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => alert('All admin actions up to date')}
          >
            <Icon name="bell" size={18} color="#111827" />
            <View style={styles.redDot} />
          </TouchableOpacity>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarText}>AD</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Pending Actions ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>PENDING ACTIONS</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>
              {pendingVolunteers + pendingRequests} TOTAL
            </Text>
          </View>
        </View>

        <View style={styles.pendingGrid}>
          {/* Volunteers Pending */}
          <TouchableOpacity
            style={styles.pendingCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(admin)/volunteers' as any)}
          >
            <View style={[styles.pendingIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="users" size={18} color="#D97706" />
            </View>
            <Text style={styles.pendingCategory}>VOLUNTEERS</Text>
            <Text style={styles.pendingCount}>{pendingVolunteers} Pending</Text>
            <View style={[styles.underlineBar, { backgroundColor: '#F59E0B' }]} />
          </TouchableOpacity>

          {/* Requests Pending */}
          <TouchableOpacity
            style={styles.pendingCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(admin)/requests' as any)}
          >
            <View style={[styles.pendingIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="document" size={18} color="#2563EB" />
            </View>
            <Text style={styles.pendingCategory}>REQUESTS</Text>
            <Text style={styles.pendingCount}>{pendingRequests} Pending</Text>
            <View style={[styles.underlineBar, { backgroundColor: '#2563EB' }]} />
          </TouchableOpacity>
        </View>

        {/* ─── Quick Navigation ─── */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
          QUICK NAVIGATION
        </Text>
        <View style={styles.navGrid}>
          {/* Volunteers */}
          <TouchableOpacity
            style={styles.navPillBtn}
            onPress={() => router.push('/(admin)/volunteers' as any)}
          >
            <Icon name="volunteers" size={16} color="#0B3B24" />
            <Text style={styles.navPillText}>VOLUNTEERS</Text>
          </TouchableOpacity>

          {/* Requests */}
          <TouchableOpacity
            style={styles.navPillBtn}
            onPress={() => router.push('/(admin)/requests' as any)}
          >
            <Icon name="requests" size={16} color="#0B3B24" />
            <Text style={styles.navPillText}>REQUESTS</Text>
          </TouchableOpacity>

          {/* Reports */}
          <TouchableOpacity
            style={styles.navPillBtn}
            onPress={() => router.push('/pages/admin-reports' as any)}
          >
            <Icon name="overview" size={16} color="#0B3B24" />
            <Text style={styles.navPillText}>REPORTS</Text>
          </TouchableOpacity>

          {/* Events */}
          <TouchableOpacity
            style={styles.navPillBtn}
            onPress={() => router.push('/pages/admin-events' as any)}
          >
            <Icon name="calendar" size={16} color="#0B3B24" />
            <Text style={styles.navPillText}>EVENTS</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={[styles.navPillBtn, { width: '100%' }]}
            onPress={() => router.push('/pages/admin-settings' as any)}
          >
            <Icon name="settings" size={16} color="#0B3B24" />
            <Text style={styles.navPillText}>PLATFORM SETTINGS</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Platform Overview ─── */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
          PLATFORM OVERVIEW
        </Text>
        <View style={styles.overviewGrid}>
          {/* Volunteers */}
          <View style={styles.overviewBox}>
            <View style={styles.overviewTop}>
              <Icon name="users" size={18} color="#0B3B24" />
              <Text style={styles.growthBadgeGreen}>+12%</Text>
            </View>
            <Text style={styles.overviewNumber}>{totalVolunteers}</Text>
            <Text style={styles.overviewLabel}>Volunteers</Text>
          </View>

          {/* Total Requests */}
          <View style={styles.overviewBox}>
            <View style={styles.overviewTop}>
              <Icon name="document" size={18} color="#0B3B24" />
              <Text style={styles.growthBadgeGreen}>+18</Text>
            </View>
            <Text style={styles.overviewNumber}>{totalRequests}</Text>
            <Text style={styles.overviewLabel}>Total Requests</Text>
          </View>

          {/* Trees Planted */}
          <View style={styles.overviewBox}>
            <View style={styles.overviewTop}>
              <Icon name="tree" size={18} color="#0B3B24" />
              <Text style={styles.growthBadgeGreen}>+34</Text>
            </View>
            <Text style={styles.overviewNumber}>{treesPlanted}</Text>
            <Text style={styles.overviewLabel}>Trees Planted</Text>
          </View>

          {/* Pending Verify */}
          <View style={[styles.overviewBox, { borderColor: '#FECACA' }]}>
            <View style={styles.overviewTop}>
              <Icon name="alert" size={18} color="#DC2626" />
              <Text style={styles.alertBadgeRed}>Alert</Text>
            </View>
            <Text style={[styles.overviewNumber, { color: '#DC2626' }]}>
              {String(pendingRequests).padStart(2, '0')}
            </Text>
            <Text style={styles.overviewLabel}>Pending Verify</Text>
          </View>
        </View>

        {/* ─── Plantation Activity Chart ─── */}
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartTitle}>Plantation Activity</Text>
              <Text style={styles.chartSub}>Last 5 months growth</Text>
            </View>
            <View style={styles.yearPill}>
              <View style={styles.yearDot} />
              <Text style={styles.yearText}>2024</Text>
            </View>
          </View>

          {/* Simulated Bar Chart */}
          <View style={styles.barsContainer}>
            <View style={styles.barColumn}>
              <View style={styles.barStack}>
                <View style={[styles.barPart, { height: 60, backgroundColor: '#0B3B24' }]} />
                <View style={[styles.barPart, { height: 30, backgroundColor: '#A7F3D0' }]} />
              </View>
              <Text style={styles.monthLabel}>OCT</Text>
            </View>

            <View style={styles.barColumn}>
              <View style={styles.barStack}>
                <View style={[styles.barPart, { height: 75, backgroundColor: '#0B3B24' }]} />
                <View style={[styles.barPart, { height: 40, backgroundColor: '#A7F3D0' }]} />
              </View>
              <Text style={styles.monthLabel}>NOV</Text>
            </View>

            <View style={styles.barColumn}>
              <View style={styles.barStack}>
                <View style={[styles.barPart, { height: 90, backgroundColor: '#0B3B24' }]} />
                <View style={[styles.barPart, { height: 35, backgroundColor: '#A7F3D0' }]} />
              </View>
              <Text style={styles.monthLabel}>DEC</Text>
            </View>

            <View style={styles.barColumn}>
              <View style={styles.barStack}>
                <View style={[styles.barPart, { height: 110, backgroundColor: '#0B3B24' }]} />
                <View style={[styles.barPart, { height: 50, backgroundColor: '#A7F3D0' }]} />
              </View>
              <Text style={[styles.monthLabel, { fontWeight: '800', color: '#0B3B24' }]}>
                JAN
              </Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0B3B24' }]} />
              <Text style={styles.legendText}>COMPLETED</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#A7F3D0' }]} />
              <Text style={styles.legendText}>IN PROGRESS</Text>
            </View>
          </View>
        </View>

        {/* ─── Recent Activity ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <TouchableOpacity onPress={() => router.push('/(admin)/requests' as any)}>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {/* Item 1 */}
          <View style={[styles.activityCard, { borderLeftColor: '#10B981' }]}>
            <View style={[styles.activityIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="check" size={16} color="#059669" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Sector 14, Gurugram</Text>
              <Text style={styles.activitySubtitle}>Plantation completed • 2h ago</Text>
              <View style={styles.actorRow}>
                <Icon name="profile" size={12} color="#6B7280" />
                <Text style={styles.actorName}>AMIT KUMAR</Text>
              </View>
            </View>
          </View>

          {/* Item 2 */}
          <View style={[styles.activityCard, { borderLeftColor: '#2563EB' }]}>
            <View style={[styles.activityIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="check-circle" size={16} color="#2563EB" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Verified REQ-0042</Text>
              <Text style={styles.activitySubtitle}>Plantation request approved • 5h ago</Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={[styles.activityCard, { borderLeftColor: '#F59E0B' }]}>
            <View style={[styles.activityIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="users" size={16} color="#D97706" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Applicant: Priya</Text>
              <Text style={styles.activitySubtitle}>Review required • 12h ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  treeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  panelSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B3B24',
    letterSpacing: 1,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    position: 'relative',
    padding: 6,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DC2626',
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: 0.8,
  },
  totalBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  totalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  pendingGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  pendingCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pendingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  pendingCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  pendingCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
    marginBottom: 10,
  },
  underlineBar: {
    height: 3,
    borderRadius: 1.5,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navPillBtn: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B3B24',
    letterSpacing: 0.5,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  overviewBox: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthBadgeGreen: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  alertBadgeRed: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  overviewNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  chartSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  yearDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0B3B24',
  },
  yearText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  barColumn: {
    alignItems: 'center',
    gap: 8,
  },
  barStack: {
    width: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  barPart: {
    width: '100%',
  },
  monthLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
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
    fontWeight: '700',
    color: '#4B5563',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B3B24',
  },
  activityList: {
    gap: 10,
    marginTop: 4,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 12,
  },
  activityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  actorName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B3B24',
  },
});

