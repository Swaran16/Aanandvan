/**
 * Volunteer Dashboard / Home Screen (Tab 1)
 * Matches Batch 2 — Image 1:
 * - Aanandvan logo + notification bell + Amit Kumar avatar
 * - Greeting: "Welcome back, Amit Kumar", "Verified Volunteer" badge
 * - 4 Status cards (2x2 grid): 3 Assigned, 7 Available, 23 Completed, 2 Maintenance Due
 * - Quick Actions: Available Requests, My Assigned Work, Upload Update (Nurseries removed)
 * - Maintenance Notification banner (replacing priority alerts)
 * - Assigned Requests carousel with "View All"
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

export default function VolunteerHomeScreen() {
  const { currentUser, requests, maintenanceItems } = useApp();

  const assignedRequests = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  );
  const availableCount = requests.filter(r => r.status === 'verified').length;
  const completedCount = 23;
  const maintenanceDueCount = maintenanceItems.filter(m => m.status === 'needs_water').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"  />

      {/* ─── Hero Header ─── */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          {/* Top Brand & Actions Bar */}
          <View style={styles.topBrandRow}>
            <View style={styles.brandTitleRow}>
              <View style={styles.miniTreeBadge}>
                <Icon name="tree" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.brandTitle}>Aanandvan</Text>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                style={styles.bellBtn}
                onPress={() => alert('1 Maintenance Due')}
              >
                <Icon name="bell" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Image
                source={{
                  uri:
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.userAvatar}
              />
            </View>
          </View>

          {/* Welcome Greeting */}
          <View style={styles.greetingBlock}>
            <Text style={styles.welcomeTitle}>
              Welcome back, {currentUser.name || 'Amit Kumar'}
            </Text>
            <View style={styles.verifiedVolunteerBadge}>
              <Icon name="check" size={12} color="#0B3B24" />
              <Text style={styles.verifiedVolunteerText}>Verified Volunteer</Text>
            </View>
          </View>

          {/* 4 Status Cards (2x2 Grid) */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {String(assignedRequests.length || 3)}
                </Text>
                <Text style={styles.statLabel}>Assigned</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {String(availableCount || 7)}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{String(completedCount)}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: '#DC2626' }]}>
                  {String(maintenanceDueCount || 2)}
                </Text>
                <Text style={styles.statLabel}>Maintenance Due</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Quick Actions ─── */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsRow}>
            {/* Action 1: Available Requests */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <View style={styles.actionIconBox}>
                <Icon name="search" size={20} color="#0B3B24" />
              </View>
              <Text style={styles.actionCardTitle}>Available Requests</Text>
            </TouchableOpacity>

            {/* Action 2: My Assigned Work */}
            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/my-assigned-work' as any)}
            >
              <View style={styles.actionIconBox}>
                <Icon name="check" size={20} color="#0B3B24" />
              </View>
              <Text style={styles.actionCardTitle}>My Assigned Work</Text>
            </TouchableOpacity>
          </View>

          {/* Action 3: Upload Update */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardFull]}
            activeOpacity={0.8}
            onPress={() => router.push('/pages/upload-activity' as any)}
          >
            <View style={styles.actionIconBox}>
              <Icon name="upload" size={20} color="#0B3B24" />
            </View>
            <Text style={styles.actionCardTitle}>Upload Plantation Activity</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Maintenance Notification ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Maintenance Notification</Text>
        </View>

        <View style={styles.alertCard}>
          <View style={styles.alertTopRow}>
            <View style={styles.alertBadge}>
              <Icon name="alert" size={13} color="#D97706" />
              <Text style={styles.alertBadgeText}>Maintenance Due</Text>
            </View>
            <Text style={styles.alertTime}>In 2 days</Text>
          </View>

          <Text style={styles.alertTitle}>Central Park Saplings (Zone 4)</Text>
          <Text style={styles.alertDesc}>
            Watering and mulching required for 12 oak saplings after the recent dry
            spell.
          </Text>

          <TouchableOpacity
            style={styles.alertActionBtn}
            onPress={() => router.push('/(volunteer)/work' as any)}
          >
            <Text style={styles.alertActionBtnText}>Take Action</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Assigned Requests Carousel ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Assigned Requests</Text>
          <TouchableOpacity onPress={() => router.push('/pages/my-assigned-work' as any)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {assignedRequests.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.assignedCard}
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
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
                }}
                style={styles.assignedImage}
              />
              <View style={styles.assignedBody}>
                <View style={styles.assignedMetaRow}>
                  <View style={styles.miniTagPill}>
                    <Text style={styles.miniTagText}>Planting</Text>
                  </View>
                  <Text style={styles.assignedId}>{item.id}</Text>
                </View>

                <Text style={styles.assignedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.assignedLocRow}>
                  <Icon name="map-pin" size={12} color="#6B7280" />
                  <Text style={styles.assignedLocText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniTreeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  greetingBlock: {
    marginTop: 16,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  verifiedVolunteerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 5,
  },
  verifiedVolunteerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  statsContainer: {
    marginTop: 14,
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
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#E8F5EE',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#D4EFE1',
  },
  actionCardFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  alertActionBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  horizontalScroll: {
    gap: 14,
    paddingRight: 10,
  },
  assignedCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  assignedImage: {
    width: '100%',
    height: 110,
  },
  assignedBody: {
    padding: 12,
  },
  assignedMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniTagPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  miniTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  assignedId: {
    fontSize: 11,
    color: '#6B7280',
  },
  assignedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  assignedLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  assignedLocText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
