/**
 * Available Requests Screen — Aanandvan
 *
 * Shows a list of plantation requests available for volunteers to accept.
 * Each card shows request type, location, distance, and urgency level.
 * Volunteers can tap a request to view details and accept it.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

// ─── Filter Options ──────────────────────────────────────────────────────────

const FILTERS = ['All', 'Planting', 'Watering', 'Maintenance'] as const;

// ─── Dummy Data ──────────────────────────────────────────────────────────────

interface RequestItem {
  id: string;
  refId: string;
  title: string;
  location: string;
  distance: string;
  type: 'Planting' | 'Watering' | 'Maintenance';
  urgency: 'High' | 'Medium' | 'Low';
  saplings: number;
  postedAgo: string;
}

const REQUESTS: RequestItem[] = [
  {
    id: '1',
    refId: 'REQ-2024-0042',
    title: 'Oak Valley Reforestation',
    location: 'Greenwood North District, Area 4B',
    distance: '2.3 km away',
    type: 'Planting',
    urgency: 'High',
    saplings: 12,
    postedAgo: '2 hours ago',
  },
  {
    id: '2',
    refId: 'REQ-2024-0039',
    title: 'Riverside Willow Maintenance',
    location: 'North Bank, Station 4',
    distance: '1.8 km away',
    type: 'Watering',
    urgency: 'Medium',
    saplings: 8,
    postedAgo: '5 hours ago',
  },
  {
    id: '3',
    refId: 'REQ-2024-0037',
    title: 'Community Orchard Expansion',
    location: 'Greenway Heights, Block C',
    distance: '4.1 km away',
    type: 'Planting',
    urgency: 'Low',
    saplings: 20,
    postedAgo: '1 day ago',
  },
  {
    id: '4',
    refId: 'REQ-2024-0035',
    title: 'Central Park Sapling Care',
    location: 'Central Park, Zone 4',
    distance: '0.8 km away',
    type: 'Maintenance',
    urgency: 'High',
    saplings: 15,
    postedAgo: '3 hours ago',
  },
  {
    id: '5',
    refId: 'REQ-2024-0031',
    title: 'School Garden Initiative',
    location: 'Lincoln High School Campus',
    distance: '3.5 km away',
    type: 'Planting',
    urgency: 'Medium',
    saplings: 10,
    postedAgo: '2 days ago',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'High':
      return { bg: Colors.errorLight, text: Colors.error };
    case 'Medium':
      return { bg: Colors.warningLight, text: Colors.warning };
    default:
      return { bg: Colors.brandMint, text: Colors.brandAccent };
  }
};

const getTypeBadgeStyle = (type: string) => {
  switch (type) {
    case 'Planting':
      return { bg: Colors.brandMint, text: Colors.brandPrimary };
    case 'Watering':
      return { bg: Colors.infoLight, text: Colors.info };
    default:
      return { bg: Colors.warningLight, text: Colors.warning };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Planting':
      return '🌱';
    case 'Watering':
      return '💧';
    default:
      return '🔧';
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AvailableRequestsScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = REQUESTS.filter((r) => {
    const matchesFilter = activeFilter === 'All' || r.type === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Requests</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ─── Search Bar ─── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location or title..."
            placeholderTextColor={Colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ─── Filters ─── */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, activeFilter === f ? styles.filterTextActive : undefined]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ─── Results Count ─── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} request{filtered.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* ─── Request Cards ─── */}
      <ScrollView
        style={styles.listWrap}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((req) => {
          const urgencyStyle = getUrgencyColor(req.urgency);
          const typeStyle = getTypeBadgeStyle(req.type);

          return (
            <TouchableOpacity
              key={req.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({ pathname: '/assignment-details', params: { id: req.refId } })
              }
            >
              {/* Top row: type badge + urgency */}
              <View style={styles.cardTopRow}>
                <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                  <Text style={styles.typeIcon}>{getTypeIcon(req.type)}</Text>
                  <Text style={[styles.typeText, { color: typeStyle.text }]}>{req.type}</Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: urgencyStyle.bg }]}>
                  <Text style={[styles.urgencyText, { color: urgencyStyle.text }]}>
                    {req.urgency}
                  </Text>
                </View>
              </View>

              {/* Title + ref */}
              <Text style={styles.cardTitle}>{req.title}</Text>
              <Text style={styles.cardRef}>#{req.refId}</Text>

              {/* Location */}
              <View style={styles.cardLocationRow}>
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.cardLocation} numberOfLines={1}>
                  {req.location}
                </Text>
              </View>

              {/* Bottom info row */}
              <View style={styles.cardBottomRow}>
                <View style={styles.infoChip}>
                  <Text style={styles.infoIcon}>🌳</Text>
                  <Text style={styles.infoText}>{req.saplings} saplings</Text>
                </View>
                <View style={styles.infoChip}>
                  <Text style={styles.infoIcon}>📏</Text>
                  <Text style={styles.infoText}>{req.distance}</Text>
                </View>
                <Text style={styles.postedText}>{req.postedAgo}</Text>
              </View>

              {/* Accept Button */}
              <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.85}>
                <Text style={styles.acceptBtnText}>View Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your filters or search query.
            </Text>
          </View>
        )}

        <View style={{ height: Spacing[8] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Header
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
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing[2],
  },
  searchIcon: { fontSize: 16, opacity: 0.5 },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    padding: 4,
  },

  // Filters
  filtersContainer: {
    marginBottom: Spacing[3],
  },
  filtersScroll: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
  },
  filterChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },

  // Results
  resultsRow: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[3],
  },
  resultsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // List
  listWrap: { flex: 1 },
  listContent: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[4],
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[3],
    ...Shadow.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  typeIcon: { fontSize: 12 },
  typeText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  urgencyBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardRef: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: -Spacing[2],
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPin: { fontSize: 13, opacity: 0.7 },
  cardLocation: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  infoIcon: { fontSize: 11 },
  infoText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  postedText: {
    fontSize: 11,
    color: Colors.textDisabled,
    marginLeft: 'auto',
  },

  // Accept
  acceptBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: BorderRadius['3xl'],
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[1],
  },
  acceptBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[16],
    gap: Spacing[3],
  },
  emptyEmoji: { fontSize: 48, opacity: 0.5 },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
