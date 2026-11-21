/**
 * Admin Plantation Requests Screen — Aanandvan
 *
 * Dedicated pipeline for admin triage:
 * - Direct listing of all plantation requests prioritized by status (Pending Review first)
 * - "Admin Takeover" button on unassigned drives (>3 days unaccepted by volunteers)
 * - Citizen details, area photos strip, and direct review navigation
 */

import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
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
import { PlantationRequest } from '@/types';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop',
];

export default function AdminRequestsScreen() {
  const { requests, adminTakeoverRequest } = useApp();

  // Prioritize requests needing admin attention: Pending first, then Needs Info, Verified, etc.
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

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleTakeover = (reqId: string, title: string) => {
    Alert.alert(
      'Admin Squad Takeover',
      `Take over "${title}"? This assigns the drive directly to the internal Aanandvan squad for immediate execution.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Takeover',
          onPress: () => {
            adminTakeoverRequest(reqId);
            router.push({
              pathname: '/pages/upload-activity',
              params: { id: reqId },
            } as any);
          },
        },
      ]
    );
  };

  const renderCard = ({ item }: { item: PlantationRequest }) => {
    const photos = [...(item.areaPhotos ?? []), ...(item.landmarkPhotos ?? []), ...FALLBACK_PHOTOS].slice(
      0,
      4
    );

    const isPending = item.status === 'pending';
    const isVerifiedUnassigned = item.status === 'verified';
    const isNeedsInfo = item.status === 'needs_info';

    return (
      <View style={[styles.card, isPending && styles.cardPending]}>
        {/* Photo Strip */}
        <View style={styles.photosStrip}>
          {photos.map((uri, idx) => (
            <View key={`${item.id}-ph-${idx}`} style={styles.stripCell}>
              <Image source={{ uri }} style={styles.stripImg} resizeMode="cover" />
            </View>
          ))}
        </View>

        <View style={styles.cardHeaderRow}>
          <Text style={styles.reqIdText}>#{item.id.toUpperCase()}</Text>
          <View
            style={[
              styles.statusBadge,
              isPending
                ? { backgroundColor: '#FEF3C7' }
                : isNeedsInfo
                ? { backgroundColor: '#FEE2E2' }
                : isVerifiedUnassigned
                ? { backgroundColor: '#E0F2FE' }
                : { backgroundColor: '#DCFCE7' },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isPending
                  ? { color: '#92400E' }
                  : isNeedsInfo
                  ? { color: '#B91C1C' }
                  : isVerifiedUnassigned
                  ? { color: '#0369A1' }
                  : { color: '#166534' },
              ]}
            >
              {isPending
                ? 'Pending Review'
                : isNeedsInfo
                ? 'Clarification Needed'
                : isVerifiedUnassigned
                ? 'Verified • Open for Volunteers'
                : item.status.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardLocation} numberOfLines={1}>
          📍 {item.manualAddress || item.location}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          &ldquo;{item.description}&rdquo;
        </Text>

        <View style={styles.submitterRow}>
          <Image
            source={{
              uri:
                item.citizenAvatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.citizenAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.submittedBy}>Submitted by: {item.citizenName || 'Kartik Vichare'}</Text>
            <Text style={styles.submittedDate}>
              {item.createdAt} • Dadar Ward
            </Text>
          </View>
        </View>

        {/* Buttons Row */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() =>
              router.push({
                pathname: '/pages/admin-review-request',
                params: { id: item.id },
              } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.reviewBtnText}>
              {isPending ? 'Review & Verify Spot' : 'View Full Details'}
            </Text>
          </TouchableOpacity>

          {/* Admin Takeover Button (if unaccepted by volunteers) */}
          {isVerifiedUnassigned && (
            <TouchableOpacity
              style={styles.takeoverBtn}
              onPress={() => handleTakeover(item.id, item.title)}
              activeOpacity={0.85}
            >
              <Icon name="plant" size={14} color="#FFFFFF" />
              <Text style={styles.takeoverBtnText}>Take Over Drive</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Plantation Requests</Text>
          <Text style={styles.headerSubtitle}>
            {requests.length} Total Requests{pendingCount > 0 ? ` • ${pendingCount} Awaiting Review` : ''} • Dadar Ward
          </Text>
        </View>

        <View style={styles.headerRight}>
          <RoleSwitcher theme="light" />
        </View>
      </View>

      <FlatList
        data={sortedRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No plantation requests submitted yet.</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
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
  photosStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stripCell: {
    flex: 1,
    aspectRatio: 1.2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  stripImg: {
    width: '100%',
    height: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reqIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  cardLocation: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 12,
  },
  citizenAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  submittedBy: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  submittedDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#163E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  takeoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#166534',
  },
  takeoverBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyBox: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
