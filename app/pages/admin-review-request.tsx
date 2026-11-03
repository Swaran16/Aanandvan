/**
 * Admin Review & Verification Screen
 * Matches Batch 4 — Image 5:
 * - Back button + Review Request title
 * - #REQ-2024-0042 header + submission date + status pill
 * - Uploaded Area Photos & Landmark Photos with photo captions
 * - Location Card with Map, Coordinates, and Address
 * - Requester Details Card (Rahul Jayakumar / Citizen)
 * - Request Description
 * - Volunteer Scheduled details preview (if drive is scheduled)
 * - Primary CTA: "Verify & Send to Volunteers" and "Reject Request"
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function AdminReviewRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, verifyRequest, rejectRequest, adminApproveSchedule } = useApp();

  const req = requests.find(r => r.id === id) || requests[0];
  const isScheduled = req.status === 'scheduled';

  const handleVerify = () => {
    if (isScheduled) {
      adminApproveSchedule(req.id);
      Alert.alert(
        'Schedule Approved ✅',
        `The volunteer's plantation schedule for "${req.title}" has been approved! Status updated to In Progress.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      verifyRequest(req.id);
      Alert.alert(
        'Request Verified & Published ✅',
        `"${req.title}" has been verified and is now broadcasted to all local volunteers under Available Requests!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleReject = () => {
    Alert.alert('Confirm Rejection', `Are you sure you want to reject "${req.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectRequest(req.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Review Request</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => alert('Options')}>
          <Icon name="settings" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header Info ─── */}
        <View style={styles.headerBlock}>
          <Text style={styles.reqId}>#{req.id}</Text>
          <Text style={styles.subDate}>Submitted {req.createdAt}, 10:30 AM</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {req.status === 'pending'
                ? 'Pending'
                : req.status === 'scheduled'
                ? 'Schedule Pending Review'
                : req.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ─── Volunteer Scheduled Drive Preview (if scheduled) ─── */}
        {isScheduled && req.schedule && (
          <View style={styles.scheduledCard}>
            <View style={styles.scheduledHeaderRow}>
              <Icon name="calendar" size={18} color="#0B3B24" />
              <Text style={styles.scheduledTitle}>Volunteer Proposed Schedule</Text>
            </View>
            <View style={styles.scheduledInfoRow}>
              <Text style={styles.scheduledLabel}>Drive Date:</Text>
              <Text style={styles.scheduledValue}>{req.schedule.date}</Text>
            </View>
            <View style={styles.scheduledInfoRow}>
              <Text style={styles.scheduledLabel}>Time Slot:</Text>
              <Text style={styles.scheduledValue}>{req.schedule.timeSlot}</Text>
            </View>
            <View style={styles.scheduledInfoRow}>
              <Text style={styles.scheduledLabel}>Checklist Ready:</Text>
              <Text style={styles.scheduledValue}>
                {req.schedule.checklist.join(', ') || 'All standard items'}
              </Text>
            </View>
            {req.schedule.notes ? (
              <View style={styles.scheduledInfoRow}>
                <Text style={styles.scheduledLabel}>Volunteer Notes:</Text>
                <Text style={styles.scheduledValue}>"{req.schedule.notes}"</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* ─── Uploaded Area Photos ─── */}
        <Text style={styles.sectionTitle}>Uploaded Area Photos</Text>
        <View style={styles.photosRow}>
          <Image
            source={{
              uri:
                req.areaPhotos[0] ||
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.photoItem}
          />
          <Image
            source={{
              uri:
                req.areaPhotos[1] ||
                'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.photoItem}
          />
        </View>

        {/* ─── Landmark Photos ─── */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
          Landmark Photos
        </Text>
        <View style={styles.photosRow}>
          <View style={styles.landmarkWrap}>
            <Image
              source={{
                uri:
                  req.landmarkPhotos[0] ||
                  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80',
              }}
              style={styles.photoItem}
            />
            <View style={styles.captionTag}>
              <Text style={styles.captionText}>Near Community Gate</Text>
            </View>
          </View>

          <View style={styles.landmarkWrap}>
            <Image
              source={{
                uri:
                  req.landmarkPhotos[1] ||
                  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&auto=format&fit=crop&q=80',
              }}
              style={styles.photoItem}
            />
            <View style={styles.captionTag}>
              <Text style={styles.captionText}>Street Signboard</Text>
            </View>
          </View>
        </View>

        {/* ─── Location & Address ─── */}
        <View style={styles.locationCard}>
          <View style={styles.mapThumb}>
            <Icon name="navigation" size={32} color="#9CA3AF" />
            <TouchableOpacity
              style={styles.openMapsBtn}
              onPress={() => alert(`Maps opened for: ${req.coordinates}`)}
            >
              <Text style={styles.openMapsText}>Open in Maps ↗</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locDetails}>
            <View style={styles.locTitleRow}>
              <Icon name="map-pin" size={16} color="#0B3B24" />
              <Text style={styles.locMainTitle}>{req.location}</Text>
            </View>

            <Text style={styles.locFullAddress}>{req.manualAddress}</Text>

            {req.landmark && (
              <View style={styles.landmarkLine}>
                <Text style={styles.landmarkLineLabel}>Nearby Landmark</Text>
                <Text style={styles.landmarkLineValue}>{req.landmark}</Text>
              </View>
            )}

            <View style={styles.coordsLine}>
              <Text style={styles.coordsText}>
                Latitude: <Text style={{ fontWeight: '700' }}>{req.coordinates.split(',')[0]}</Text>
              </Text>
              <Text style={styles.coordsText}>
                Longitude: <Text style={{ fontWeight: '700' }}>{req.coordinates.split(',')[1] || '77.2090° E'}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Requester Details ─── */}
        <View style={styles.requesterCard}>
          <View style={styles.requesterAvatar}>
            <Text style={styles.requesterAvatarText}>
              {req.citizenName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.requesterName}>{req.citizenName}</Text>
            <Text style={styles.requesterMeta}>
              {req.citizenEmail || 'citizen@aanandvan.in'} • {req.location.split(',')[0]}
            </Text>
          </View>
        </View>

        {/* ─── Request Description ─── */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>Request Description</Text>
          <Text style={styles.descBody}>{req.description}</Text>
        </View>

        {/* ─── Actions ─── */}
        <TouchableOpacity
          style={styles.verifyMainBtn}
          activeOpacity={0.85}
          onPress={handleVerify}
        >
          <Icon name="check-circle" size={18} color="#FFFFFF" />
          <Text style={styles.verifyMainBtnText}>
            {isScheduled ? 'Approve & Confirm Drive' : 'Verify & Send to Volunteers'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectTextBtn} onPress={handleReject}>
          <Text style={styles.rejectTextBtnText}>Reject Request</Text>
        </TouchableOpacity>
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
  backBtn: {
    padding: 6,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3B24',
  },
  menuBtn: {
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
  headerBlock: {
    marginBottom: 16,
  },
  reqId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  scheduledCard: {
    backgroundColor: '#E8F5EE',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C7EED8',
    marginBottom: 18,
    gap: 8,
  },
  scheduledHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scheduledTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B3B24',
  },
  scheduledInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  scheduledLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  scheduledValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 10,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  photoItem: {
    flex: 1,
    height: 120,
    borderRadius: 14,
  },
  landmarkWrap: {
    flex: 1,
    position: 'relative',
  },
  captionTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginTop: 14,
    marginBottom: 16,
  },
  mapThumb: {
    height: 120,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  openMapsBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  openMapsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  locDetails: {
    padding: 16,
    gap: 8,
  },
  locTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  locFullAddress: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  landmarkLine: {
    marginTop: 4,
  },
  landmarkLineLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  landmarkLineValue: {
    fontSize: 13,
    color: '#0B3B24',
    fontWeight: '600',
  },
  coordsLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  coordsText: {
    fontSize: 11,
    color: '#6B7280',
  },
  requesterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 12,
    marginBottom: 16,
  },
  requesterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requesterAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  requesterName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  requesterMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 6,
  },
  descBody: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  verifyMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    borderRadius: 16,
    height: 52,
    gap: 8,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyMainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  rejectTextBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  rejectTextBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});

