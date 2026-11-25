/**
 * Citizen Home / Dashboard Screen — Aanandvan
 *
 * Implements the approved visual spec:
 * - Header: Avatar, Namaste, Kartik Vichare, RoleSwitcher pill, Bell icon
 * - Section 1: "Track My Green Movement" (3 distinct pastel cards: Blue, Sage, Lime for Pending, Verified, In Progress — Non-clickable)
 * - Section 2: "Quick Steps" (3 circular lime buttons: New Tree Request, My Contribution, Green Event)
 * - Section 3: "Community overview" (3 Platform KPIs: Active Volunteers, Total Trees Planted, Total Requests — Non-clickable)
 * - Section 4: "How to use this app" Video guide card with YouTube link
 * - Floating action button (+)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { DashboardPalette } from '@/constants/colors';

export default function CitizenHomeScreen() {
  const { currentUser, requests } = useApp();

  const citizenName = currentUser.name || 'Kartik Vichare';

  // Requests submitted by this citizen or relevant to citizen
  const myRequests = requests.filter(
    (r) => r.citizenName?.includes('Kartik') || r.citizenId === currentUser.id
  );
  const myPendingCount = myRequests.filter((r) => r.status === 'pending' || r.status === 'needs_info').length || 1;
  const myVerifiedCount = myRequests.filter((r) => r.status === 'verified').length || 2;
  const myInProgressCount = myRequests.filter((r) => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress' || r.status === 'completed').length || 1;

  const quickSteps: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'new-request',
      label: 'New Tree\nRequest',
      icon: 'plant',
      onPress: () => router.push('/pages/create-request' as any),
    },
    {
      id: 'my-contribution',
      label: 'My\nContribution',
      icon: 'bookmark',
      onPress: () => router.push('/pages/my-contribution' as any),
    },
    {
      id: 'green-event',
      label: 'Green\nEvent',
      icon: 'calendar',
      onPress: () => router.push('/pages/green-events' as any),
    },
  ];

  const handleOpenTutorial = async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('How to use this app', 'Opening tutorial walkthrough video on YouTube.');
      }
    } catch {
      Alert.alert('How to use this app', 'Tutorial walkthrough video available on YouTube.');
    }
  };

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
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.userTextCol}>
              <Text style={styles.greetingText}>Namaste,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {citizenName}
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

        {/* ─── Section 1: Track My Green Movement (3 Pastel Non-Clickable Cards) ─── */}
        <Text style={styles.sectionHeading}>Track My Green Movement</Text>
        <View style={styles.pendingRow}>
          {/* Card 1: Pending review (Pastel Blue) - Non-clickable */}
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
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{myPendingCount}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Pending{'\n'}review</Text>
          </View>

          {/* Card 2: Verified requests (Pastel Sage Green) - Non-clickable */}
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
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{myVerifiedCount}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>Verified{'\n'}requests</Text>
          </View>

          {/* Card 3: In progress requests (Pastel Yellow / Lime) - Non-clickable */}
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
            <Text style={[styles.pendingNumber, { color: '#111827' }]}>{myInProgressCount}</Text>
            <Text style={[styles.pendingLabel, { color: '#374151' }]}>In progress{'\n'}requests</Text>
          </View>
        </View>

        {/* ─── Section 2: Quick Steps (3 Circular Buttons) ─── */}
        <Text style={styles.sectionHeading}>Quick Steps</Text>
        <View style={styles.quickRow}>
          {quickSteps.map((step) => (
            <TouchableOpacity
              key={step.id}
              style={styles.quickItem}
              onPress={step.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.quickCircle}>
                <Icon name={step.icon} size={22} color={DashboardPalette.quickIcon} />
              </View>
              <Text style={styles.quickLabel}>{step.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Section 3: Community Overview (3 Non-Clickable KPIs) ─── */}
        <Text style={styles.sectionHeading}>Community overview</Text>
        <View style={styles.overviewGrid}>
          {/* Row 1: Active Volunteers & Total Trees Planted */}
          <View style={styles.overviewRow}>
            {/* Active Volunteers Card (Pastel Blue) - Non-clickable */}
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

            {/* Total Trees Planted Card (Pastel Sage Green) - Non-clickable */}
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

          {/* Row 2: Total Requests Card (Pastel Lime) - Non-clickable */}
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

        {/* ─── Section 4: "How to use this app" Callout Card ─── */}
        <View style={styles.spottedCard}>
          <View style={styles.spottedTextCol}>
            <View style={styles.spottedBadge}>
              <Text style={styles.spottedBadgeText}>VIDEO GUIDE</Text>
            </View>
            <Text style={styles.spottedTitle}>How to use this app</Text>
            <Text style={styles.spottedSubtitle}>
              Watch a quick 2-minute walkthrough on requesting native saplings, tracking volunteer verification, and participating in green events.
            </Text>

            <TouchableOpacity
              style={styles.spottedCta}
              activeOpacity={0.85}
              onPress={handleOpenTutorial}
            >
              <Text style={styles.spottedCtaText}>Watch on YouTube ▷</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.88}
        onPress={() => router.push('/pages/create-request' as any)}
      >
        <Icon name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 80,
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
  /* Quick Steps Circular Buttons */
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 22,
    paddingHorizontal: 12,
  },
  quickItem: {
    alignItems: 'center',
    width: 88,
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
    lineHeight: 16,
  },
  /* Community Overview Grid */
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
  /* How to use this app Callout Card */
  spottedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  spottedTextCol: {
    width: '100%',
  },
  spottedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  spottedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
    letterSpacing: 0.5,
  },
  spottedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  spottedSubtitle: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  spottedCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#163E2B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  spottedCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Floating Action Button */
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#163E2B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
