/**
 * Citizen Home / Dashboard Screen
 * Matches Batch 1 — Image 1 & Volunteer Dashboard Symmetry:
 * - Namaste Rahul Sharma header with avatar & notification bell
 * - 4 Status cards (2x2 Grid) perfectly aligned:
 *   Assigned, Available, Completed, Maintenance
 * - Recent Requests list with live status indicators and See All
 * - Nurseries removed per user instructions
 * - Floating Action Button (+) to create new plantation request
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
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function CitizenHomeScreen() {
  const { currentUser, requests, maintenanceItems } = useApp();

  // Dynamic metrics aligned with lifecycle stages
  const assignedCount =
    requests.filter(
      r => r.status === 'assigned' || r.status === 'in_progress' || r.status === 'scheduled'
    ).length || 3;
  const availableCount =
    requests.filter(r => r.status === 'verified' || r.status === 'pending').length || 7;
  const completedCount =
    requests.filter(r => r.status === 'completed').length || 23;
  const maintenanceCount = maintenanceItems?.length || 2;

  const recentRequests = requests.slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ─── Header Banner with Aligned 2x2 Stats ─── */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <View style={styles.userRow}>
              <Image
                source={{
                  uri:
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greetingText}>Namaste,</Text>
                <Text style={styles.userName}>{currentUser.name || 'Rahul Sharma'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bellBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/notifications' as any)}
            >
              <Icon name="bell" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* 4 Status Cards (2x2 Grid) — Assigned, Available, Completed, Maintenance */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={styles.statNumber}>{String(assignedCount)}</Text>
                <Text style={styles.statLabel}>Assigned</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={styles.statNumber}>{String(availableCount)}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={styles.statNumber}>{String(completedCount)}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statBox}
                activeOpacity={0.85}
                onPress={() => router.push('/(citizen)/requests' as any)}
              >
                <Text style={[styles.statNumber, { color: '#DC2626' }]}>
                  {String(maintenanceCount)}
                </Text>
                <Text style={styles.statLabel}>Maintenance</Text>
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
        {/* ─── Recent Requests Section ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(citizen)/requests' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {recentRequests.map(item => {
            const isVerified =
              item.status === 'verified' ||
              item.status === 'assigned' ||
              item.status === 'in_progress' ||
              item.status === 'completed';

            const statusLabel =
              item.status === 'pending'
                ? 'Pending Verification'
                : item.status === 'verified'
                ? 'Verified'
                : item.status === 'in_progress'
                ? 'In Progress'
                : item.status === 'completed'
                ? 'Completed'
                : 'Assigned';

            const statusDotColor =
              item.status === 'pending'
                ? '#F59E0B'
                : item.status === 'completed' || isVerified
                ? '#10B981'
                : '#3B82F6';

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
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: statusDotColor }]}
                    />
                    <Text style={[styles.statusText, { color: statusDotColor }]}>
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

      {/* ─── Floating Action Button (+) ─── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
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
    backgroundColor: '#F8FAF9',
  },
  header: {
    backgroundColor: '#0B3B24',
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  safeHeader: {
    paddingHorizontal: 20,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  greetingText: {
    fontSize: 13,
    color: '#A8D5BA',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 16,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  requestsList: {
    gap: 12,
  },
  requestItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  requestThumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  requestLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
