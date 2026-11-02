/**
 * Available Requests Screen — Aanandvan
 * Matches Image 1:
 *  - Header: Back arrow, "Aanandvan"
 *  - Title: "Available Requests"
 *  - Search bar: "Search by area or tree species..."
 *  - Filter pills: "Nearest", "Newest", "My City", "Popular"
 *  - Request cards with photos, distance badge, ref ID, bookmark, address, description, "Accept Request" button
 *  - "Load More Requests ∨" button
 *  - Floating Action Button (+)
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

interface RequestItem {
  id: string;
  refId: string;
  distance: string;
  title: string;
  address: string;
  description: string;
  image: any;
}

const REQUESTS: RequestItem[] = [
  {
    id: '1',
    refId: '#REQ-2024-0042',
    distance: '1.2 km away',
    title: 'Sector 14, Near City Park',
    address: '45 Green Terrace, Sector 14, Urbania',
    description:
      'Looking for a volunteer to help plant 3 Neem saplings in a community garden area. Basic tools provided on-site.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    id: '2',
    refId: '#REQ-2024-0051',
    distance: '2.5 km away',
    title: 'Greenwood Estates',
    address: 'Block C, Row 12, Greenwood Estates',
    description:
      'Residential planting project. We need help setting up a privacy hedge using native evergreen shrubs.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    refId: '#REQ-2024-0063',
    distance: '0.8 km away',
    title: 'Heritage Public School',
    address: 'Main Gate, North Campus, Heritage',
    description:
      'School beautification drive. Planting 10 flowering cherry trees along the north walkway. Great for groups.',
    image: require('../assets/images/onboarding3.png'),
  },
  {
    id: '4',
    refId: '#REQ-2024-0088',
    distance: '4.1 km away',
    title: 'Riverbank Restoration',
    address: 'Old Ferry Wharf, East Bank',
    description:
      'Help prevent soil erosion by planting native riverbank vegetation. Rough terrain, please wear sturdy boots.',
    image: require('../assets/images/req_mangrove.png'),
  },
];

const FILTERS = ['Nearest', 'Newest', 'My City', 'Popular'] as const;

export default function AvailableRequestsScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('Nearest');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAccept = (item: RequestItem) => {
    Alert.alert(
      'Request Accepted! 🌱',
      `You have accepted the assignment for "${item.title}". Let's view the location & assignment details!`,
      [
        {
          text: 'View Assignment Details',
          onPress: () => router.push('/assignment-details'),
        },
      ]
    );
  };

  const filteredRequests = REQUESTS.filter((req) => {
    if (!searchQuery) return true;
    return (
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* ─── Top Bar ─── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerBrand}>Aanandvan</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Title ─── */}
        <Text style={styles.pageTitle}>Available Requests</Text>

        {/* ─── Search Bar ─── */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by area or tree species..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Filter Pills ─── */}
        <View style={styles.filtersRow}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  style={[styles.filterPillText, isActive && styles.filterPillTextActive]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Request Cards ─── */}
        <View style={styles.cardsList}>
          {filteredRequests.map((item) => {
            const isBookmarked = !!bookmarked[item.id];
            return (
              <View key={item.id} style={styles.card}>
                {/* Top Image with Distance Badge */}
                <View style={styles.imgWrap}>
                  <Image source={item.image} style={styles.cardImg} resizeMode="cover" />
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>📍 {item.distance}</Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Ref ID & Bookmark */}
                  <View style={styles.metaRow}>
                    <Text style={styles.refId}>{item.refId}</Text>
                    <TouchableOpacity
                      onPress={() => toggleBookmark(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkIconActive]}>
                        {isBookmarked ? '🔖' : '🏷️'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Title & Address */}
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardAddress}>{item.address}</Text>

                  {/* Description */}
                  <Text style={styles.cardDesc} numberOfLines={3}>
                    {item.description}
                  </Text>

                  {/* Accept Request Button */}
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    activeOpacity={0.85}
                    onPress={() => handleAccept(item)}
                  >
                    <Text style={styles.acceptBtnText}>Accept Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* ─── Load More Button ─── */}
        <TouchableOpacity style={styles.loadMoreBtn} activeOpacity={0.75}>
          <Text style={styles.loadMoreText}>Load More Requests ∨</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ─── Floating Action Button (+) ─── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/(volunteer)/plant')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  safeTop: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: '#0F3821',
    letterSpacing: -0.4,
    marginBottom: Spacing[3],
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: Spacing[3],
    height: 48,
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: '#94A3B8',
    padding: 4,
  },

  // Filter Pills
  filtersRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  filterPill: {
    paddingHorizontal: Spacing[4],
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillActive: {
    backgroundColor: '#0F3821',
    borderColor: '#0F3821',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#334155',
  },
  filterPillTextActive: {
    color: Colors.white,
  },

  // Cards List
  cardsList: {
    gap: Spacing[5],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadow.sm,
  },
  imgWrap: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },

  cardContent: {
    padding: Spacing[4],
    gap: Spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refId: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  bookmarkIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  bookmarkIconActive: {
    opacity: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  cardAddress: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginTop: Spacing[1],
  },

  acceptBtn: {
    height: 46,
    backgroundColor: '#0F3821',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.2,
  },

  // Load More
  loadMoreBtn: {
    marginVertical: Spacing[5],
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: '#0F3821',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F3821',
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: Spacing[5],
    bottom: Spacing[5],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F3821',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});
