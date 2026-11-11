/**
 * Admin Plantation Requests Management Screen (Tab 2)
 * Matches Batch 4 — Image 4:
 * - Summary chips: 8 Pending, 15 Verified, 23 Assigned
 * - Tabs: Pending, Verified, Assigned, Completed
 * - Sort dropdown: Sort: Newest First
 * - Request cards with photo grid + "+2 more" badge, requester avatar, Duplicate Risk indicator
 * - Actions: [Reject], [Approve], [Review →]
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function AdminRequestsScreen() {
  const { requests, verifyRequest, rejectRequest, adminApproveSchedule } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'assigned' | 'completed'>('pending');

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const verifiedCount = requests.filter(r => r.status === 'verified').length;
  const assignedCount = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  ).length;

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending' || req.status === 'scheduled';
    if (activeTab === 'verified') return req.status === 'verified';
    if (activeTab === 'assigned')
      return req.status === 'assigned' || req.status === 'in_progress' || req.status === 'scheduled';
    if (activeTab === 'completed') return req.status === 'completed';
    return true;
  });

  const handleApprove = (id: string, title: string, isScheduled?: boolean) => {
    if (isScheduled) {
      adminApproveSchedule(id);
      Alert.alert('Schedule Confirmed ✅', `Plantation drive approved for "${title}". Volunteer can now proceed!`);
    } else {
      verifyRequest(id);
      Alert.alert('Request Verified ✅', `"${title}" has been verified and is now available to volunteers!`);
    }
  };

  const handleReject = (id: string, title: string) => {
    Alert.alert('Confirm Rejection', `Are you sure you want to reject "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectRequest(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => router.push('/(admin)' as any)}
          >
            <Icon name="chevron-left" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.screenHeading}>Plantation Requests</Text>
        </View>

        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Search')}>
            <Icon name="search" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => alert('Exporting requests CSV...')}
          >
            <Icon name="share" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Summary Count Chips ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryChipsRow}
        >
          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.summaryChipText}>{pendingCount} Pending</Text>
          </View>

          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.summaryChipText}>{verifiedCount} Verified</Text>
          </View>

          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.summaryChipText}>{assignedCount} Assigned</Text>
          </View>
        </ScrollView>

        {/* ─── Tab Switcher ─── */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'pending' && styles.tabBtnTextActive,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'verified' && styles.tabBtnActive]}
            onPress={() => setActiveTab('verified')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'verified' && styles.tabBtnTextActive,
              ]}
            >
              Verified
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'assigned' && styles.tabBtnActive]}
            onPress={() => setActiveTab('assigned')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'assigned' && styles.tabBtnTextActive,
              ]}
            >
              Assigned
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'completed' && styles.tabBtnTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Sort Row ─── */}
        <View style={styles.sortRow}>
          <View style={styles.sortPill}>
            <Text style={styles.sortText}>Sort: Newest First</Text>
            <Icon name="chevron-down" size={14} color="#374151" />
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => alert('Filter options')}
          >
            <Icon name="filter" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* ─── Request Cards ─── */}
        <View style={styles.cardsContainer}>
          {filteredRequests.map(req => {
            const isScheduledAwaitingAdmin = req.status === 'scheduled';

            return (
              <View key={req.id} style={styles.card}>
                {/* Photo Grid Preview */}
                <View style={styles.photoGrid}>
                  <Image
                    source={{
                      uri:
                        req.areaPhotos[0] ||
                        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80',
                    }}
                    style={styles.gridPhoto}
                  />
                  <Image
                    source={{
                      uri:
                        req.areaPhotos[1] ||
                        'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=300&auto=format&fit=crop&q=80',
                    }}
                    style={styles.gridPhoto}
                  />
                  <Image
                    source={{
                      uri:
                        req.landmarkPhotos[0] ||
                        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&auto=format&fit=crop&q=80',
                    }}
                    style={styles.gridPhoto}
                  />
                  <View style={styles.morePhotosBox}>
                    <Text style={styles.morePhotosText}>+2 more</Text>
                  </View>
                </View>

                {/* Card Header & Content */}
                <View style={styles.cardContent}>
                  <View style={styles.metaLine}>
                    <Text style={styles.reqIdText}>#{req.id}</Text>
                    <Text style={styles.dateText}>{req.createdAt}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{req.title}</Text>
                  <Text style={styles.cardAddressSnippet} numberOfLines={2}>
                    {req.manualAddress || req.location}
                  </Text>

                  {/* Scheduled Volunteer banner if scheduled */}
                  {isScheduledAwaitingAdmin && req.schedule && (
                    <View style={styles.scheduledBanner}>
                      <Icon name="calendar" size={14} color="#0B3B24" />
                      <Text style={styles.scheduledBannerText}>
                        Volunteer scheduled drive for {req.schedule.date} (
                        {req.schedule.timeSlot})
                      </Text>
                    </View>
                  )}

                  {/* Citizen Submitter */}
                  <View style={styles.submitterRow}>
                    <Image
                      source={{
                        uri:
                          req.citizenAvatar ||
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                      }}
                      style={styles.submitterAvatar}
                    />
                    <Text style={styles.submitterText}>
                      Submitted by: {req.citizenName}
                    </Text>
                  </View>

                  {/* Duplicate Risk & Action Buttons */}
                  <View style={styles.bottomActionsRow}>
                    <View style={styles.riskBadgeRow}>
                      <View style={styles.greenBar} />
                      <Text style={styles.riskText}>
                        Duplicate Risk: None detected
                      </Text>
                    </View>

                    <View style={styles.actionButtonsGroup}>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleReject(req.id, req.title)}
                      >
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() =>
                          handleApprove(
                            req.id,
                            req.title,
                            isScheduledAwaitingAdmin
                          )
                        }
                      >
                        <Text style={styles.approveBtnText}>
                          {isScheduledAwaitingAdmin ? 'Confirm' : 'Approve'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.reviewBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/pages/admin-review-request',
                            params: { id: req.id },
                          } as any)
                        }
                      >
                        <Text style={styles.reviewBtnText}>Review →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    padding: 4,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    gap: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  photoGrid: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  gridPhoto: {
    flex: 1,
    height: 72,
    borderRadius: 10,
  },
  morePhotosBox: {
    flex: 1,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePhotosText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  metaLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reqIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  cardAddressSnippet: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  scheduledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 10,
  },
  scheduledBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B3B24',
    flex: 1,
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  submitterAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  submitterText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomActionsRow: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  riskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenBar: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  approveBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  reviewBtn: {
    flex: 1.2,
    backgroundColor: '#0B3B24',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

