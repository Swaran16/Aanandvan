/**
 * Citizen Plantation Requests Screen (Tab 2)
 * Matches Batch 1 — Image 2 exactly:
 * - Top bar with Back arrow, Aanandvan title, Search icon
 * - Filter chips: All Requests, Pending, Verified, In Progress
 * - Title: "Plantation Requests"
 * - Subtitle: "Manage your active and historical tree planting initiatives."
 * - Dynamic cards with status pills matching full life-cycle
 * - Floating action button (+) to create request
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
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function CitizenRequestsScreen() {
  const { requests } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'verified' | 'in_progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredRequests = requests.filter(req => {
    // Filter by tab
    if (activeFilter === 'pending' && req.status !== 'pending') return false;
    if (activeFilter === 'verified' && req.status !== 'verified') return false;
    if (
      activeFilter === 'in_progress' &&
      req.status !== 'in_progress' &&
      req.status !== 'assigned' &&
      req.status !== 'scheduled'
    )
      return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push('/(citizen)' as any)}
          style={styles.backBtn}
        >
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.barTitle}>Aanandvan</Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Icon name="search" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Optional Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, name or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* ─── Filter Pills ─── */}
      <View style={styles.filtersScroll}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'pending' && styles.filterChipActive]}
          onPress={() => setActiveFilter('pending')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'pending' && styles.filterChipTextActive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'verified' && styles.filterChipActive]}
          onPress={() => setActiveFilter('verified')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'verified' && styles.filterChipTextActive,
            ]}
          >
            Verified
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'in_progress' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('in_progress')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'in_progress' && styles.filterChipTextActive,
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>
      </View>

      {/* ─── Main Content ─── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Plantation Requests</Text>
          <Text style={styles.pageSubtitle}>
            Manage your active and historical tree planting initiatives.
          </Text>
        </View>

        {/* Requests List */}
        <View style={styles.cardsContainer}>
          {filteredRequests.map(req => {
            const isPending = req.status === 'pending';
            const isVerified = req.status === 'verified';
            const isInProgress =
              req.status === 'in_progress' ||
              req.status === 'assigned' ||
              req.status === 'scheduled';
            const isCompleted = req.status === 'completed';

            const badgeBg = isPending
              ? '#D1FAE5'
              : isVerified
              ? '#DCFCE7'
              : isInProgress
              ? '#CCFBF1'
              : '#065F46';

            const badgeColor = isPending
              ? '#065F46'
              : isVerified
              ? '#047857'
              : isInProgress
              ? '#0F766E'
              : '#FFFFFF';

            const badgeLabel = isPending
              ? 'Pending'
              : isVerified
              ? 'Verified'
              : isInProgress
              ? 'In Progress'
              : 'Completed';

            return (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/pages/request-details',
                    params: { id: req.id },
                  } as any)
                }
              >
                <Image
                  source={{
                    uri:
                      req.areaPhotos[0] ||
                      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80',
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardId}>{req.id}</Text>
                    <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.badgePillText, { color: badgeColor }]}>
                        {badgeLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {req.title}
                  </Text>

                  <View style={styles.locationRow}>
                    <Icon name="map-pin" size={14} color="#6B7280" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {req.location}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>{req.createdAt}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ─── Floating Action Button (+) ─── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/pages/create-request' as any)}
      >
        <Icon name="plus" size={26} color="#FFFFFF" />
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
  barTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  searchBtn: {
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 42,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filtersScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#0B3B24',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  cardsContainer: {
    gap: 14,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
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
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
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

