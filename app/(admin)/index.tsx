import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const CHART_BARS = [
  { month: 'OCT', completed: 48, inProgress: 26 },
  { month: 'NOV', completed: 62, inProgress: 34 },
  { month: 'DEC', completed: 74, inProgress: 28 },
  { month: 'JAN', completed: 88, inProgress: 36 },
];

export default function AdminDashboardScreen() {
  const { currentUser, requests, volunteers } = useApp();

  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending').length || 5;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length + 41;
  const updatingCount =
    requests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length +
    13;

  const totalVolunteers = volunteers.length + 44;
  const totalRequests = requests.length + 118;
  const treesPlanted = 312;

  const quickActions: Array<{
    id: string;
    label: string;
    icon: IconName;
    onPress: () => void;
  }> = [
    {
      id: 'nurseries',
      label: 'Nurseries',
      icon: 'plant',
      onPress: () => {
        if (Platform.OS !== 'web') {
          Alert.alert('Partner Nurseries', '12 verified nurseries active across zones.');
        }
      },
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'document',
      onPress: () => router.push('/pages/admin-reports' as any),
    },
    {
      id: 'events',
      label: 'Events',
      icon: 'calendar',
      onPress: () => router.push('/pages/admin-events' as any),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onPress: () => router.push('/pages/admin-settings' as any),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Greeting Header */}
        <View style={styles.headerRow}>
          <View style={styles.userGroup}>
            <Image
              source={{
                uri:
                  currentUser.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greetingText}>Namaste,</Text>
              <Text style={styles.userName}>{currentUser.name || 'Aanandvan Admin'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/pages/notifications' as any)}
            activeOpacity={0.75}
          >
            <Icon name="bell" size={20} color="#163020" />
          </TouchableOpacity>
        </View>

        {/* Pending Actions */}
        <Text style={styles.sectionTitle}>Pending actions</Text>
        <View style={styles.pendingRow}>
          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#DFE7EE' }]}
            onPress={() => router.push('/(admin)/volunteers' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.pendingNumber}>{pendingVolunteers}</Text>
            <Text style={styles.pendingLabel}>Volunteers requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#D6E4D8' }]}
            onPress={() => router.push('/(admin)/requests' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.pendingNumber}>{pendingRequests}</Text>
            <Text style={styles.pendingLabel}>Plantation requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pendingCard, { backgroundColor: '#EFF4A8' }]}
            onPress={() => router.push('/(admin)/requests' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.pendingNumber}>{updatingCount}</Text>
            <Text style={styles.pendingLabel}>Planting updates</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickRow}>
          {quickActions.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={styles.quickItem}
              onPress={act.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.quickCircle}>
                <Icon name={act.icon} size={20} color="#0D4E2B" />
              </View>
              <Text style={styles.quickLabel}>{act.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Overview */}
        <Text style={styles.sectionTitle}>Platform overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewRow}>
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#DFE7EE' }]}
              onPress={() => router.push('/(admin)/volunteers' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNum}>{totalVolunteers}</Text>
                <Icon name="share" size={16} color="#163020" />
              </View>
              <Text style={styles.overviewName}>Volunteers</Text>
              <Text style={styles.overviewSub}>+12% in a month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#D6E4D8' }]}
              onPress={() => router.push('/(admin)/requests' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNum}>{totalRequests}</Text>
                <Icon name="share" size={16} color="#163020" />
              </View>
              <Text style={styles.overviewName}>Requests</Text>
              <Text style={styles.overviewSub}>+18% in a month</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.overviewRow}>
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#DCE7DE' }]}
              onPress={() => router.push('/pages/admin-reports' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNum}>{treesPlanted}</Text>
                <Icon name="share" size={16} color="#163020" />
              </View>
              <Text style={styles.overviewName}>Trees planted</Text>
              <Text style={styles.overviewSub}>+12% in a month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#EFF4A8' }]}
              onPress={() => router.push('/(admin)/requests' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.overviewTopRow}>
                <Text style={styles.overviewNum}>47</Text>
                <Icon name="share" size={16} color="#163020" />
              </View>
              <Text style={styles.overviewName}>Pending verifications</Text>
              <Text style={styles.overviewSub}>Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plantation Stats */}
        <Text style={styles.sectionTitle}>Plantation stats</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Last 6 months growth</Text>
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>• 2024</Text>
            </View>
          </View>

          <View style={styles.legendWrap}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#0D4E2B' }]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#EAB308' }]} />
              <Text style={styles.legendText}>In progress</Text>
            </View>
          </View>

          <View style={styles.chartBody}>
            <View style={styles.yAxis}>
              <Text style={styles.axisLabel}>100</Text>
              <Text style={styles.axisLabel}>75</Text>
              <Text style={styles.axisLabel}>50</Text>
              <Text style={styles.axisLabel}>25</Text>
              <Text style={styles.axisLabel}>0</Text>
            </View>

            <View style={styles.barsArea}>
              <View style={styles.barsRow}>
                {CHART_BARS.map((bar) => (
                  <View key={bar.month} style={styles.barGroup}>
                    <View style={styles.barPair}>
                      <View
                        style={[
                          styles.barCompleted,
                          { height: Math.round((bar.completed / 100) * 110) },
                        ]}
                      />
                      <View
                        style={[
                          styles.barInProgress,
                          { height: Math.round((bar.inProgress / 100) * 110) },
                        ]}
                      />
                    </View>
                    <Text style={styles.xAxisLabel}>{bar.month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <Text style={styles.sectionTitle}>Recent activities</Text>
        <View style={styles.activityList}>
          <TouchableOpacity
            style={styles.activityRow}
            onPress={() => router.push('/(admin)/requests' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.activityIcon, { backgroundColor: '#CCF2DB' }]}>
              <Icon name="check-circle" size={16} color="#0D4E2B" />
            </View>
            <View style={styles.activityBody}>
              <Text style={styles.activityTitle}>Sector 14, Gurugram</Text>
              <Text style={styles.activityMeta}>Plantation completed • 2h ago</Text>
              <Text style={styles.activityMeta}>
                Volunteer <Text style={styles.activityStrong}>Amit Kumar</Text>
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityRow}
            onPress={() =>
              router.push({
                pathname: '/pages/request-details',
                params: { id: 'REQ-2024-0042' },
              } as any)
            }
            activeOpacity={0.75}
          >
            <View style={[styles.activityIcon, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="check" size={16} color="#1D4ED8" />
            </View>
            <View style={styles.activityBody}>
              <Text style={styles.activityTitle}>Verified REQ-0042</Text>
              <Text style={styles.activityMeta}>Plantation request approved • 2h ago</Text>
              <Text style={styles.activityMeta}>
                Assigned to <Text style={styles.activityStrong}>Amit Kumar</Text>
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityRow}
            onPress={() => router.push('/(admin)/volunteers' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="users" size={16} color="#B45309" />
            </View>
            <View style={styles.activityBody}>
              <Text style={styles.activityTitle}>New volunteer applicant</Text>
              <Text style={styles.activityMeta}>Review pending • 12h ago</Text>
              <Text style={styles.activityMeta}>
                Applicant name <Text style={styles.activityStrong}>Priya M</Text>
              </Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5EAE3',
  },
  greetingText: {
    fontSize: 12,
    color: '#5F6C64',
  },
  userName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0B3E22',
  },
  bellBtn: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B3E22',
    marginBottom: 12,
  },
  pendingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  pendingCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
  },
  pendingNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 4,
  },
  pendingLabel: {
    fontSize: 11.5,
    lineHeight: 15,
    color: '#37473D',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF4A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    color: '#37473D',
    fontWeight: '500',
  },
  overviewGrid: {
    gap: 10,
    marginBottom: 22,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 10,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
  },
  overviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  overviewNum: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0B3E22',
  },
  overviewName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#163020',
    marginBottom: 2,
  },
  overviewSub: {
    fontSize: 11,
    color: '#5F6C64',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    padding: 16,
    marginBottom: 22,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#37473D',
  },
  yearBadge: {
    backgroundColor: '#0D4E2B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  yearBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  legendWrap: {
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11.5,
    color: '#37473D',
  },
  chartBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  yAxis: {
    height: 132,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  axisLabel: {
    fontSize: 11,
    color: '#4F5C54',
  },
  barsArea: {
    flex: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5EAE2',
    paddingTop: 6,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 124,
  },
  barGroup: {
    alignItems: 'center',
    gap: 6,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barCompleted: {
    width: 10,
    backgroundColor: '#0D4E2B',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barInProgress: {
    width: 10,
    backgroundColor: '#EAB308',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#4F5C54',
    fontWeight: '500',
  },
  activityList: {
    gap: 14,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EC',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
    color: '#5F6C64',
    lineHeight: 17,
  },
  activityStrong: {
    fontWeight: '700',
    color: '#163020',
  },
});
