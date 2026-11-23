/**
 * Volunteer Dashboard / Home Screen — Aanandvan
 *
 * Implements the new visual spec matching the design system:
 * - Header: Avatar, Namaste, Vaibhav Shirke, RoleSwitcher pill, Bell icon
 * - Pending actions: 3 soft pastel cards (Available to plant, Active assigned, Nurturing due)
 * - Quick actions: Circular lime buttons (Available Requests, Active Requests, Log Care, Schedule)
 * - Field overview: 2x2 grid with diagonal arrow indicator
 * - Priority Nurturing Tasks with "View Care Thread" button & mock timeline
 * - Active Requests in Dadar feed
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { DashboardPalette } from '@/constants/colors';

export default function VolunteerHomeScreen() {
  const { currentUser, requests, maintenanceItems } = useApp();

  const volunteerName = currentUser.name || 'Vaibhav Shirke';
  const isBlocked = !!currentUser.isBlocked;

  const assignedRequests = requests.filter(
    (r) =>
      (r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress') &&
      (!r.assignedVolunteerName ||
        r.assignedVolunteerName.includes('Vaibhav') ||
        r.assignedVolunteerName.includes('Shirke'))
  );

  const availableRequests = requests.filter((r) => r.status === 'verified');
  const nurturingDueCount = maintenanceItems.length || 2;
  const completedRequestsCount = requests.filter((r) => r.status === 'completed').length || 12;

  const quickActions: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'available',
      label: 'Available Req',
      icon: 'plant',
      onPress: () => router.push('/(volunteer)/available' as any),
    },
    {
      id: 'assigned',
      label: 'My Work',
      icon: 'work',
      onPress: () => router.push('/pages/my-assigned-work' as any),
    },
    {
      id: 'log',
      label: 'Log Care',
      icon: 'water',
      onPress: () =>
        router.push({
          pathname: '/pages/log-nurturing',
          params: { id: 'REQ-2024-0042' },
        } as any),
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
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.userTextCol}>
              <Text style={styles.greetingText}>Namaste,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {volunteerName}
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

        {/* ─── Volunteer Account Suspended Banner (if blocked) ─── */}
        {isBlocked && (
          <View style={styles.blockedBanner}>
            <Icon name="alert-triangle" size={18} color="#991B1B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.blockedTitle}>Volunteer Account Suspended</Text>
              <Text style={styles.blockedDesc}>
                Reason: {currentUser.blockReason || 'Under administrative review'}. Contact administration to reactivate your profile.
              </Text>
            </View>
          </View>
        )}

        {/* ─── Section 1: Pending Actions (3 Pastel Cards - Personal Actionable Workload) ─── */}
        <Text style={styles.sectionHeading}>Pending actions</Text>
        <View style={styles.pendingRow}>
          {/* Card 1: Assigned to Me (Pastel Blue) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardBlue, borderColor: DashboardPalette.cardBlueBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() => router.push('/pages/my-assigned-work' as any)}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{assignedRequests.length || 2}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Assigned to{'\n'}me</Text>
          </TouchableOpacity>

          {/* Card 2: Hydration Due Today (Pastel Sage Green) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardSage, borderColor: DashboardPalette.cardSageBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/pages/log-nurturing',
                params: { id: 'REQ-2024-0042' },
              } as any)
            }
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{nurturingDueCount}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Hydration{'\n'}due today</Text>
          </TouchableOpacity>

          {/* Card 3: Sapling Survival Rate (Pastel Yellow / Lime) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: DashboardPalette.cardLime, borderColor: DashboardPalette.cardLimeBorder, borderWidth: 1 }]}
            activeOpacity={0.85}
            onPress={() => router.push('/pages/my-assigned-work' as any)}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>98%</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Sapling{'\n'}survival</Text>
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

        {/* ─── Section 3: Field Overview (2x2 Grid - Dadar Community Zone Impact) ─── */}
        <Text style={styles.sectionHeading}>Field overview</Text>
        <View style={styles.overviewGrid}>
          {/* Row 1 */}
          <View style={styles.overviewRow}>
            {/* Open Requests in Dadar (Pastel Blue) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewBlue, borderColor: DashboardPalette.overviewBlueBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>{availableRequests.length || 5}</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Open in Dadar</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>Awaiting squad</Text>
            </TouchableOpacity>

            {/* Trees Grounded (Pastel Sage Green) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewSage, borderColor: DashboardPalette.overviewSageBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/pages/my-assigned-work' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>{completedRequestsCount}</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Trees Grounded</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>+8 this month</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.overviewRow}>
            {/* Active Squad (Pastel Sage Green) */}
            <View style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewSage, borderColor: DashboardPalette.overviewSageBorder, borderWidth: 1 }]}>
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>47</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Active Squad</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>Dadar volunteers</Text>
            </View>

            {/* Canopy Cover Growth (Pastel Yellow / Lime) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: DashboardPalette.overviewLime, borderColor: DashboardPalette.overviewLimeBorder, borderWidth: 1 }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>+24%</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Canopy Cover</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280', fontWeight: '700' }]}>
                Dadar West zone
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Section 4: Priority Nurturing Task with View Thread CTA ─── */}
        <Text style={styles.sectionHeading}>Priority Nurturing Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeaderRow}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>WATERING &amp; CARE DUE</Text>
            </View>
            <Text style={styles.alertTimeText}>Today</Text>
          </View>

          <Text style={styles.alertTitle}>Shivaji Park Perimeter Greening</Text>
          <Text style={styles.alertLocation}>📍 Gate 3, Shivaji Park Outer Ring, Dadar West</Text>
          <Text style={styles.alertDesc}>
            Alternate-day watering cycle due: 15L root hydration per sapling. Inspect bamboo protective cages.
          </Text>

          <View style={styles.taskActionsRow}>
            <TouchableOpacity
              style={styles.logNurturingBtn}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/pages/log-nurturing',
                  params: { id: 'REQ-2024-0042' },
                } as any)
              }
            >
              <Icon name="camera" size={15} color="#FFFFFF" />
              <Text style={styles.logNurturingText}>Log Nurturing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewThreadBtn}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/pages/request-details',
                  params: { id: 'REQ-2024-0042' },
                } as any)
              }
            >
              <Icon name="document" size={14} color="#163E2B" />
              <Text style={styles.viewThreadText}>View Care Thread 💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Section 5: Active Requests in Dadar ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeadingNoMargin}>Active Requests in Dadar</Text>
          <TouchableOpacity onPress={() => router.push('/pages/my-assigned-work' as any)}>
            <Text style={styles.viewAllText}>View all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsStack}>
          {assignedRequests.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.activeDriveCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/pages/request-details',
                  params: { id: item.id },
                } as any)
              }
            >
              <Image
                source={{
                  uri:
                    item.areaPhotos[0] ||
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80',
                }}
                style={styles.activeDriveThumb}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.activeDriveTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.activeDriveLocation} numberOfLines={1}>
                  📍 {item.manualAddress || item.location}
                </Text>
                <View style={styles.activeDriveBadge}>
                  <Text style={styles.activeDriveBadgeText}>
                    {item.status === 'scheduled'
                      ? 'Scheduled'
                      : item.status === 'in_progress'
                      ? 'In Progress'
                      : 'Assigned'}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
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
  blockedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  blockedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  blockedDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeadingNoMargin: {
    fontSize: 16,
    fontWeight: '700',
    color: '#163E2B',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#163E2B',
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
  /* Field Overview 2x2 Grid */
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
  /* Priority Nurturing Alert Card */
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  alertTimeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  alertLocation: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 6,
  },
  alertDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 14,
  },
  taskActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  logNurturingBtn: {
    flex: 1.2,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#163E2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logNurturingText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewThreadBtn: {
    flex: 1.4,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewThreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#163E2B',
  },
  /* Active Requests Stack */
  cardsStack: {
    gap: 10,
    marginBottom: 20,
  },
  activeDriveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  activeDriveThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  activeDriveTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  activeDriveLocation: {
    fontSize: 11.5,
    color: '#6B7280',
    marginBottom: 4,
  },
  activeDriveBadge: {
    backgroundColor: '#E8EFEA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activeDriveBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#163E2B',
  },
});
