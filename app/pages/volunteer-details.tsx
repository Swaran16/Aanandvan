/**
 * Admin Volunteer Details Screen — Aanandvan
 *
 * Full administrative volunteer verification & management:
 * - Unique Volunteer Code (VOL-DAD-0104)
 * - Complete registration details: Bio / Motivation, Contact, Dadar Address, Pincode
 * - Drive metrics: Accepted, Ongoing, Completed, Last active date
 * - Approve action (no Reject button per user request)
 * - Block Volunteer modal: Admin specifies reason, ongoing requests are unassigned & re-published
 * - Unblock Volunteer action
 */

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VolunteerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    volunteers,
    approveVolunteer,
    blockVolunteer,
    unblockVolunteer,
    saveVolunteerAdminNote,
  } = useApp();

  const vol = useMemo(() => {
    if (!id) return volunteers[0];
    return volunteers.find((v) => v.id === id) ?? volunteers[0];
  }, [id, volunteers]);

  const [adminNote, setAdminNote] = useState(vol?.adminNotes || '');
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  if (!vol) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#0B3B24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Volunteer Profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPending = vol.status === 'pending';
  const isBlocked = !!vol.isBlocked;
  const volCode = vol.volunteerCode || `VOL-DAD-${vol.id.slice(-4).toUpperCase()}`;

  const handleOpenMap = () => {
    const q = encodeURIComponent(vol.coordinates || vol.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const handleApprove = () => {
    approveVolunteer(vol.id);
    if (Platform.OS === 'web') {
      router.back();
      return;
    }
    Alert.alert('Volunteer Approved', `${vol.name} has been verified with ID ${volCode}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleBlockConfirm = () => {
    if (!blockReason.trim()) {
      Alert.alert('Reason Required', 'Please provide a reason for suspending this volunteer.');
      return;
    }

    blockVolunteer(vol.id, blockReason.trim());
    setBlockModalVisible(false);

    Alert.alert(
      'Volunteer Suspended',
      `${vol.name} has been blocked. All ongoing drives assigned to this volunteer have been returned to the open pool for other volunteers.`,
      [{ text: 'OK' }]
    );
  };

  const handleUnblock = () => {
    unblockVolunteer(vol.id);
    Alert.alert('Volunteer Reactivated', `${vol.name} can now view and accept drives again.`);
  };

  const handleSaveRemark = () => {
    saveVolunteerAdminNote(vol.id, adminNote);
    Alert.alert('Saved', 'Internal administrative note saved.');
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
        <Text style={styles.headerTitle}>Volunteer Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <Image
            source={{
              uri:
                vol.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.avatarImg}
          />
          <Text style={styles.applicantName}>{vol.name}</Text>
          <Text style={styles.volCodeText}>{volCode}</Text>

          <View
            style={[
              styles.statusBadge,
              isBlocked
                ? { backgroundColor: '#FEE2E2' }
                : isPending
                ? { backgroundColor: '#FEF3C7' }
                : { backgroundColor: '#DCFCE7' },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isBlocked
                  ? { color: '#991B1B' }
                  : isPending
                  ? { color: '#92400E' }
                  : { color: '#166534' },
              ]}
            >
              {isBlocked
                ? 'Account Suspended / Blocked'
                : isPending
                ? 'Verification Pending'
                : 'Verified & Active'}
            </Text>
          </View>
        </View>

        {/* Blocked Reason Card (if blocked) */}
        {isBlocked && (
          <View style={styles.blockedAlert}>
            <Icon name="alert-triangle" size={18} color="#991B1B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.blockedAlertTitle}>Suspension Details</Text>
              <Text style={styles.blockedAlertText}>
                Reason: {vol.blockReason || 'Under administrative review'}
              </Text>
              <Text style={styles.blockedAlertSub}>
                All previously assigned ongoing requests were released back to the verified pool.
              </Text>
            </View>
          </View>
        )}

        {/* Drive Performance Metrics */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Drive Performance & Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{vol.acceptedDrivesCount ?? 4}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#0369A1' }]}>
                {vol.ongoingDrivesCount ?? (isBlocked ? 0 : 1)}
              </Text>
              <Text style={styles.statLabel}>Ongoing</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#15803D' }]}>
                {vol.completedDrivesCount ?? 3}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
          <Text style={styles.lastActiveText}>Last active: {vol.lastActiveDate || '3 days ago'}</Text>
        </View>

        {/* Volunteer Bio / Description Submitted at Registration */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>About & Volunteer Description</Text>
          <Text style={styles.bioText}>
            "{vol.bio || vol.visionQuote || 'Passionate about native urban afforestation and community tree nurturing across Dadar & Mumbai.'}"
          </Text>
        </View>

        {/* Registration Contact & Residential Data */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Registration & Contact Details</Text>

          <Text style={styles.fieldLabel}>Mobile number</Text>
          <Text style={styles.fieldValue}>{vol.phone || '+91 98123 45678'}</Text>

          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Email ID</Text>
          <Text style={styles.fieldValue}>{vol.email || 'volunteer@aanandvan.in'}</Text>

          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Residential Address</Text>
          <Text style={styles.fieldValue}>{vol.address || '14, Ranade Road, Dadar West, Mumbai'}</Text>

          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Pin code</Text>
          <Text style={styles.fieldValue}>{vol.pincode || '400028'}</Text>

          <TouchableOpacity style={styles.mapBtn} onPress={handleOpenMap} activeOpacity={0.8}>
            <Icon name="map-pin" size={15} color="#0B3B24" />
            <Text style={styles.mapBtnText}>View Dadar Location on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Administrative Remarks */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Administrative Notes (Internal)</Text>
          <TextInput
            style={styles.remarksInput}
            multiline
            placeholder="Record internal verification notes, performance remarks, or zone preferences..."
            placeholderTextColor="#9CA3AF"
            value={adminNote}
            onChangeText={setAdminNote}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.saveNoteBtn}
            onPress={handleSaveRemark}
            activeOpacity={0.8}
          >
            <Text style={styles.saveNoteText}>Save Admin Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Footer Action Bar ─── */}
      <View style={styles.footer}>
        {isPending ? (
          // Pending Verification: ONLY Approve button (Reject button removed per user instruction)
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={handleApprove}
            activeOpacity={0.88}
          >
            <Text style={styles.approveBtnText}>Approve & Issue Volunteer ID</Text>
          </TouchableOpacity>
        ) : isBlocked ? (
          // Blocked: Provide Unblock action
          <TouchableOpacity
            style={styles.unblockBtn}
            onPress={handleUnblock}
            activeOpacity={0.88}
          >
            <Text style={styles.unblockBtnText}>Unblock & Reactivate Volunteer</Text>
          </TouchableOpacity>
        ) : (
          // Active: Provide Block Volunteer action
          <TouchableOpacity
            style={styles.blockBtn}
            onPress={() => setBlockModalVisible(true)}
            activeOpacity={0.85}
          >
            <Icon name="alert-triangle" size={16} color="#DC2626" />
            <Text style={styles.blockBtnText}>Suspend / Block Volunteer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── Block Volunteer Reason Modal ─── */}
      <Modal visible={blockModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Suspend Volunteer Profile</Text>
              <TouchableOpacity onPress={() => setBlockModalVisible(false)}>
                <Icon name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Suspending {vol.name} ({volCode}) will prevent them from accepting or updating drives. Any currently ongoing drives will be unassigned and returned to the open pool.
            </Text>

            <Text style={styles.modalInputLabel}>Reason for Suspension</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={3}
              placeholder="E.g. Inactive for over 30 days without notice; failed to upload mandatory watering updates for Dadar site..."
              placeholderTextColor="#9CA3AF"
              value={blockReason}
              onChangeText={setBlockReason}
              textAlignVertical="top"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setBlockModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBlockBtn}
                onPress={handleBlockConfirm}
                activeOpacity={0.88}
              >
                <Text style={styles.modalConfirmBlockText}>Confirm Suspension</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#C7EED8',
    marginBottom: 10,
  },
  applicantName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  volCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  blockedAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 14,
  },
  blockedAlertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 2,
  },
  blockedAlertText: {
    fontSize: 12.5,
    color: '#7F1D1D',
    lineHeight: 17,
  },
  blockedAlertSub: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  lastActiveText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 4,
  },
  bioText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 13.5,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  mapBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    minHeight: 72,
    marginBottom: 10,
  },
  saveNoteBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  saveNoteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EA',
  },
  approveBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unblockBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unblockBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  blockBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  blockBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
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
    color: '#991B1B',
  },
  modalDesc: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    minHeight: 80,
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
  modalConfirmBlockBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  modalConfirmBlockText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
