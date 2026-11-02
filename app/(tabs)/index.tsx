/**
 * Citizen Dashboard (Home) — Aanandvan
 * Matches Image 4:
 *  - Dark green header with avatar, "Namaste, Rahul Sharma", notification bell
 *  - 4 Stat cards (Total 12, Verified 08, Trees Planted 45, Active 04)
 *  - Recent Requests (Neem Plantation Drive, Community Park Restoration)
 *  - Nearby Nurseries (Green Roots Nursery, EcoBloom Center)
 *  - Floating Action Button (+)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

const { width } = Dimensions.get('window');

const statsData = [
  {
    icon: '📋',
    badge: 'Total',
    value: '12',
    label: 'Requests Submitted',
  },
  {
    icon: '🛡️',
    badge: '+2',
    value: '08',
    label: 'Verified Requests',
  },
  {
    icon: '🌲',
    badge: 'New',
    value: '45',
    label: 'Trees Planted',
  },
  {
    icon: '🔄',
    badge: 'Active',
    value: '04',
    label: 'Active Requests',
  },
];

const recentRequests = [
  {
    id: '1',
    title: 'Neem Plantation Drive',
    area: 'Sector 45, Green Belt',
    status: 'Pending Verification',
    statusColor: '#F59E0B',
    image: require('../../assets/images/req_neem.png'),
  },
  {
    id: '2',
    title: 'Community Park Restoration',
    area: 'Old City Area',
    status: 'Verified',
    statusColor: '#10B981',
    image: require('../../assets/images/req_mangrove.png'),
  },
];

const nurseries = [
  {
    id: '1',
    name: 'Green Roots Nursery',
    distance: '0.8 km • Sector 12',
    rating: '4.8',
    tag: 'Government Approved',
    image: require('../../assets/images/nursery1.png'),
  },
  {
    id: '2',
    name: 'EcoBloom Center',
    distance: '2.4 km • Hillview',
    rating: '4.6',
    tag: 'Organic Seeds',
    image: require('../../assets/images/onboarding3.png'),
  },
];

export default function CitizenHomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ─── Dark Forest Green Header ─── */}
      <View style={styles.headerBg}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerRow}>
            {/* User Info */}
            <View style={styles.userRow}>
              <View style={styles.avatarWrap}>
                <Image
                  source={require('../../assets/images/onboarding4.png')}
                  style={styles.avatarImg}
                />
              </View>
              <View style={styles.nameBlock}>
                <Text style={styles.greeting}>Namaste,</Text>
                <Text style={styles.userName}>Rahul Sharma</Text>
              </View>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.75}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 4 Stat Cards in 2x2 Grid ─── */}
        <View style={styles.statsGrid}>
          {statsData.map((stat, i) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statTopRow}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statBadgeText}>{stat.badge}</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ─── Recent Requests ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/request')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {recentRequests.map((req) => (
            <TouchableOpacity
              key={req.id}
              style={styles.requestCard}
              activeOpacity={0.85}
              onPress={() => router.push('/(tabs)/request')}
            >
              <Image source={req.image} style={styles.requestImg} resizeMode="cover" />
              <View style={styles.requestInfo}>
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.requestArea}>{req.area}</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[styles.statusDot, { backgroundColor: req.statusColor }]}
                  />
                  <Text style={[styles.statusText, { color: req.statusColor }]}>
                    {req.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Nearby Nurseries ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Nurseries</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/nursery')}>
            <Text style={styles.seeAllText}>View Map</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nurseryScroll}
        >
          {nurseries.map((nursery) => (
            <View key={nursery.id} style={styles.nurseryCard}>
              <View style={styles.nurseryImgWrap}>
                <Image source={nursery.image} style={styles.nurseryImg} resizeMode="cover" />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {nursery.rating}</Text>
                </View>
              </View>

              <View style={styles.nurseryInfo}>
                <Text style={styles.nurseryName}>{nursery.name}</Text>
                <Text style={styles.nurseryDistance}>{nursery.distance}</Text>
                <View style={styles.nurseryBottomRow}>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{nursery.tag}</Text>
                  </View>
                  <TouchableOpacity style={styles.navBtn}>
                    <Text style={styles.navBtnIcon}>↗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ─── Floating Action Button (+) ─── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/request')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },

  // Dark Header
  headerBg: {
    backgroundColor: '#0B2B1B',
    paddingBottom: Spacing[5],
  },
  headerSafe: {
    paddingHorizontal: Spacing[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[2],
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#34D399',
    overflow: 'hidden',
    backgroundColor: '#1E3A2B',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  nameBlock: {
    gap: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#D1FAE5',
    fontWeight: FontWeight.medium,
  },
  userName: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Scroll Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },

  // Stats Grid 2x2
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing[3],
    marginBottom: Spacing[6],
  },
  statCard: {
    width: (width - Spacing[5] * 2 - Spacing[3]) / 2,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing[4],
    gap: Spacing[1],
    ...Shadow.sm,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  statIcon: {
    fontSize: 20,
  },
  statBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },
  statValue: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: FontWeight.medium,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: FontWeight.semiBold,
    color: '#059669',
  },

  // Recent Requests
  requestsList: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing[3],
    gap: Spacing[3],
    ...Shadow.sm,
  },
  requestImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  requestInfo: {
    flex: 1,
    gap: 3,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  requestArea: {
    fontSize: 12,
    color: '#64748B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FontWeight.semiBold,
  },
  chevron: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: FontWeight.bold,
    paddingRight: Spacing[1],
  },

  // Nearby Nurseries
  nurseryScroll: {
    gap: Spacing[4],
    paddingBottom: Spacing[2],
  },
  nurseryCard: {
    width: 250,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  nurseryImgWrap: {
    width: '100%',
    height: 125,
    position: 'relative',
  },
  nurseryImg: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  nurseryInfo: {
    padding: Spacing[3],
    gap: 4,
  },
  nurseryName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  nurseryDistance: {
    fontSize: 12,
    color: '#64748B',
  },
  nurseryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
  },
  tagBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  tagText: {
    fontSize: 11,
    fontWeight: FontWeight.semiBold,
    color: '#059669',
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnIcon: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: FontWeight.bold,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: Spacing[5],
    bottom: Spacing[4],
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0F3821',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});
