/**
 * Admin Review Request Screen — Aanandvan
 *
 * Full administrative review of citizen plantation requests:
 * - Spot photographs, landmarks, and coordinates inspection
 * - "Request Clarification" modal sending specific feedback notes to citizen
 * - "Verify & Publish" navigation
 * - Once verified, hide verify/reject buttons completely
 */

import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const DEFAULT_AREA = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop',
];

const DEFAULT_LANDMARK = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
];

function chunkIntoRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function AdminReviewRequestScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, requestClarification } = useApp();

  const [clarifyModalVisible, setClarifyModalVisible] = useState(false);
  const [clarificationNotes, setClarificationNotes] = useState('');

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  if (!req) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#0B3B24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Request</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAlreadyVerified =
    req.status === 'verified' ||
    req.status === 'assigned' ||
    req.status === 'scheduled' ||
    req.status === 'in_progress' ||
    req.status === 'completed';

  const isNeedsInfo = req.status === 'needs_info';

  const areaPhotos =
    req.areaPhotos && req.areaPhotos.length >= 2
      ? req.areaPhotos
      : [...(req.areaPhotos ?? []), ...DEFAULT_AREA].slice(0, 3);

  const landmarkPhotos =
    req.landmarkPhotos && req.landmarkPhotos.length > 0
      ? req.landmarkPhotos
      : DEFAULT_LANDMARK;

  const areaRows = chunkIntoRows(areaPhotos, 3);
  const landmarkRows = chunkIntoRows(landmarkPhotos, 3);

  const handleOpenMaps = () => {
    const query = encodeURIComponent(req.coordinates || req.manualAddress || req.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleSendClarification = () => {
    if (!clarificationNotes.trim()) {
      Alert.alert('Note Required', 'Please enter feedback notes for the citizen.');
      return;
    }

    requestClarification(req.id, clarificationNotes.trim());
    setClarifyModalVisible(false);

    Alert.alert(
      'Clarification Requested',
      `Feedback notes sent to ${req.citizenName || 'Citizen'}. The request status is set to Needs Clarification.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Request</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topInfoRow}>
          <View style={styles.topInfoLeft}>
            <Text style={styles.title}>{req.title}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color="#0B3B24" />
              <Text style={styles.locationText}>{req.location}</Text>
            </View>
          </View>

          <View style={styles.topInfoRight}>
            <View
              style={[
                styles.statusBadge,
                isAlreadyVerified
                  ? { backgroundColor: '#DCFCE7' }
                  : isNeedsInfo
                  ? { backgroundColor: '#FEE2E2' }
                  : { backgroundColor: '#FEF3C7' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isAlreadyVerified
                    ? { color: '#166534' }
                    : isNeedsInfo
                    ? { color: '#B91C1C' }
                    : { color: '#92400E' },
                ]}
              >
                {isAlreadyVerified
                  ? 'Verified'
                  : isNeedsInfo
                  ? 'Clarification Needed'
                  : 'Pending Review'}
              </Text>
            </View>
            <Text style={styles.reqIdText}>#{req.id.toUpperCase()}</Text>
          </View>
        </View>

        {/* Existing Clarification Notes (if already sent) */}
        {isNeedsInfo && req.adminClarificationNotes && (
          <View style={styles.activeClarifyBox}>
            <Text style={styles.activeClarifyTitle}>Active Clarification Note to Citizen:</Text>
            <Text style={styles.activeClarifyText}>{`"${req.adminClarificationNotes}"`}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Area photographs</Text>
        <View style={styles.gridGroup}>
          {areaRows.map((row, rIdx) => (
            <View key={`area-r-${rIdx}`} style={styles.photoRow}>
              {row.map((uri, cIdx) => (
                <View key={`area-${rIdx}-${cIdx}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, eIdx) => (
                <View key={`area-e-${rIdx}-${eIdx}`} style={styles.photoSpacer} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Landmark photographs</Text>
        <View style={styles.gridGroup}>
          {landmarkRows.map((row, rIdx) => (
            <View key={`lm-r-${rIdx}`} style={styles.photoRow}>
              {row.map((uri, cIdx) => (
                <View key={`lm-${rIdx}-${cIdx}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, eIdx) => (
                <View key={`lm-e-${rIdx}-${eIdx}`} style={styles.photoSpacer} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Location Details</Text>
        <Text style={styles.metaLabel}>Full Address</Text>
        <Text style={styles.metaValue}>{req.manualAddress || req.location}</Text>

        <Text style={[styles.metaLabel, { marginTop: 10 }]}>Nearby landmark</Text>
        <Text style={styles.metaValue}>{req.landmark || 'Near Shivaji Park'}</Text>

        <TouchableOpacity
          style={styles.mapsBtn}
          onPress={handleOpenMaps}
          activeOpacity={0.8}
        >
          <Icon name="navigation" size={16} color="#0B3B24" />
          <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{`"${req.description}"`}</Text>
        </View>

        <View style={styles.submitterRow}>
          <Image
            source={{
              uri:
                req.citizenAvatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.citizenAvatar}
          />
          <View>
            <Text style={styles.submittedBy}>Submitted by: {req.citizenName || 'Kartik Vichare'}</Text>
            <Text style={styles.submittedDate}>{req.createdAt} • Citizen</Text>
          </View>
        </View>
      </ScrollView>

      {/* ─── Footer Action Bar ─── */}
      <View style={styles.footer}>
        {isAlreadyVerified ? (
          <View style={styles.verifiedBanner}>
            <Icon name="check-circle" size={18} color="#0B3B24" />
            <Text style={styles.verifiedBannerText}>
              This request is verified and published to volunteers.
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() =>
                router.push({
                  pathname: '/pages/verify-publish',
                  params: { id: req.id },
                } as any)
              }
              activeOpacity={0.88}
            >
              <Text style={styles.verifyBtnText}>Verify & Publish to Volunteers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clarifyBtn}
              onPress={() => setClarifyModalVisible(true)}
              activeOpacity={0.8}
            >
              <Icon name="help" size={16} color="#0B3B24" />
              <Text style={styles.clarifyBtnText}>Request Clarification from Citizen</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ─── Clarification Note Modal ─── */}
      <Modal visible={clarifyModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Clarification</Text>
              <TouchableOpacity onPress={() => setClarifyModalVisible(false)}>
                <Icon name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Send specific instructions to {req.citizenName || 'Kartik Vichare'} explaining what needs updating (e.g. clearer area photos, specific landmark, permission confirmation).
            </Text>

            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="E.g. Please upload a wider photo of the sidewalk and specify if this spot is directly in front of building gate 2..."
              placeholderTextColor="#9CA3AF"
              value={clarificationNotes}
              onChangeText={setClarificationNotes}
              textAlignVertical="top"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setClarifyModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSendBtn}
                onPress={handleSendClarification}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSendText}>Send to Citizen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 12,
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  topInfoLeft: {
    flex: 1,
    paddingRight: 12,
  },
  topInfoRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  reqIdText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  activeClarifyBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  activeClarifyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  activeClarifyText: {
    fontSize: 12.5,
    color: '#7F1D1D',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 8,
  },
  gridGroup: {
    gap: 8,
    marginBottom: 16,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  photoCell: {
    flex: 1,
    aspectRatio: 1.2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  photoSpacer: {
    flex: 1,
    aspectRatio: 1.2,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  metaLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13.5,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  mapsBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  citizenAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  submittedBy: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  submittedDate: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EA',
    gap: 8,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    padding: 14,
    borderRadius: 12,
  },
  verifiedBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    flex: 1,
  },
  verifyBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clarifyBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  clarifyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3B24',
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    minHeight: 100,
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalSendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#0B3B24',
  },
  modalSendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
