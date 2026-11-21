import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text, RoleSwitcher } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { PlantationRequest, PlantationStatus } from '@/types';

const STATUS_STYLE: Record<PlantationStatus, { label: string; bg: string; fg: string }> = {
  pending: { label: 'Pending Review', bg: '#FEF3C7', fg: '#92400E' },
  needs_info: { label: 'Clarification Needed', bg: '#FEE2E2', fg: '#B91C1C' },
  verified: { label: 'Verified', bg: '#E8EFEA', fg: '#163E2B' },
  assigned: { label: 'Assigned to Volunteer', bg: '#EFF6FF', fg: '#1E40AF' },
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', fg: '#1E40AF' },
  in_progress: { label: 'In Progress', bg: '#EFF6FF', fg: '#1E40AF' },
  completed: { label: 'Planted & Nurturing', bg: '#ECFDF5', fg: '#047857' },
  rejected: { label: 'Needs Info', bg: '#FEE2E2', fg: '#B91C1C' },
};

export default function CitizenRequestsScreen() {
  const { requests } = useApp();

  // Prioritize pending & active requests at the top
  const sortedRequests = useMemo(() => {
    const priority: Record<string, number> = {
      pending: 0,
      needs_info: 1,
      verified: 2,
      assigned: 3,
      scheduled: 4,
      in_progress: 5,
      completed: 6,
    };
    return [...requests].sort(
      (a, b) => (priority[a.status] ?? 9) - (priority[b.status] ?? 9)
    );
  }, [requests]);

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
            📍 {item.manualAddress || item.location}
          </Text>
          <Text style={styles.cardDate}>{item.createdAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My requests</Text>
            <Text style={styles.headerSubtitle}>
              {sortedRequests.length} Community Submissions
            </Text>
          </View>
        </View>

        <RoleSwitcher theme="light" />
      </View>

      <FlatList
        data={sortedRequests}
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
    backgroundColor: '#FAFBF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    padding: 10,
    gap: 12,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 8,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reqIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyBox: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
