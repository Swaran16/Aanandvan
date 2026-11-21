/**
 * Citizen Home / Dashboard Screen — Aanandvan
 *
 * Designed for citizen community engagement:
 * - Namaste Kartik Vichare greeting
 * - Impactful 2x2 KPIs: My Requests, Active Volunteers, Trees Planted, Neighborhood Drives
 * - "Spotted an empty space?" callout card with "Request a Tree →"
 * - Clean Recent Requests list
 * - Properly aligned floating action button (+)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function CitizenHomeScreen() {
  const { currentUser, requests } = useApp();

  const citizenName = currentUser.name || 'Kartik Vichare';

  // Meaningful community impact metrics
  const myRequestsCount =
    requests.filter(
      r => r.citizenName?.includes('Kartik') || r.citizenId === currentUser.id
    ).length || 4;
  const activeVolunteersCount = '140+';
  const treesPlantedCount = '1,280+';
  const neighborhoodDrivesCount = `${requests.length + 35}+`;

  const recentRequests = requests.slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ─── Header Banner with Aligned 2x2 Community Impact Stats ─── */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <View style={styles.userRow}>
              <Image
                source={{
                  uri:
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greetingText}>Namaste,</Text>
                <Text style={styles.userName}>{citizenName}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <RoleSwitcher theme="dark" />

              <TouchableOpacity
                style={styles.bellBtn}
                activeOpacity={0.8}
                onPress={() => router.push('/pages/notifications' as any)}
              >
                <Icon name="bell" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 4 Community Impact Cards (2x2 Grid) */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={styles.statNumber}>{myRequestsCount}</Text>
                <Text style={styles.statLabel}>My Requests</Text>
              </TouchableOpacity>

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {activeVolunteersCount}
                </Text>
                <Text style={styles.statLabel}>Active Volunteers</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {treesPlantedCount}
                </Text>
                <Text style={styles.statLabel}>Trees Planted</Text>
              </View>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={styles.statNumber}>
                  {neighborhoodDrivesCount}
                </Text>
                <Text style={styles.statLabel}>Dadar & City Drives</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── "Spotted an empty space?" Callout Card (Figma Design) ─── */}
        <View style={styles.spottedCard}>
          <View style={styles.spottedTextCol}>
            <View style={styles.spottedBadge}>
              <Text style={styles.spottedBadgeText}>COMMUNITY ACTION</Text>
            </View>
            <Text style={styles.spottedTitle}>Spotted an empty space?</Text>
            <Text style={styles.spottedSubtitle}>
              Spot an unplanted concrete patch or open road divider? Request a native sapling drive and our verified volunteers will inspect and plant.
            </Text>

            <TouchableOpacity
              style={styles.spottedCta}
              activeOpacity={0.85}
              onPress={() => router.push('/pages/create-request' as any)}
            >
              <Text style={styles.spottedCtaText}>Request a Tree →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Recent Requests in Dadar & Mumbai ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Neighborhood Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(citizen)/requests' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {recentRequests.map(item => {
            const isCompleted = item.status === 'completed';
            const isNeedsInfo = item.status === 'needs_info';
            const isVerified =
              item.status === 'verified' ||
              item.status === 'assigned' ||
              item.status === 'in_progress' ||
              item.status === 'scheduled';

            const statusLabel =
              item.status === 'pending'
                ? 'Under Admin Review'
                : isNeedsInfo
                ? 'Clarification Needed'
                : item.status === 'verified'
                ? 'Verified • Open for Volunteers'
                : item.status === 'in_progress'
                ? 'Ongoing Drive'
                : item.status === 'completed'
                ? 'Planted & Nurturing'
                : 'Assigned to Volunteer';

            const statusColor =
              item.status === 'pending'
                ? '#D97706'
                : isNeedsInfo
                ? '#DC2626'
                : item.status === 'completed'
                ? '#15803D'
                : '#2563EB';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.requestItemCard}
                activeOpacity={0.7}
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
                  style={styles.requestThumb}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.requestLocation} numberOfLines={1}>
                    {item.location}
                  </Text>

                  {(item.assignedVolunteerName || item.volunteerName) && (
                    <Text style={styles.volunteerAssignee}>
                      Volunteer: {item.assignedVolunteerName || item.volunteerName}
                    </Text>
                  )}

                  <View style={styles.statusRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: statusColor }]}
                    />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── Floating Action Button (+) with Figma-style Alignment ─── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.88}
        onPress={() => router.push('/pages/create-request' as any)}
      >
        <Icon name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#163E2B',
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  greetingText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 12,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 88,
  },
  spottedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  spottedTextCol: {
    width: '100%',
  },
  spottedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EFEA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  spottedBadgeText: {
    color: '#163E2B',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  spottedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  spottedSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  spottedCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#163E2B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  spottedCtaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 13,
    color: '#163E2B',
    fontWeight: '600',
  },
  requestsList: {
    gap: 8,
  },
  requestItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requestThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  requestLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },
  volunteerAssignee: {
    fontSize: 11,
    color: '#163E2B',
    fontWeight: '500',
    marginBottom: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#163E2B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
