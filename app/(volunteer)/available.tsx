import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { AcceptRequestModal } from '@/components/volunteer/AcceptRequestModal';
import { useApp } from '@/context/AppContext';
import { PlantationRequest } from '@/types';

type FilterType = 'all' | 'newest' | 'saved';

const formatRequestCode = (id: string) => {
  if (id.toUpperCase().startsWith('REQ-')) return `#${id.toUpperCase()}`;
  return `#${id.toUpperCase()}`;
};

export default function AvailableRequestsScreen() {
  const { requests } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [selectedRequest, setSelectedRequest] = useState<PlantationRequest | null>(null);

  const baseVerified = requests.filter((r) => r.status === 'verified');

  const availableRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let filtered = baseVerified.filter((req) => {
      if (activeFilter === 'saved' && !savedIds[req.id]) {
        return false;
      }
      if (!q) return true;
      return (
        req.title.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q)
      );
    });

    if (activeFilter === 'newest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [baseVerified, searchQuery, activeFilter, savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenDetails = (req: PlantationRequest) => {
    router.push({ pathname: '/pages/request-details', params: { id: req.id } } as any);
  };

  const handleAcceptAndSchedule = () => {
    if (!selectedRequest) return;
    const reqId = selectedRequest.id;
    setSelectedRequest(null);
    router.push({ pathname: '/pages/schedule-plantation', params: { id: reqId } } as any);
  };

  const renderCard = ({ item }: { item: PlantationRequest }) => {
    const isSaved = !!savedIds[item.id];
    const imageUrl =
      item.areaPhotos?.[0] ||
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop';
    const distanceLabel =
      item.distanceKm !== undefined ? `${item.distanceKm.toFixed(1)} km` : '1.2 km';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() => handleOpenDetails(item)}
      >
        {/* Left Thumbnail with Distance Badge */}
        <View style={styles.thumbWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.cardThumb} resizeMode="cover" />
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distanceLabel}</Text>
          </View>
        </View>

        {/* Right Info & Actions */}
        <View style={styles.cardContent}>
          <View style={styles.metaRow}>
            <Text style={styles.reqIdText}>{formatRequestCode(item.id)}</Text>
            <TouchableOpacity
              onPress={() => toggleSave(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <Icon
                name="bookmark"
                size={16}
                color={isSaved ? '#163E2B' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.locationRow}>
            <Icon name="map-pin" size={12} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.manualAddress || item.location}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() => handleOpenDetails(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailsText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => setSelectedRequest(item)}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available requests</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#7A867E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by area, request ID, city"
          placeholderTextColor="#8B968F"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Icon name="close" size={16} color="#7A867E" />
          </Pressable>
        )}
      </View>

      {/* Filters: strictly All Req and Newest (nearest removed) */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'all' && styles.filterTextActive,
            ]}
          >
            All Req ({baseVerified.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'newest' && styles.filterPillActive]}
          onPress={() => setActiveFilter('newest')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'newest' && styles.filterTextActive,
            ]}
          >
            Newest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'saved' && styles.filterPillActive]}
          onPress={() => setActiveFilter('saved')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'saved' && styles.filterTextActive,
            ]}
          >
            Saved ({Object.values(savedIds).filter(Boolean).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={availableRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="plant" size={40} color="#88958D" />
            <Text style={styles.emptyTitle}>No verified requests</Text>
            <Text style={styles.emptySubtitle}>
              Check back soon for newly verified native sapling spots in Dadar &amp; Mumbai.
            </Text>
          </View>
        }
      />

      {/* Accept Request Modal */}
      {selectedRequest && (
        <AcceptRequestModal
          visible={!!selectedRequest}
          requestTitle={selectedRequest.title}
          requestLocation={selectedRequest.location}
          onAcceptAndSchedule={handleAcceptAndSchedule}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#163020',
    paddingVertical: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 40,
    gap: 10,
  },
  /* Compact Card Layout (~120-130px height) */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  thumbWrapper: {
    width: 88,
    height: 88,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  cardThumb: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(22, 62, 43, 0.88)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reqIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11.5,
    color: '#6B7280',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  viewDetailsBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#374151',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#163E2B',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163020',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
