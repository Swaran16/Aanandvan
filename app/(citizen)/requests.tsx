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
import { PlantationRequest, PlantationStatus } from '@/types';

type FilterTab = 'all' | 'pending' | 'verified' | 'in_progress' | 'completed';

const FILTERS: Array<{ key: FilterTab; label: string }> = [
  { key: 'all', label: 'All Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_STYLE: Record<PlantationStatus, { label: string; bg: string; fg: string }> = {
  pending: { label: 'Pending Review', bg: '#FEF3C7', fg: '#92400E' },
  needs_info: { label: 'Clarification Needed', bg: '#FEE2E2', fg: '#B91C1C' },
  verified: { label: 'Verified', bg: '#E8EFEA', fg: '#163E2B' },
  assigned: { label: 'Assigned', bg: '#EFF6FF', fg: '#1E40AF' },
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', fg: '#1E40AF' },
  in_progress: { label: 'In Progress', bg: '#EFF6FF', fg: '#1E40AF' },
  completed: { label: 'Planted & Nurturing', bg: '#ECFDF5', fg: '#047857' },
  rejected: { label: 'Needs Info', bg: '#FEE2E2', fg: '#B91C1C' },
};

export default function CitizenRequestsScreen() {
  const { requests } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (activeFilter === 'pending') return req.status === 'pending' || req.status === 'rejected';
      if (activeFilter === 'verified') return req.status === 'verified';
      if (activeFilter === 'in_progress') {
        return (
          req.status === 'assigned' ||
          req.status === 'scheduled' ||
          req.status === 'in_progress'
        );
      }
      if (activeFilter === 'completed') return req.status === 'completed';
      return true;
    });
  }, [requests, activeFilter]);

  const renderCard = ({ item }: { item: PlantationRequest }) => {
    const badge = STATUS_STYLE[item.status] ?? {
      label: item.status,
      bg: '#E5EAE3',
      fg: '#163020',
    };
    const thumb =
      item.areaPhotos?.[0] ||
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: '/pages/request-details',
            params: { id: item.id },
          } as any)
        }
      >
        <Image source={{ uri: thumb }} style={styles.thumb} resizeMode="cover" />

        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <Text style={styles.reqIdText}>{item.id}</Text>
            <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
            </View>
          </View>

          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardLocation} numberOfLines={1}>
            {item.location}
          </Text>
          <Text style={styles.cardDate}>{item.createdAt}</Text>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My requests</Text>
      </View>

      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.filterChipText, active && styles.filterChipTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="plant" size={38} color="#8BA093" />
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>
              Tap the + button on the Home dashboard to submit a new plantation request.
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  filtersWrap: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#163E2B',
    borderColor: '#163E2B',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  reqIdText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 28,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
