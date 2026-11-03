/**
 * Volunteer Available Requests Screen (Tab 2)
 * Matches Batch 2 — Image 2:
 * - Back button + Aanandvan top bar
 * - Title: "Available Requests"
 * - Search bar: "Search by area or tree species..."
 * - Filter pills: [Nearest], [Newest], [My City], [Popular]
 * - Request cards with distance tag, bookmark, address, description
 * - Primary "Accept Request" button
 * - Tapping card opens details with Accept & Schedule actions
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VolunteerAvailableScreen() {
  const { requests, volunteerAcceptRequest } = useApp();
  const [activeFilter, setActiveFilter] = useState<'nearest' | 'newest' | 'city' | 'popular'>('nearest');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Show requests that are verified and open for volunteers (or newly assigned)
  const availableList = requests.filter(r => {
    const isAvailable = r.status === 'verified';
    if (!isAvailable) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAccept = (id: string, title: string) => {
    volunteerAcceptRequest(id);
    Alert.alert(
      'Request Accepted! 🎉',
      `You have successfully accepted "${title}". It is now added to "My Assigned Work". Would you like to schedule the plantation drive now?`,
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Schedule Now',
          onPress: () =>
            router.push({
              pathname: '/pages/schedule-plantation',
              params: { id },
            } as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push('/(volunteer)' as any)}
          style={styles.backBtn}
        >
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Aanandvan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageHeading}>Available Requests</Text>

        {/* ─── Search Bar ─── */}
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by area or tree species..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ─── Filter Pills ─── */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'nearest' && styles.filterPillActive]}
            onPress={() => setActiveFilter('nearest')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'nearest' && styles.filterPillTextActive,
              ]}
            >
              Nearest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'newest' && styles.filterPillActive]}
            onPress={() => setActiveFilter('newest')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'newest' && styles.filterPillTextActive,
              ]}
            >
              Newest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'city' && styles.filterPillActive]}
            onPress={() => setActiveFilter('city')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'city' && styles.filterPillTextActive,
              ]}
            >
              My City
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeFilter === 'popular' && styles.filterPillActive]}
            onPress={() => setActiveFilter('popular')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'popular' && styles.filterPillTextActive,
              ]}
            >
              Popular
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Requests List ─── */}
        <View style={styles.cardsList}>
          {availableList.map(req => {
            const isSaved = bookmarked[req.id];
            const distance = req.distanceKm ? `${req.distanceKm} km away` : '1.2 km away';

            return (
              <View key={req.id} style={styles.cardContainer}>
                {/* Image Banner with Distance Badge */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: '/pages/request-details',
                      params: { id: req.id },
                    } as any)
                  }
                >
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{
                        uri:
                          req.areaPhotos[0] ||
                          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
                      }}
                      style={styles.cardImage}
                    />
                    <View style={styles.distanceBadge}>
                      <Icon name="map-pin" size={11} color="#0B3B24" />
                      <Text style={styles.distanceText}>{distance}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Card Content */}
                <View style={styles.cardBody}>
                  <View style={styles.metaRow}>
                    <Text style={styles.requestId}>#{req.id}</Text>
                    <TouchableOpacity
                      onPress={() => toggleBookmark(req.id)}
                      style={styles.bookmarkBtn}
                    >
                      <Icon
                        name="bookmark"
                        size={18}
                        color={isSaved ? '#0B3B24' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/pages/request-details',
                        params: { id: req.id },
                      } as any)
                    }
                  >
                    <Text style={styles.cardTitle}>{req.title}</Text>
                    <Text style={styles.cardAddress} numberOfLines={1}>
                      {req.manualAddress || req.location}
                    </Text>
                    <Text style={styles.cardSnippet} numberOfLines={2}>
                      {req.description}
                    </Text>
                  </TouchableOpacity>

                  {/* Accept Request Button */}
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    activeOpacity={0.85}
                    onPress={() => handleAccept(req.id, req.title)}
                  >
                    <Text style={styles.acceptBtnText}>Accept Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Load More Button */}
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={() => alert('All current verified requests loaded')}
        >
          <Text style={styles.loadMoreText}>Load More Requests ⌄</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/pages/create-request' as any)}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 6,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  pageHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardsList: {
    gap: 18,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 150,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 239, 225, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  cardBody: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  bookmarkBtn: {
    padding: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  cardAddress: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cardSnippet: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  acceptBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 14,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadMoreBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#0B3B24',
    marginTop: 20,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});

