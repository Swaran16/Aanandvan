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

type FilterType = 'nearest' | 'newest' | 'saved';

const formatRequestCode = (id: string) => {
  if (id.toUpperCase().startsWith('REQ-')) return `#${id.toUpperCase()}`;
  return `#${id.toUpperCase()}`;
};

export default function AvailableRequestsScreen() {
  const { requests } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('nearest');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [selectedRequest, setSelectedRequest] = useState<PlantationRequest | null>(null);

  const availableRequests = useMemo(() => {
    const base = requests.filter((r) => r.status === 'verified');
    const q = searchQuery.trim().toLowerCase();

    let filtered = base.filter((req) => {
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

    if (activeFilter === 'nearest') {
      filtered = [...filtered].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    } else if (activeFilter === 'newest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [requests, searchQuery, activeFilter, savedIds]);

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
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop';
    const distanceLabel =
      item.distanceKm !== undefined ? `${item.distanceKm.toFixed(1)} km away` : '1.2 km away';

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleOpenDetails(item)}
          style={styles.imageWrapper}
        >
          <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.distanceBadge}>
            <Icon name="map-pin" size={12} color="#0D4E2B" />
            <Text style={styles.distanceText}>{distanceLabel}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <Text style={styles.reqIdText}>{formatRequestCode(item.id)}</Text>
          <TouchableOpacity
            onPress={() => toggleSave(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Icon
              name="bookmark"
              size={18}
              color={isSaved ? '#0D4E2B' : '#4C5A52'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.locationRow}>
          <Icon name="map-pin" size={13} color="#5D6B63" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.viewDetailsBtn}
            onPress={() => handleOpenDetails(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailsText}>View details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => setSelectedRequest(item)}
            activeOpacity={0.85}
          >
            <Text style={styles.acceptBtnText}>Accept request</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Available requests</Text>
      </View>

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

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'nearest' && styles.filterPillActive]}
          onPress={() => setActiveFilter('nearest')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'nearest' && styles.filterTextActive,
            ]}
          >
            Nearest
          </Text>
          {activeFilter === 'nearest' && (
            <Icon name="close" size={12} color="#FFFFFF" />
          )}
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
          {activeFilter === 'newest' && (
            <Icon name="close" size={12} color="#FFFFFF" />
          )}
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
            Saved
          </Text>
          {activeFilter === 'saved' && (
            <Icon name="close" size={12} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="plant" size={38} color="#8BA093" />
            <Text style={styles.emptyTitle}>No matching requests</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'saved'
                ? 'Bookmark requests to find them quickly under Saved.'
                : 'Try clearing your search or checking back soon for new verified requests.'}
            </Text>
          </View>
        }
      />

      <AcceptRequestModal
        visible={!!selectedRequest}
        requestTitle={selectedRequest?.title ?? ''}
        requestLocation={selectedRequest?.location ?? ''}
        onAcceptAndSchedule={handleAcceptAndSchedule}
        onClose={() => setSelectedRequest(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D6DDD4',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#163020',
    paddingVertical: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
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
    paddingTop: 8,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageWrapper: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5EAE3',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCF2DB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reqIdText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#88958D',
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12.5,
    color: '#5F6C64',
    flex: 1,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4F5C54',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  viewDetailsBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  acceptBtn: {
    flex: 1.5,
    backgroundColor: '#0D4E2B',
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 19,
  },
});
