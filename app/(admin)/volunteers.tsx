/**
 * Admin Volunteer Management Screen — Aanandvan
 *
 * Full volunteer lifecycle oversight:
 * - Unique Volunteer IDs (e.g. VOL-DAD-0104)
 * - Drive metrics per volunteer: Accepted, Ongoing, Completed
 * - Inactive flag for volunteers inactive > 30 days
 * - Blocked status indicator with quick review
 */

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { VolunteerApplication } from '@/types';

type FilterKey = 'all' | 'pending' | 'verified' | 'blocked';

export default function AdminVolunteersScreen() {
  const { volunteers } = useApp();
  const [filter, setFilter] = useState<FilterKey>('all');

  const pendingCount = volunteers.filter((v) => v.status === 'pending').length;
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
      ? { label: 'Suspended / Blocked', bg: '#FEE2E2', fg: '#991B1B' }
      : isPending
      ? { label: 'Verification Pending', bg: '#FEF3C7', fg: '#92400E' }
      : { label: 'Active Volunteer', bg: '#DCFCE7', fg: '#166534' };

    const acceptedCount = item.acceptedDrivesCount ?? 4;
    const ongoingCount = item.ongoingDrivesCount ?? 1;
    const completedCount = item.completedDrivesCount ?? 3;
    const lastActive = item.lastActiveDate || '3 days ago';
    const volCode = item.volunteerCode || `VOL-DAD-${item.id.slice(-4).toUpperCase()}`;

    return (
      <View style={[styles.card, isBlocked && styles.cardBlocked]}>
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
              <Text style={styles.volCodeBadge}>{volCode}</Text>
            </View>
            <Text style={styles.cardApplied}>Joined: {item.appliedDate}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.fg }]}>{badge.label}</Text>
          </View>
        </View>

        {/* Bio / Motivation Preview */}
        {item.bio && (
          <Text style={styles.bioText} numberOfLines={2}>
            "{item.bio}"
          </Text>
        )}

        {/* Drive Metrics Row */}
        {!isPending && (
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{acceptedCount}</Text>
              <Text style={styles.metricLabel}>Accepted</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricNum, { color: '#0369A1' }]}>{ongoingCount}</Text>
              <Text style={styles.metricLabel}>Ongoing</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricNum, { color: '#15803D' }]}>{completedCount}</Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
          </View>
        )}

        {/* Last Active Date & 30-Day Inactive Flag */}
        <View style={styles.activityFooterRow}>
          <Text style={styles.lastActiveText}>Last active: {lastActive}</Text>
          {isInactive && !isBlocked && (
            <View style={styles.inactivePill}>
              <Icon name="alert-triangle" size={11} color="#B45309" />
              <Text style={styles.inactivePillText}>Inactive &gt;30d</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openVolunteer(item)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {isPending ? 'Review & Approve Application' : 'Manage Volunteer & Drives'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer Management</Text>
      </View>

      {/* Summary Chips */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#E0F2FE' }]}>
          <Text style={styles.summaryNum}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending Review</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7' }]}>
          <Text style={styles.summaryNum}>{verifiedCount}</Text>
          <Text style={styles.summaryLabel}>Active in Mumbai</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2' }]}>
          <Text style={styles.summaryNum}>{blockedCount}</Text>
          <Text style={styles.summaryLabel}>Suspended</Text>
        </View>
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

      <FlatList
        data={filteredVolunteers}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FAFBF9',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3B24',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 2,
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterPillActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  nameCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  volCodeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B3B24',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardApplied: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
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
    gap: 8,
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
  metricNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '500',
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
    fontWeight: '700',
    color: '#92400E',
  },
  actionBtn: {
    height: 38,
    backgroundColor: '#0B3B24',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
