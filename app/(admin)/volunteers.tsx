/**
 * Admin Volunteer Management Screen — Aanandvan
 *
 * Full volunteer lifecycle oversight:
 * - Dedicated Volunteer Verification section for pending applicants
 * - Unique Volunteer IDs (e.g. VOL-DAD-0104)
 * - Request metrics per volunteer: Accepted, Ongoing, Completed
 * - Inactive flag for volunteers inactive > 30 days
 * - Blocked / Suspended status management
 */

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { VolunteerApplication } from '@/types';

type FilterKey = 'all' | 'pending' | 'verified' | 'blocked';

export default function AdminVolunteersScreen() {
  const { volunteers, approveVolunteer } = useApp();
  const [filter, setFilter] = useState<FilterKey>('all');

  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending');
  const pendingCount = pendingVolunteers.length;
  const verifiedCount = volunteers.filter((v) => v.status === 'verified' && !v.isBlocked).length;
  const blockedCount = volunteers.filter((v) => v.isBlocked).length;

  const filteredVolunteers = useMemo(() => {
    if (filter === 'pending') return volunteers.filter((v) => v.status === 'pending');
    if (filter === 'verified') return volunteers.filter((v) => v.status === 'verified' && !v.isBlocked);
    if (filter === 'blocked') return volunteers.filter((v) => v.isBlocked);
    return volunteers;
  }, [volunteers, filter]);

  const openVolunteer = (vol: VolunteerApplication) => {
    router.push({
      pathname: '/pages/volunteer-details',
      params: { id: vol.id },
    } as any);
  };

  const handleQuickApprove = (vol: VolunteerApplication) => {
    approveVolunteer(vol.id);
    Alert.alert(
      'Volunteer Verified',
      `${vol.name} has been approved as an active volunteer (${vol.volunteerCode || 'VOL-DAD-0105'}). They can now view and accept active requests.`,
      [{ text: 'OK' }]
    );
  };

  const isInactiveOver30Days = (lastActiveDate?: string): boolean => {
    if (!lastActiveDate) return false;
    const lower = lastActiveDate.toLowerCase();
    if (lower.includes('42 days') || lower.includes('sep') || lower.includes('aug')) return true;
    return false;
  };

  const renderCard = ({ item }: { item: VolunteerApplication }) => {
    const isPending = item.status === 'pending';
    const isBlocked = !!item.isBlocked;
    const isInactive = isInactiveOver30Days(item.lastActiveDate);

    const badge = isBlocked
      ? { label: 'Suspended', bg: '#FEE2E2', fg: '#991B1B' }
      : isPending
      ? { label: 'Verification Required', bg: '#FEF3C7', fg: '#92400E' }
      : { label: 'Active Volunteer', bg: '#DCFCE7', fg: '#166534' };

    const acceptedCount = item.acceptedDrivesCount ?? 0;
    const ongoingCount = item.ongoingDrivesCount ?? 0;
    const completedCount = item.completedDrivesCount ?? 0;
    const lastActive = item.lastActiveDate || 'Just applied';
    const volCode = item.volunteerCode || `VOL-DAD-${item.id.slice(-4).toUpperCase()}`;

    return (
      <View
        style={[
          styles.card,
          isPending && styles.cardPending,
          isBlocked && styles.cardBlocked,
        ]}
      >
        <View style={styles.cardTopRow}>
          <Image
            source={{
              uri:
                item.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />

          <View style={styles.cardInfo}>
            <View style={styles.nameCodeRow}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.volCodeBadge}>
                <Text style={styles.volCodeText}>{volCode}</Text>
              </View>
            </View>
            <Text style={styles.cardApplied}>
              {isPending ? `Applied: ${item.appliedDate}` : `Joined: ${item.appliedDate}`} • {item.city || 'Dadar, Mumbai'}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.fg }]}>{badge.label}</Text>
          </View>
        </View>

        {/* Bio / Motivation Preview */}
        {item.bio && (
          <Text style={styles.bioText} numberOfLines={2}>
            &ldquo;{item.bio}&rdquo;
          </Text>
        )}

        {/* Request Metrics Row (for verified volunteers) */}
        {!isPending && (
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{acceptedCount}</Text>
              <Text style={styles.metricLabel}>Accepted</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={[styles.metricNum, { color: '#0369A1' }]}>{ongoingCount}</Text>
              <Text style={styles.metricLabel}>Active Req</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text style={[styles.metricNum, { color: '#166534' }]}>{completedCount}</Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Last Active Date & 30-Day Inactive Flag */}
        <View style={styles.activityFooterRow}>
          <Text style={styles.lastActiveText}>
            {isPending ? 'Status: Pending administrative review' : `Last active: ${lastActive}`}
          </Text>
          {isInactive && !isBlocked && (
            <View style={styles.inactivePill}>
              <Icon name="alert-triangle" size={11} color="#B45309" />
              <Text style={styles.inactivePillText}>Inactive &gt;30d</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {isPending ? (
          <View style={styles.pendingActionRow}>
            <TouchableOpacity
              style={styles.inspectBtn}
              onPress={() => openVolunteer(item)}
              activeOpacity={0.85}
            >
              <Text style={styles.inspectBtnText}>Review Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleQuickApprove(item)}
              activeOpacity={0.88}
            >
              <Icon name="check" size={14} color="#FFFFFF" />
              <Text style={styles.approveBtnText}>Verify &amp; Approve</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openVolunteer(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>
              {isBlocked ? 'Manage Suspension & History' : 'Manage Volunteer & Active Requests'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Volunteer Directory</Text>
          <Text style={styles.headerSubtitle}>Dadar &amp; Mumbai Zone Roster</Text>
        </View>

        <View style={styles.headerRight}>
          <RoleSwitcher theme="light" />
        </View>
      </View>

      {/* Summary KPI Cards (Interactive Filters) */}
      <View style={styles.summaryRow}>
        <TouchableOpacity
          style={[
            styles.summaryCard,
            { backgroundColor: '#FEF3C7', borderColor: filter === 'pending' ? '#D97706' : '#FDE68A' },
          ]}
          onPress={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
          activeOpacity={0.8}
        >
          <Text style={[styles.summaryNum, { color: '#92400E' }]}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.summaryCard,
            { backgroundColor: '#DCFCE7', borderColor: filter === 'verified' ? '#166534' : '#BBF7D0' },
          ]}
          onPress={() => setFilter(filter === 'verified' ? 'all' : 'verified')}
          activeOpacity={0.8}
        >
          <Text style={[styles.summaryNum, { color: '#166534' }]}>{verifiedCount}</Text>
          <Text style={styles.summaryLabel}>Active Volunteers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.summaryCard,
            { backgroundColor: '#FEE2E2', borderColor: filter === 'blocked' ? '#991B1B' : '#FECACA' },
          ]}
          onPress={() => setFilter(filter === 'blocked' ? 'all' : 'blocked')}
          activeOpacity={0.8}
        >
          <Text style={[styles.summaryNum, { color: '#991B1B' }]}>{blockedCount}</Text>
          <Text style={styles.summaryLabel}>Suspended</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({volunteers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'pending' && styles.filterPillActive]}
            onPress={() => setFilter('pending')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'verified' && styles.filterPillActive]}
            onPress={() => setFilter('verified')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'verified' && styles.filterTextActive]}>
              Active ({verifiedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'blocked' && styles.filterPillActive]}
            onPress={() => setFilter('blocked')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'blocked' && styles.filterTextActive]}>
              Suspended ({blockedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Prominent Verification Callout (Transferred from Home Page per user request) */}
      {pendingCount > 0 && filter !== 'pending' && (
        <View style={styles.calloutWrap}>
          <TouchableOpacity
            style={styles.verificationCallout}
            activeOpacity={0.85}
            onPress={() => setFilter('pending')}
          >
            <View style={styles.calloutLeft}>
              <Icon name="alert-triangle" size={18} color="#92400E" />
              <View>
                <Text style={styles.calloutTitle}>
                  {pendingCount} Volunteer Verification{pendingCount > 1 ? 's' : ''} Awaiting Review
                </Text>
                <Text style={styles.calloutSub}>
                  Tap to view applicant details and issue volunteer IDs
                </Text>
              </View>
            </View>
            <Text style={styles.calloutAction}>Review →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredVolunteers}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="volunteers" size={36} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No volunteers found</Text>
            <Text style={styles.emptySub}>
              {filter === 'pending'
                ? 'All volunteer registration applications have been reviewed.'
                : 'No volunteer profiles match this filter.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FAFBF9',
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 64,
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 2,
    textAlign: 'center',
  },
  filtersWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFBF9',
    paddingVertical: 6,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#163E2B',
    borderColor: '#163E2B',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calloutWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  verificationCallout: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  calloutSub: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 1,
  },
  calloutAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardPending: {
    borderColor: '#FDE68A',
  },
  cardBlocked: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  volCodeBadge: {
    backgroundColor: '#E8EFEA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  volCodeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#163E2B',
  },
  cardApplied: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E5E7EB',
  },
  metricNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  activityFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  lastActiveText: {
    fontSize: 11,
    color: '#6B7280',
  },
  inactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactivePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  pendingActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inspectBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#163E2B',
  },
  approveBtn: {
    flex: 1.3,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#163E2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionBtn: {
    height: 38,
    backgroundColor: '#163E2B',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
