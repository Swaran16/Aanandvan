/**
 * Citizen Home / Dashboard Screen — Aanandvan
 *
 * Implements the new visual spec matching the design system:
 * - Header: Avatar, Namaste, Kartik Vichare, RoleSwitcher pill, Bell icon
 * - Pending actions: 3 soft pastel cards (My Pending, Verified, Planted & Cared)
 * - Quick actions: Circular lime buttons (Request Tree, My Requests, Community, Settings)
 * - Community overview: 2x2 grid with diagonal arrow indicator
 * - "Spotted an empty space?" callout card
 * - Floating action button (+)
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

export default function CitizenHomeScreen() {
  const { currentUser, requests } = useApp();

  const citizenName = currentUser.name || 'Kartik Vichare';

  // Requests submitted by this citizen or relevant to citizen
  const myRequests = requests.filter(
    (r) => r.citizenName?.includes('Kartik') || r.citizenId === currentUser.id
  );
  const myPendingCount = myRequests.filter((r) => r.status === 'pending' || r.status === 'needs_info').length || 1;
  const myVerifiedCount = myRequests.filter((r) => r.status === 'verified' || r.status === 'assigned').length || 2;
  const myCompletedCount = myRequests.filter((r) => r.status === 'completed' || r.status === 'in_progress').length || 1;

  const quickActions: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'create',
      label: 'Request Tree',
      icon: 'plant',
      onPress: () => router.push('/pages/create-request' as any),
    },
    {
      id: 'my-reqs',
      label: 'My Requests',
      icon: 'requests',
      onPress: () => router.push('/(citizen)/requests' as any),
    },
    {
      id: 'events',
      label: 'Events',
      icon: 'calendar',
      onPress: () => router.push('/pages/admin-events' as any),
    },
    {
      id: 'profile',
      label: 'Settings',
      icon: 'settings',
      onPress: () => router.push('/(citizen)/profile' as any),
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

        {/* ─── Section 1: Pending Actions (3 Pastel Cards) ─── */}
        <Text style={styles.sectionHeading}>Pending actions</Text>
        <View style={styles.pendingRow}>
          {/* Card 1: My Pending Requests (Soft Blue) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#EBF2FA' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(citizen)/requests' as any)}
          >
            <Text style={styles.pendingNumber}>{myPendingCount}</Text>
            <Text style={styles.pendingLabel}>Pending{'\n'}review</Text>
          </TouchableOpacity>

          {/* Card 2: Verified & In Progress (Soft Sage Green) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#E2EFE5' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(citizen)/requests' as any)}
          >
            <Text style={styles.pendingNumber}>{myVerifiedCount}</Text>
            <Text style={styles.pendingLabel}>Verified{'\n'}requests</Text>
          </TouchableOpacity>

          {/* Card 3: Planted & Cared (Soft Yellow / Lime) */}
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#F4F8D3' }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(citizen)/requests' as any)}
          >
            <Text style={styles.pendingNumber}>{myCompletedCount}</Text>
            <Text style={styles.pendingLabel}>Planted &amp;{'\n'}nurtured</Text>
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
                <Icon name={act.icon} size={22} color="#163E2B" />
              </View>
              <Text style={styles.quickLabel}>{act.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Section 3: Community Overview (2x2 Grid) ─── */}
        <Text style={styles.sectionHeading}>Community overview</Text>
        <View style={styles.overviewGrid}>
          {/* Row 1 */}
          <View style={styles.overviewRow}>
            {/* Active Volunteers Card (Soft Blue) */}
            <View style={[styles.overviewCard, { backgroundColor: '#EBF2FA' }]}>
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNumber}>140+</Text>
                <Icon name="arrow-up-right" size={16} color="#1E40AF" />
              </View>
              <Text style={styles.overviewTitle}>Active Volunteers</Text>
              <Text style={styles.overviewSub}>+12% in Dadar</Text>
            </View>

            {/* Total Requests Card (Soft Sage) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#E2EFE5' }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(citizen)/requests' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNumber}>{requests.length + 35}</Text>
                <Icon name="arrow-up-right" size={16} color="#166534" />
              </View>
              <Text style={styles.overviewTitle}>Total Requests</Text>
              <Text style={styles.overviewSub}>+18% in Mumbai</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.overviewRow}>
            {/* Trees Planted Card (Soft Sage) */}
            <View style={[styles.overviewCard, { backgroundColor: '#E2EFE5' }]}>
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNumber}>1,280+</Text>
                <Icon name="arrow-up-right" size={16} color="#166534" />
              </View>
              <Text style={styles.overviewTitle}>Trees Planted</Text>
              <Text style={styles.overviewSub}>Canopy Growing</Text>
            </View>

            {/* Active Requests Card (Soft Yellow / Lime) */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#F4F8D3' }]}
              activeOpacity={0.85}
              onPress={() => router.push('/(citizen)/requests' as any)}
            >
              <View style={styles.overviewTopRow}>
                <Text style={[styles.overviewNumber, { color: '#92400E' }]}>
                  {requests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length + 8}
                </Text>
                <Icon name="arrow-up-right" size={16} color="#92400E" />
              </View>
              <Text style={styles.overviewTitle}>Active Requests</Text>
              <Text style={[styles.overviewSub, { color: '#92400E', fontWeight: '700' }]}>
                In Progress
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── "Spotted an empty space?" Callout Card ─── */}
        <View style={styles.spottedCard}>
          <View style={styles.spottedTextCol}>
            <View style={styles.spottedBadge}>
              <Text style={styles.spottedBadgeText}>COMMUNITY ACTION</Text>
            </View>
            <Text style={styles.spottedTitle}>Spotted an empty space?</Text>
            <Text style={styles.spottedSubtitle}>
              Spot an unplanted concrete patch or open road divider in Dadar? Request a native sapling drive and our verified volunteers will inspect and plant.
            </Text>

            <TouchableOpacity
              style={styles.spottedCta}
              activeOpacity={0.85}
              onPress={() => router.push('/pages/create-request' as any)}
            >
              <Text style={styles.spottedCtaText}>Request a Tree Spot →</Text>
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
    backgroundColor: '#EBF6DE',
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
  /* Community Overview 2x2 Grid */
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
  /* Spotted an empty space Callout Card */
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
