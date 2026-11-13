/**
 * Volunteer Dashboard / Home Screen — Aanandvan (New Design 4)
 *
 * Matches new Volunteer Dashboard design:
 * - Soft cream/sage background with pale mint top-right watermark
 * - Avatar + "Namaste, {Name}" + Notification bell
 * - Tight 2x2 metric grid (3 dark green cards + 1 pastel lime Active requests card)
 * - Quick actions: 4 circular lime icon buttons (Available requests, Assigned work, Partnered nurseries, Upload update)
 * - Priority alerts section with "View all", "Mark as done", and "Update" CTAs
 * - Assigned requests section with "View all", "Mark as done", and "Update" CTAs
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VolunteerHomeScreen() {
  const { currentUser, requests, maintenanceItems, waterTree, loginAs } = useApp();
  const [completedAlerts, setCompletedAlerts] = useState<Record<string, boolean>>({});

  const assignedRequests = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  );
  const requestsSubmittedCount = requests.filter(r => r.status === 'pending' || r.status === 'assigned').length || 3;
  const verifiedCount = requests.filter(r => r.status === 'verified').length || 7;
  const treesPlantedCount = currentUser?.treesCount ?? 23;
  const activeCount = assignedRequests.length;

  const priorityAlerts =
    maintenanceItems.length > 0
      ? maintenanceItems.slice(0, 2).map((m) => ({
          id: m.id,
          title: m.treeName || 'Water the saplings',
          location: m.location || 'Central Park Saplings (Zone 4)',
          time: m.lastVisit || '23 mins ago',
          desc:
            m.timeline?.[0]?.description ||
            'Watering and mulching required for 12 oak saplings after the recent dry spell.',
        }))
      : [
          {
            id: 'MAINT-1',
            title: 'Water the saplings',
            location: 'Central Park Saplings (Zone 4)',
            time: '23 mins ago',
            desc: 'Watering and mulching required for 12 oak saplings after the recent dry spell.',
          },
          {
            id: 'MAINT-2',
            title: 'Water the saplings',
            location: 'Central Park Saplings (Zone 4)',
            time: '23 mins ago',
            desc: 'Watering and mulching required for 12 oak saplings after the recent dry spell.',
          },
        ];

  const handleMarkAlertDone = (id: string, title: string) => {
    setCompletedAlerts(prev => ({ ...prev, [id]: true }));
    waterTree(id);
    Alert.alert('Marked as Done', `${title} has been marked as completed.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Subtle Top-Right Decorative Leaf/Arc Watermark */}
      <View style={styles.topWatermarkLeft} pointerEvents="none" />
      <View style={styles.topWatermarkRight} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Top Greeting Bar ─── */}
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
                <Text style={styles.userName}>{currentUser.name || 'Amit Kumar'}</Text>
              </View>
            </View>

            <View style={styles.topBarActions}>
              <TouchableOpacity
                style={styles.adminSwitchBtn}
                activeOpacity={0.8}
                onPress={() => {
                  loginAs('admin');
                  router.push('/(admin)' as any);
                }}
              >
                <Text style={styles.adminSwitchText}>Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bellBtn}
                activeOpacity={0.75}
                onPress={() => router.push('/(volunteer)/work' as any)}
              >
                <Icon name="bell" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── 2x2 Status Grid ─── */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/pages/my-assigned-work' as any)}
              >
                <Text style={styles.statNumberLight}>
                  {String(requestsSubmittedCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Requests submitted</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/(volunteer)/available' as any)}
              >
                <Text style={styles.statNumberLight}>
                  {String(verifiedCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Verified requests</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCardDark}
                activeOpacity={0.88}
                onPress={() => router.push('/pages/my-assigned-work' as any)}
              >
                <Text style={styles.statNumberLight}>
                  {String(treesPlantedCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelLight}>Trees planted</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCardLime}
                activeOpacity={0.88}
                onPress={() => router.push('/pages/my-assigned-work' as any)}
              >
                <Text style={styles.statNumberDark}>
                  {String(activeCount).padStart(2, '0')}
                </Text>
                <Text style={styles.statLabelDark}>Active requests</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Quick Actions ─── */}
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="search" size={19} color="#0A4D2E" />
              </View>
              <Text style={styles.quickLabel}>Available{'\n'}requests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/my-assigned-work' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="requests" size={19} color="#0A4D2E" />
              </View>
              <Text style={styles.quickLabel}>Assigned{'\n'}work</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/nursery' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="plant" size={19} color="#0A4D2E" />
              </View>
              <Text style={styles.quickLabel}>Partnered{'\n'}nurseries</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              activeOpacity={0.8}
              onPress={() => router.push('/pages/select-update-request' as any)}
            >
              <View style={styles.quickCircle}>
                <Icon name="upload" size={19} color="#0A4D2E" />
              </View>
              <Text style={styles.quickLabel}>Upload{'\n'}update</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Priority Alerts ─── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleNoMargin}>Priority alerts</Text>
            <TouchableOpacity onPress={() => router.push('/(volunteer)/work' as any)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsStack}>
            {priorityAlerts.map((item) => {
              const isDone = !!completedAlerts[item.id];
              return (
                <View key={item.id} style={styles.taskCard}>
                  <View style={styles.taskTopRow}>
                    <Text style={styles.taskTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.taskTime}>
                      {item.time}
                    </Text>
                  </View>

                  <Text style={styles.taskLocation} numberOfLines={1}>
                    {item.location}
                  </Text>
                  <Text style={styles.taskDesc} numberOfLines={2}>
                    {item.desc}
                  </Text>

                  <View style={styles.taskActionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.markDoneBtn,
                        isDone && { backgroundColor: '#15803D' },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleMarkAlertDone(item.id, item.title || 'Saplings care')}
                    >
                      <Text style={styles.markDoneText}>
                        {isDone ? 'Completed ✓' : 'Mark as done'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.updateBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: '/pages/maintenance-thread',
                          params: { id: item.id },
                        } as any)
                      }
                    >
                      <Text style={styles.updateText}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ─── Assigned Requests ─── */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <Text style={styles.sectionTitleNoMargin}>Assigned requests</Text>
            <TouchableOpacity onPress={() => router.push('/pages/my-assigned-work' as any)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsStack}>
            {assignedRequests.slice(0, 2).map((req) => (
              <TouchableOpacity
                key={req.id}
                style={styles.taskCard}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: '/pages/request-details',
                    params: { id: req.id },
                  } as any)
                }
              >
                <View style={styles.taskTopRow}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {req.title}
                  </Text>
                  <Text style={styles.taskTime}>{req.createdAt || 'Recently'}</Text>
                </View>

                <Text style={styles.taskLocation} numberOfLines={1}>
                  {req.location}
                </Text>
                <Text style={styles.taskDesc} numberOfLines={2}>
                  {req.description}
                </Text>

                <View style={styles.taskActionsRow}>
                  <TouchableOpacity
                    style={styles.markDoneBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/pages/upload-activity',
                        params: { id: req.id },
                      } as any)
                    }
                  >
                    <Text style={styles.markDoneText}>Mark as done</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.updateBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/pages/schedule-plantation',
                        params: { id: req.id },
                      } as any)
                    }
                  >
                    <Text style={styles.updateText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F4',
  },
  safe: {
    flex: 1,
  },
  topWatermarkLeft: {
    position: 'absolute',
    top: -40,
    right: 40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(218, 236, 222, 0.55)',
  },
  topWatermarkRight: {
    position: 'absolute',
    top: -20,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(222, 239, 226, 0.65)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
  },
  greetingLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#111827',
    marginTop: -1,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminSwitchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminSwitchText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E8F5E9',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statCardDark: {
    flex: 1,
    backgroundColor: '#0A4D2E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statCardLime: {
    flex: 1,
    backgroundColor: '#F0FA9B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statNumberLight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statLabelLight: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 2,
    fontWeight: '400',
  },
  statNumberDark: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statLabelDark: {
    fontSize: 11.5,
    color: '#1F2937',
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 14,
  },
  sectionTitleNoMargin: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#111827',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
  quickCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FA9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14.5,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0A4D2E',
  },
  cardsStack: {
    gap: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  taskTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  taskTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  taskLocation: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  taskDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginTop: 3,
  },
  taskActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  markDoneBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markDoneText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  updateBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0A4D2E',
  },
});
