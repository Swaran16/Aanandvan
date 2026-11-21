/**
 * Volunteer Dashboard / Home Screen — Aanandvan
 *
 * Tailored specifically for volunteers (Vaibhav Shirke):
 * - Namaste Vaibhav Shirke greeting with single bell icon
 * - Meaningful 2x2 KPIs: Assigned Drives, Available to Plant, Nurturing Due, Completed Drives
 * - Streamlined Quick Actions (Available Drives, Assigned Drives, Log Care) — no nurseries, no duplicates
 * - Priority Nurturing Alerts with direct "Log Care & Photos" CTA (no hollow "mark as done")
 * - Blocked volunteer suspension banner if disabled by admin
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

export default function VolunteerHomeScreen() {
  const { currentUser, requests, maintenanceItems } = useApp();

  const volunteerName = currentUser.name || 'Vaibhav Shirke';
  const isBlocked = !!currentUser.isBlocked;

  const assignedRequests = requests.filter(
    r =>
      (r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress') &&
      (!r.assignedVolunteerName || r.assignedVolunteerName.includes('Vaibhav') || r.assignedVolunteerName.includes('Shirke'))
  );

  const availableRequests = requests.filter(r => r.status === 'verified');
  const nurturingDueCount = maintenanceItems.length || 2;
  const completedDrivesCount = requests.filter(r => r.status === 'completed').length || 12;

  const priorityAlerts =
    maintenanceItems.length > 0
      ? maintenanceItems.slice(0, 2).map((m) => ({
          id: m.id,
          title: m.treeName || 'Nurturing & Watering Due',
          location: m.location || 'Prabhadevi Beachside Garden',
          time: m.lastVisit || 'Today',
          desc:
            m.timeline?.[0]?.description ||
            'Alternate-day deep watering and tree guard stability check required for recently planted neem saplings.',
        }))
      : [
          {
            id: 'MAINT-1',
            title: 'Watering & Guard Inspection Due',
            location: 'Prabhadevi Beachside Garden, Dadar',
            time: 'Due Today',
            desc: 'Alternate-day cycle: 15L watering required. Check bamboo tree guard.',
          },
        ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative subtle header accents */}
      <View style={styles.topWatermarkRight} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Top Greeting Bar with Single Notification Bell ─── */}
          <View style={styles.topBar}>
            <View style={styles.userRow}>
              <Image
                source={{
                  uri:
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.greetingLabel}>Namaste,</Text>
                <Text style={styles.userName}>{volunteerName}</Text>
              </View>
            </View>

            <View style={styles.topBarActions}>
              <RoleSwitcher theme="light" />

              <TouchableOpacity
                style={styles.bellBtn}
                activeOpacity={0.75}
                onPress={() => router.push('/pages/notifications' as any)}
              >
                <Icon name="bell" size={20} color="#0B3B24" />
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

          {/* ─── Meaningful 2x2 Status Grid ─── */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/pages/my-assigned-work' as any)}
              >
                <Text style={styles.statNumberLight}>
                  {String(assignedRequests.length || 2).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Assigned Drives</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/(volunteer)/available' as any)}
              >
                <Text style={styles.statNumberLight}>
                  {String(availableRequests.length || 5).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Available to Plant</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/(volunteer)/work' as any)}
              >
                <Text style={[styles.statNumberLight, { color: '#F87171' }]}>
                  {String(nurturingDueCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Nurturing Due</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCardLime}
                activeOpacity={0.88}
                onPress={() => router.push('/pages/my-assigned-work' as any)}
              >
                <Text style={styles.statNumberDark}>
                  {String(completedDrivesCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelDark}>Completed Drives</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Streamlined Quick Actions (3 clear buttons) ─── */}
          <Text style={styles.sectionTitle}>Volunteer Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="search" size={20} color="#0B3B24" />
              </View>
              <Text style={styles.quickLabel}>Available{'\n'}Drives</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/my-assigned-work' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="requests" size={20} color="#0B3B24" />
              </View>
              <Text style={styles.quickLabel}>My Assigned{'\n'}Drives</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/log-nurturing' as any)}
            >
              <View style={[styles.quickCircle, { backgroundColor: '#C7EED8' }]}>
                <Icon name="plant" size={20} color="#0B3B24" />
              </View>
              <Text style={styles.quickLabel}>Log Care &{'\n'}Nurturing</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Priority Nurturing Alerts ─── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleNoMargin}>Priority Nurturing Alerts</Text>
            <TouchableOpacity onPress={() => router.push('/(volunteer)/work' as any)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsStack}>
            {priorityAlerts.map((item) => (
              <View key={item.id} style={styles.taskCard}>
                <View style={styles.taskTopRow}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskTime}>{item.time}</Text>
                </View>

                <Text style={styles.taskLocation} numberOfLines={1}>
                  {item.location}
                </Text>
                <Text style={styles.taskDesc} numberOfLines={2}>
                  {item.desc}
                </Text>

                <View style={styles.taskActionsRow}>
                  <TouchableOpacity
                    style={styles.logNurturingBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/pages/log-nurturing',
                        params: { id: item.id },
                      } as any)
                    }
                  >
                    <Icon name="camera" size={15} color="#FFFFFF" />
                    <Text style={styles.logNurturingText}>Log Nurturing & Photos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.viewDriveBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/pages/request-details',
                        params: { id: 'REQ-DAD-01' },
                      } as any)
                    }
                  >
                    <Text style={styles.viewDriveText}>View Thread</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* ─── Assigned Active Drives ─── */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <Text style={styles.sectionTitleNoMargin}>Active Drives in Dadar</Text>
            <TouchableOpacity onPress={() => router.push('/pages/my-assigned-work' as any)}>
              <Text style={styles.viewAllText}>View all</Text>
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
                    {item.location}
                  </Text>
                  <View style={styles.activeDriveBadge}>
                    <Text style={styles.activeDriveBadgeText}>
                      {item.status === 'scheduled'
                        ? 'Scheduled Plantation'
                        : item.status === 'in_progress'
                        ? 'Planting in Progress'
                        : 'Assigned Drive'}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  topWatermarkRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(199, 238, 216, 0.4)',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
    borderColor: '#C7EED8',
  },
  greetingLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.3,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  statsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCardDark: {
    flex: 1,
    backgroundColor: '#0B3B24',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  statNumberLight: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statLabelLight: {
    fontSize: 12,
    color: '#A8D5BA',
    fontWeight: '600',
    marginTop: 2,
  },
  statCardLime: {
    flex: 1,
    backgroundColor: '#C7EED8',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  statNumberDark: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.5,
  },
  statLabelDark: {
    fontSize: 12,
    color: '#0B3B24',
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  sectionTitleNoMargin: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.3,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  quickActionItem: {
    alignItems: 'center',
    width: 90,
  },
  quickCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  cardsStack: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  taskTime: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  taskLocation: {
    fontSize: 12.5,
    color: '#4B5563',
    marginBottom: 6,
  },
  taskDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 12,
  },
  taskActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logNurturingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0B3B24',
    borderRadius: 10,
    height: 40,
  },
  logNurturingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewDriveBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDriveText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#374151',
  },
  activeDriveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeDriveThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  activeDriveTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  activeDriveLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  activeDriveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeDriveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1B5E20',
  },
});
