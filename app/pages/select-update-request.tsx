/**
 * Volunteer Select Request For Update Screen
 * 
 * Allows the volunteer to first choose which assigned plantation request
 * they want to upload before/after photos and progress for.
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { PlantationRequest } from '@/types';

type FilterTab = 'all' | 'in_progress' | 'scheduled' | 'assigned';

export default function SelectUpdateRequestScreen() {
  const { requests, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  // Requests assigned to volunteer or currently active
  const myAssignedRequests = useMemo(() => {
    return requests.filter(
      r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
    );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return myAssignedRequests.filter(req => {
      if (filter !== 'all' && req.status !== filter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q)
      );
    });
  }, [myAssignedRequests, filter, search]);

  const handleSelectRequest = (req: PlantationRequest) => {
    router.push({
      pathname: '/pages/upload-activity',
      params: { id: req.id },
    } as any);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Select Request to Update</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Guide Banner */}
        <View style={styles.guideCard}>
          <View style={styles.stepIndicatorRow}>
            <View style={styles.stepBadgeActive}>
              <Text style={styles.stepBadgeTextActive}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepBadgeInactive}>
              <Text style={styles.stepBadgeTextInactive}>2</Text>
            </View>
          </View>
          <View style={styles.guideTextCol}>
            <Text style={styles.guideTitle}>Step 1: Choose Plantation</Text>
            <Text style={styles.guideDesc}>
              Select the assigned site where you are planting saplings or taking photos.
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, location or ID..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({myAssignedRequests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'in_progress' && styles.filterPillActive]}
            onPress={() => setFilter('in_progress')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'in_progress' && styles.filterTextActive,
              ]}
            >
              In Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'scheduled' && styles.filterPillActive]}
            onPress={() => setFilter('scheduled')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'scheduled' && styles.filterTextActive,
              ]}
            >
              Scheduled
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'assigned' && styles.filterPillActive]}
            onPress={() => setFilter('assigned')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'assigned' && styles.filterTextActive,
              ]}
            >
              Assigned
            </Text>
          </TouchableOpacity>
        </View>

        {/* Request Cards List */}
        {filteredRequests.length > 0 ? (
          <View style={styles.listContainer}>
            {filteredRequests.map(item => {
              const statusColor =
                item.status === 'in_progress'
                  ? '#D97706'
                  : item.status === 'scheduled'
                  ? '#2563EB'
                  : '#0D4E2B';
              const statusBg =
                item.status === 'in_progress'
                  ? '#FEF3C7'
                  : item.status === 'scheduled'
                  ? '#DBEAFE'
                  : '#E8F5E9';
              const statusLabel =
                item.status === 'in_progress'
                  ? 'In Progress'
                  : item.status === 'scheduled'
                  ? 'Scheduled'
                  : 'Assigned';

              const photoUrl =
                item.areaPhotos?.[0] ||
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.requestCard}
                  activeOpacity={0.88}
                  onPress={() => handleSelectRequest(item)}
                >
                  <Image source={{ uri: photoUrl }} style={styles.cardThumb} />

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardReqId}>#{item.id.toUpperCase()}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <View style={styles.locationRow}>
                      <Icon name="map-pin" size={13} color="#6B7280" />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.selectActionText}>Add Updates & Photos</Text>
                      <Icon name="chevron-right" size={16} color="#0D4E2B" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="plant" size={32} color="#0D4E2B" />
            </View>
            <Text style={styles.emptyTitle}>No Active Plantations Assigned</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any requests assigned to you yet. Accept a verified request
              from the open pool to begin planting and logging updates.
            </Text>
            <TouchableOpacity
              style={styles.browseAvailableBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/(volunteer)/available' as any)}
            >
              <Text style={styles.browseAvailableText}>Browse Available Requests</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer Browse Alternative */}
        {filteredRequests.length > 0 && (
          <TouchableOpacity
            style={styles.footerBrowseRow}
            onPress={() => router.push('/(volunteer)/available' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.footerBrowseText}>
              Want to take on another drive? Browse available requests →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFE9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    gap: 12,
  },
  stepIndicatorRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  stepBadgeActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepLine: {
    width: 2,
    height: 8,
    backgroundColor: '#D1D5DB',
  },
  stepBadgeInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeTextInactive: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  guideTextCol: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  guideDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#0D4E2B',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    gap: 12,
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardThumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardReqId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  selectActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D4E2B',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  browseAvailableBtn: {
    backgroundColor: '#0D4E2B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  browseAvailableText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footerBrowseRow: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerBrowseText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

