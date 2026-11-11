import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
import { RejectVolunteerModal } from '@/components/admin/RejectVolunteerModal';
import { useApp } from '@/context/AppContext';

export default function VolunteerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { volunteers, approveVolunteer, rejectVolunteer, saveVolunteerAdminNote } = useApp();

  const vol = useMemo(() => {
    if (!id) return volunteers[0];
    return volunteers.find((v) => v.id === id) ?? volunteers[0];
  }, [id, volunteers]);

  const [adminNote, setAdminNote] = useState(vol?.adminNotes || '');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  if (!vol) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Volunteer application</Text>
        </View>
      </SafeAreaView>
    );
  }

  const badge =
    vol.status === 'verified'
      ? { label: 'Approved', bg: '#CCF2DB', fg: '#0D4E2B' }
      : vol.status === 'rejected'
        ? { label: 'Rejected', bg: '#FEE2E2', fg: '#B91C1C' }
        : { label: 'Verification pending', bg: '#FBF0C4', fg: '#92580A' };

  const handleOpenMap = () => {
    const q = encodeURIComponent(vol.coordinates || vol.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const handleSaveRemark = () => {
    saveVolunteerAdminNote(vol.id, adminNote);
    if (Platform.OS !== 'web') {
      Alert.alert('Remark Saved', 'Internal admin remarks updated.');
    }
  };

  const handleApprove = () => {
    approveVolunteer(vol.id);
    if (Platform.OS === 'web') {
      router.back();
      return;
    }
    Alert.alert('Approved', `${vol.name} is now a verified volunteer.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleReject = () => {
    setRejectModalVisible(true);
  };

  const handleConfirmReject = (reason: string, message: string) => {
    if (message || reason) {
      saveVolunteerAdminNote(vol.id, `${reason}${message ? ` — ${message}` : ''}`);
    }
    rejectVolunteer(vol.id);
    setRejectModalVisible(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Volunteer application</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Applicant Summary */}
        <View style={styles.profileCenter}>
          {vol.avatar ? (
            <Image source={{ uri: vol.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          <Text style={styles.applicantName}>{vol.name}</Text>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.fg }]}>{badge.label}</Text>
          </View>

          <Text style={styles.appliedText}>Applied on: {vol.appliedDate}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Personal information</Text>

          <Text style={styles.fieldLabel}>Full name</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{vol.name}</Text>
          </View>

          <Text style={styles.fieldLabel}>Mobile no.</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{vol.phone}</Text>
          </View>

          <Text style={styles.fieldLabel}>Email address</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{vol.email}</Text>
          </View>

          <Text style={styles.fieldLabel}>Pincode</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{vol.pincode}</Text>
          </View>

          <Text style={styles.fieldLabel}>Current address</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{vol.address}</Text>
          </View>

          <Text style={styles.fieldLabel}>Location</Text>
          <TouchableOpacity
            style={styles.locationBox}
            onPress={handleOpenMap}
            activeOpacity={0.8}
          >
            <View style={styles.locationLeft}>
              <Icon name="map-pin" size={16} color="#0D4E2B" />
              <Text style={styles.locationCoords}>{vol.coordinates}</Text>
            </View>
            <Icon name="share" size={16} color="#0D4E2B" />
          </TouchableOpacity>
        </View>

        {/* Volunteer's Vision */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Volunteer's vision</Text>
          <View style={styles.visionQuoteBox}>
            <Text style={styles.visionText}>{`"${vol.visionQuote}"`}</Text>
          </View>
        </View>

        {/* Admin Remarks */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Admin remarks</Text>
          <TextInput
            style={styles.remarksInput}
            multiline
            placeholder="For internal purpose only..."
            placeholderTextColor="#8B968F"
            value={adminNote}
            onChangeText={setAdminNote}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.saveRemarkBtn}
            onPress={handleSaveRemark}
            activeOpacity={0.8}
          >
            <Text style={styles.saveRemarkText}>Save remark</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={handleApprove}
          activeOpacity={0.85}
        >
          <Text style={styles.approveBtnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={handleReject}
          activeOpacity={0.8}
        >
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
      </View>

      <RejectVolunteerModal
        visible={rejectModalVisible}
        applicantName={vol.name}
        onConfirmReject={handleConfirmReject}
        onClose={() => setRejectModalVisible(false)}
      />
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
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D4325',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
    gap: 16,
  },
  profileCenter: {
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarImg: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ECEFE9',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ECEFE9',
    marginBottom: 10,
  },
  applicantName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  appliedText: {
    fontSize: 12,
    color: '#6E7B73',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEEE7',
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163020',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#5F6C64',
    marginBottom: 6,
  },
  readOnlyBox: {
    borderWidth: 1,
    borderColor: '#DCE2DA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  readOnlyText: {
    fontSize: 14,
    color: '#2B3E33',
    lineHeight: 20,
  },
  locationBox: {
    borderWidth: 1,
    borderColor: '#DCE2DA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationCoords: {
    fontSize: 13.5,
    color: '#163020',
    textDecorationLine: 'underline',
  },
  visionQuoteBox: {
    borderWidth: 1,
    borderColor: '#E5EAE2',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAFBF9',
  },
  visionText: {
    fontSize: 13.5,
    lineHeight: 20,
    fontStyle: 'italic',
    color: '#4F5C54',
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#DCE2DA',
    borderRadius: 10,
    padding: 14,
    minHeight: 94,
    fontSize: 13.5,
    color: '#163020',
    marginBottom: 14,
  },
  saveRemarkBtn: {
    height: 44,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveRemarkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EAEEE7',
  },
  approveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#0D4E2B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});
