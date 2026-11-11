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

type FilterKey = 'all' | 'pending' | 'verified' | 'rejected';

export default function AdminVolunteersScreen() {
  const { volunteers } = useApp();
  const [filter, setFilter] = useState<FilterKey>('all');

  const pendingCount = volunteers.filter((v) => v.status === 'pending').length;
  const verifiedCount = volunteers.filter((v) => v.status === 'verified').length;
  const rejectedCount = volunteers.filter((v) => v.status === 'rejected').length;

  const filteredVolunteers = useMemo(() => {
    if (filter === 'all') return volunteers;
    return volunteers.filter((v) => v.status === filter);
  }, [volunteers, filter]);

  const openVolunteer = (vol: VolunteerApplication) => {
    router.push({
      pathname: '/pages/volunteer-details',
      params: { id: vol.id },
    } as any);
  };

  const renderCard = ({ item }: { item: VolunteerApplication }) => {
    const isPending = item.status === 'pending';
    const isVerified = item.status === 'verified';
    const isRejected = item.status === 'rejected';

    const badge = isPending
      ? { label: 'Verification pending', bg: '#FBF0C4', fg: '#92580A' }
      : isVerified
        ? { label: 'Approved', bg: '#CCF2DB', fg: '#0D4E2B' }
        : { label: 'Rejected', bg: '#FEE2E2', fg: '#B91C1C' };

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardApplied}>Applied on: {item.appliedDate}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.fg }]}>{badge.label}</Text>
          </View>
        </View>

        {!isRejected && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openVolunteer(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>
              {isPending ? 'Review application' : 'View profile'}
            </Text>
          </TouchableOpacity>
        )}
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
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer management</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#DFE7EE' }]}>
          <Text style={styles.summaryNum}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending requests</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#D6E4D8' }]}>
          <Text style={styles.summaryNum}>{verifiedCount}</Text>
          <Text style={styles.summaryLabel}>Verified</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEFE7' }]}>
          <Text style={styles.summaryNum}>{rejectedCount}</Text>
          <Text style={styles.summaryLabel}>Rejected</Text>
        </View>
      </View>

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
            {filter === 'all' && <Icon name="close" size={12} color="#FFFFFF" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'pending' && styles.filterPillActive]}
            onPress={() => setFilter('pending')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'verified' && styles.filterPillActive]}
            onPress={() => setFilter('verified')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.filterText, filter === 'verified' && styles.filterTextActive]}
            >
              Verified ({verifiedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'rejected' && styles.filterPillActive]}
            onPress={() => setFilter('rejected')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.filterText, filter === 'rejected' && styles.filterTextActive]}
            >
              Rejected ({rejectedCount})
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
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D4325',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  summaryNum: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11.5,
    color: '#4F5C54',
  },
  filtersWrap: {
    paddingBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CED7CD',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4F5C54',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECEFE9',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECEFE9',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 3,
  },
  cardApplied: {
    fontSize: 12,
    color: '#6E7B73',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtn: {
    marginTop: 14,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
