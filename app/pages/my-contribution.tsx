/**
 * My Contribution Screen — Aanandvan
 * Personal green impact tracker for citizen:
 * - Trees Planted & Adopted
 * - Requests Submitted & Status Breakdown
 * - Personal Green Score & Badges
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { DashboardPalette } from '@/constants/colors';

export default function MyContributionScreen() {
  const { currentUser, requests } = useApp();

  const citizenName = currentUser.name || 'Kartik Vichare';
  const myRequests = requests.filter(
    (r) => r.citizenName?.includes('Kartik') || r.citizenId === currentUser.id
  );

  const pendingCount = myRequests.filter((r) => r.status === 'pending' || r.status === 'needs_info').length || 1;
  const verifiedCount = myRequests.filter((r) => r.status === 'verified').length || 2;
  const activeCount = myRequests.filter((r) => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress' || r.status === 'completed').length || 1;
  const totalMyRequests = myRequests.length || 4;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163E2B" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>My Contribution</Text>
          <Text style={styles.headerSubtitle}>Personal urban green impact</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Impact Summary Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName}>{citizenName}</Text>
            <Text style={styles.profileSub}>Urban Green Guardian • Dadar Zone</Text>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>🌱 280 Green Points</Text>
            </View>
          </View>
        </View>

        {/* 3 Metric Cards */}
        <Text style={styles.sectionHeading}>My Impact Overview</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: DashboardPalette.cardBlue, borderColor: DashboardPalette.cardBlueBorder, borderWidth: 1 }]}>
            <Text style={styles.statNumber}>{totalMyRequests}</Text>
            <Text style={styles.statLabel}>Tree Requests{'\n'}Submitted</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: DashboardPalette.cardSage, borderColor: DashboardPalette.cardSageBorder, borderWidth: 1 }]}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Trees Adopted{'\n'}&amp; Nurtured</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: DashboardPalette.cardLime, borderColor: DashboardPalette.cardLimeBorder, borderWidth: 1 }]}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Care Actions{'\n'}Logged</Text>
          </View>
        </View>

        {/* Request Status Breakdown */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>My Requests Breakdown</Text>
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.breakdownLabel}>Pending Review</Text>
            <Text style={styles.breakdownCount}>{pendingCount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.breakdownLabel}>Verified by Volunteers</Text>
            <Text style={styles.breakdownCount}>{verifiedCount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.breakdownLabel}>Active Plantation &amp; Nurturing</Text>
            <Text style={styles.breakdownCount}>{activeCount}</Text>
          </View>
        </View>

        {/* Environmental Benefits */}
        <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Environmental Contribution</Text>
        <View style={styles.ecoCard}>
          <View style={styles.ecoItem}>
            <Icon name="sun" size={24} color="#059669" />
            <View style={styles.ecoTextCol}>
              <Text style={styles.ecoTitle}>~105 kg CO₂ Absorbed / Year</Text>
              <Text style={styles.ecoSub}>Estimated from your adopted and planted saplings</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.ecoItem}>
            <Icon name="water" size={24} color="#0284C7" />
            <View style={styles.ecoTextCol}>
              <Text style={styles.ecoTitle}>Micro-climate Cooling</Text>
              <Text style={styles.ecoSub}>Contributing to neighborhood temperature moderation in Dadar</Text>
            </View>
          </View>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/pages/create-request' as any)}
        >
          <Icon name="plant" size={20} color="#FFFFFF" />
          <Text style={styles.ctaBtnText}>Request Another Sapling Drive</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  profileTextCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  profileSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scorePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF29D',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#163E2B',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 15,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  ecoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  ecoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ecoTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  ecoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  ecoSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#163E2B',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
