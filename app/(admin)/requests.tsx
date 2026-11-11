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
import { PlantationRequest } from '@/types';

type FilterTab = 'pending' | 'needs_info' | 'verified';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&auto=format&fit=crop',
];

export default function AdminRequestsScreen() {
  const { requests } = useApp();
  const [filter, setFilter] = useState<FilterTab>('pending');

  const pendingCount = requests.filter(
    (r) => r.status === 'pending' || r.status === 'scheduled'
  ).length;
  const needsInfoCount = requests.filter((r) => r.status === 'rejected').length;
  const verifiedCount = requests.filter(
    (r) =>
      r.status === 'verified' ||
      r.status === 'assigned' ||
      r.status === 'in_progress' ||
      r.status === 'completed'
  ).length;

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (filter === 'pending') {
        return req.status === 'pending' || req.status === 'scheduled';
      }
      if (filter === 'needs_info') {
        return req.status === 'rejected';
      }
      return (
        req.status === 'verified' ||
        req.status === 'assigned' ||
        req.status === 'in_progress' ||
        req.status === 'completed'
      );
    });
  }, [requests, filter]);

  const renderCard = ({ item }: { item: PlantationRequest }) => {
    const photos = [...(item.areaPhotos ?? []), ...(item.landmarkPhotos ?? []), ...FALLBACK_PHOTOS].slice(
      0,
      5
    );
    const hasDuplicateRisk = item.duplicateRisk === 'Potential match';

    return (
      <View style={styles.card}>
        <View style={styles.photosStrip}>
          {photos.map((uri, idx) => {
            const isLast = idx === 4;
            return (
              <View key={`${item.id}-ph-${idx}`} style={styles.stripCell}>
                <Image source={{ uri }} style={styles.stripImg} resizeMode="cover" />
                {isLast && (
                  <View style={styles.moreOverlay}>
                    <Text style={styles.moreText}>+2 more</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.reqIdText}>#{item.id.toUpperCase()}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.manualAddress || item.description}
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
          <View>
            <Text style={styles.submittedBy}>Submitted by: {item.citizenName}</Text>
            <Text style={styles.submittedDate}>{item.createdAt}</Text>
          </View>
        </View>

        {hasDuplicateRisk && (
          <View style={styles.duplicateBox}>
            <Text style={styles.duplicateText}>
              Possible duplicate of #REQ-2024-0042 (about 20 meters away)
            </Text>
          </View>
        )}

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
          <Text style={styles.reviewBtnText}>Review request</Text>
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
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plantation requests</Text>
      </View>

      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
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
            {filter === 'pending' && <Icon name="close" size={12} color="#FFFFFF" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'needs_info' && styles.filterPillActive]}
            onPress={() => setFilter('needs_info')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'needs_info' && styles.filterTextActive,
              ]}
            >
              Needs info ({needsInfoCount})
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
        </ScrollView>
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text style={styles.footerNote}>
            Note: There might be duplication of requests.
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="requests" size={36} color="#8BA093" />
            <Text style={styles.emptyTitle}>No requests in this filter</Text>
            <Text style={styles.emptySub}>Switch tabs above to inspect other requests.</Text>
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
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  photosStrip: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  stripCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5EAE3',
  },
  stripImg: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reqIdText: {
    fontSize: 11.5,
    color: '#7A867E',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4F5C54',
    marginBottom: 12,
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  citizenAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5EAE3',
  },
  submittedBy: {
    fontSize: 12.5,
    color: '#5F6C64',
  },
  submittedDate: {
    fontSize: 11.5,
    color: '#7A867E',
  },
  duplicateBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  duplicateText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#92580A',
    fontWeight: '500',
  },
  reviewBtn: {
    height: 44,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6E7B73',
    marginTop: 4,
    marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#163020',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#6C7870',
    textAlign: 'center',
  },
});
