/**
 * Volunteer Dashboard / Home Screen — Aanandvan
 *
 * Implements the approved visual spec:
 * - Header: Avatar, Namaste, Vaibhav Shirke, RoleSwitcher pill, Bell icon
 * - Section 1: "Track My Green Achievement" (3 distinct soft pastel cards: Assigned to me, Hydration due, Sapling survival — Non-clickable)
 * - Section 2: "Quick Steps" (4 circular buttons: Take New Step, Active Challenges, Update Log Care, My Contribution)
 * - Section 3: "Platform overview" (3 Platform KPIs matching citizen side: Active Volunteers, Total Trees Planted, Total Requests — Non-clickable)
 * - Removed: Priority Nurturing Alerts & Active Requests in Dadar (clean & lightweight)
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

  const nurturingDueCount = maintenanceItems.length || 2;

  const quickSteps: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'take-step',
      label: 'Take New\nStep',
      icon: 'plant',
      onPress: () => router.push('/(volunteer)/available' as any),
    },
    {
      id: 'challenges',
      label: 'Active\nChallenges',
      icon: 'sun',
      onPress: () => router.push('/pages/active-challenges' as any),
    },
    {
      id: 'update-log',
      label: 'Update\nLog Care',
      icon: 'water',
      onPress: () =>
        router.push({
          pathname: '/pages/log-nurturing',
          params: { id: assignedRequests[0]?.id || 'REQ-2024-0042' },
        } as any),
    },
    {
      id: 'contribution',
      label: 'My\nContribution',
      icon: 'bookmark',
      onPress: () => router.push('/pages/my-contribution' as any),
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

        {/* ─── Section 1: Track My Green Achievement (3 Pastel Non-Clickable Cards) ─── */}
        <Text style={styles.sectionHeading}>Track My Green Achievement</Text>
        <View style={styles.pendingRow}>
          {/* Card 1: Assigned to Me (Pastel Blue) */}
          <View
            style={[
              styles.pendingCard,
              {
                backgroundColor: DashboardPalette.cardBlue,
                borderColor: DashboardPalette.cardBlueBorder,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>
              {assignedRequests.length || 2}
            </Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Assigned to{'\n'}me</Text>
          </View>

          {/* Card 2: Hydration Due Today (Pastel Sage Green) */}
          <View
            style={[
              styles.pendingCard,
              {
                backgroundColor: DashboardPalette.cardSage,
                borderColor: DashboardPalette.cardSageBorder,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{nurturingDueCount}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Hydration{'\n'}due today</Text>
          </View>

          {/* Card 3: Sapling Survival Rate (Pastel Yellow / Lime) */}
          <View
            style={[
              styles.pendingCard,
              {
                backgroundColor: DashboardPalette.cardLime,
                borderColor: DashboardPalette.cardLimeBorder,
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>98%</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Sapling{'\n'}survival</Text>
          </View>
        </View>

        {/* ─── Section 2: Quick Steps (4 Circular Buttons) ─── */}
        <Text style={styles.sectionHeading}>Quick Steps</Text>
        <View style={styles.quickRow}>
          {quickSteps.map((act) => (
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

        {/* ─── Section 3: Platform Overview (3 Platform KPIs Matching Citizen Side) ─── */}
        <Text style={styles.sectionHeading}>Platform overview</Text>
        <View style={styles.overviewGrid}>
          {/* Row 1: Active Volunteers & Total Trees Planted */}
          <View style={styles.overviewRow}>
            {/* Active Volunteers Card (Pastel Blue) */}
            <View
              style={[
                styles.overviewCard,
                {
                  backgroundColor: DashboardPalette.overviewBlue,
                  borderColor: DashboardPalette.overviewBlueBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>140+</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Active Volunteers</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>+12% in Dadar</Text>
            </View>

            {/* Total Trees Planted Card (Pastel Sage Green) */}
            <View
              style={[
                styles.overviewCard,
                {
                  backgroundColor: DashboardPalette.overviewSage,
                  borderColor: DashboardPalette.overviewSageBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#111827' }]}>1,280+</Text>
                <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
              </View>
              <Text style={[styles.overviewTitle, { color: '#111827' }]}>Trees Planted</Text>
              <Text style={[styles.overviewSub, { color: '#6B7280' }]}>Canopy Growing</Text>
            </View>
          </View>

          {/* Row 2: Total Requests Card (Pastel Lime) */}
          <View
            style={[
              styles.overviewCardFull,
              {
                backgroundColor: DashboardPalette.overviewLime,
                borderColor: DashboardPalette.overviewLimeBorder,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.overviewTopRow}>
              <Text style={[styles.overviewNumber, { color: '#111827' }]}>
                {requests.length + 35}
              </Text>
              <Icon name="arrow-up-right" size={16} color={DashboardPalette.overviewArrow} />
            </View>
            <Text style={[styles.overviewTitle, { color: '#111827' }]}>Total Requests</Text>
            <Text style={[styles.overviewSub, { color: '#6B7280' }]}>
              All-time city submissions across Mumbai
            </Text>
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
  blockedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  blockedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  blockedDesc: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 16,
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
  /* Quick Steps Circular Buttons */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  quickItem: {
    alignItems: 'center',
    width: 72,
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
    fontSize: 11.5,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 15,
  },
  /* Platform Overview Grid */
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
  overviewCardFull: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    minHeight: 88,
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
});
