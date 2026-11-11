/**
 * Admin Volunteer Application Details Screen
 * Matches Batch 4 — Image 3:
 * - Initials avatar (PS) + Priya Sharma + PENDING REVIEW badge + Applied date
 * - Personal Information card (Name, Phone, Email, Pincode, Address, Coordinates with View on Map)
 * - Volunteer Vision quoted statement
 * - Admin Notes box with "Save Note"
 * - Fixed bottom action buttons: [Reject] & [Approve]
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VolunteerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { volunteers, approveVolunteer, rejectVolunteer, saveVolunteerAdminNote } = useApp();

  const vol = volunteers.find(v => v.id === id) || volunteers[0];
  const [adminNote, setAdminNote] = useState(vol.adminNotes || '');

  const initials = vol.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2);

  const handleApprove = () => {
    approveVolunteer(vol.id);
    Alert.alert('Volunteer Approved 🎉', `${vol.name} is now approved!`, [
      { text: 'Back to List', onPress: () => router.back() },
    ]);
  };

  const handleReject = () => {
    Alert.alert('Reject Application', `Are you sure you want to reject ${vol.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectVolunteer(vol.id);
          router.back();
        },
      },
    ]);
  };

  const handleSaveNote = () => {
    saveVolunteerAdminNote(vol.id, adminNote);
    Alert.alert('Note Saved', 'Admin notes have been stored securely.');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Volunteer Application</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => alert('Application log')}>
          <Icon name="settings" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header Profile Card ─── */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.applicantName}>{vol.name}</Text>
          <View
            style={[
              styles.statusPill,
              vol.status === 'verified' ? styles.statusPillVerified : styles.statusPillPending,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                vol.status === 'verified'
                  ? styles.statusPillTextVerified
                  : styles.statusPillTextPending,
              ]}
            >
              {vol.status === 'verified' ? 'VERIFIED VOLUNTEER' : 'PENDING REVIEW'}
            </Text>
          </View>

          <View style={styles.appliedRow}>
            <Icon name="calendar" size={13} color="#6B7280" />
            <Text style={styles.appliedText}>Applied: {vol.appliedDate}</Text>
          </View>
        </View>

        {/* ─── Personal Information ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <Text style={styles.fieldValue}>{vol.name}</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <View style={styles.valueRow}>
              <Icon name="phone" size={14} color="#0B3B24" />
              <Text style={styles.fieldValue}>{vol.phone}</Text>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.valueRow}>
              <Icon name="mail" size={14} color="#0B3B24" />
              <Text style={styles.fieldValue}>{vol.email}</Text>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Pincode</Text>
            <Text style={styles.fieldValue}>{vol.pincode}</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Residential Address</Text>
            <Text style={styles.fieldValue}>{vol.address}</Text>
          </View>

          <View style={[styles.fieldBlock, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.fieldLabel}>Current Location Status</Text>
            <View style={styles.locationStatusRow}>
              <View style={styles.coordsBadge}>
                <Icon name="map-pin" size={13} color="#0B3B24" />
                <Text style={styles.coordsText}>{vol.coordinates}</Text>
              </View>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>Verified</Text>
              </View>
              <TouchableOpacity
                onPress={() => alert(`Opening location: ${vol.coordinates}`)}
                style={styles.viewOnMapBtn}
              >
                <Text style={styles.viewOnMapText}>View on Map ↗</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ─── Volunteer Vision ─── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Volunteer Vision</Text>
          <View style={styles.visionBox}>
            <Text style={styles.visionQuoteText}>"{vol.visionQuote}"</Text>
          </View>
        </View>

        {/* ─── Admin Notes ─── */}
        <View style={styles.adminNotesCard}>
          <View style={styles.adminNotesHeader}>
            <Icon name="document" size={16} color="#0B3B24" />
            <Text style={styles.adminNotesTitle}>Admin Notes</Text>
          </View>
          <TextInput
            style={styles.adminNotesInput}
            multiline
            placeholder="Add internal observations about this applicant..."
            placeholderTextColor="#9CA3AF"
            value={adminNote}
            onChangeText={setAdminNote}
          />
          <TouchableOpacity style={styles.saveNoteBtn} onPress={handleSaveNote}>
            <Text style={styles.saveNoteBtnText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Fixed Bottom Actions ─── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rejectBottomBtn} onPress={handleReject}>
          <Icon name="close" size={16} color="#DC2626" />
          <Text style={styles.rejectBottomText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.approveBottomBtn} onPress={handleApprove}>
          <Icon name="check" size={16} color="#FFFFFF" />
          <Text style={styles.approveBottomText}>Approve</Text>
        </TouchableOpacity>
      </View>
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
    letterSpacing: -0.4,
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
    paddingBottom: 110,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  applicantName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusPillTextPending: {
    color: '#B45309',
  },
  statusPillTextVerified: {
    color: '#059669',
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedText: {
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 14,
  },
  fieldBlock: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  coordsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coordsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  verifiedTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  viewOnMapBtn: {
    paddingVertical: 2,
  },
  viewOnMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B3B24',
  },
  visionBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#0B3B24',
  },
  visionQuoteText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  adminNotesCard: {
    backgroundColor: '#FEFCE8',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: 20,
  },
  adminNotesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  adminNotesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#854D0E',
  },
  adminNotesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    color: '#111827',
  },
  saveNoteBtn: {
    borderWidth: 1.5,
    borderColor: '#0B3B24',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 10,
  },
  saveNoteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 12,
  },
  rejectBottomBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    height: 50,
    gap: 6,
  },
  rejectBottomText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  approveBottomBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    borderRadius: 14,
    height: 50,
    gap: 6,
  },
  approveBottomText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

