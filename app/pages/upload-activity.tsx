/**
 * Volunteer Upload Plantation Activity Screen — Aanandvan
 *
 * Streamlined initial plantation reporting:
 * - Active selected request banner with ID and title
 * - Single "Plantation Site Photos" section (no confusing before/after split)
 * - Auto-filled plantation date (Today)
 * - Number of Saplings Planted counter
 * - Plantation Notes textarea
 * - Synchronized Citizen & Admin notification dispatch
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function UploadActivityScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, volunteerUploadActivity } = useApp();

  // Find requested or first assigned request
  const assignedList = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  );
  const req = (id ? requests.find(r => r.id === id) : null) || assignedList[0] || requests[0];

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const [saplingsCount, setSaplingsCount] = useState(5);
  const [date, setDate] = useState(`Today (${todayStr})`);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
  ]);

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop&q=80',
    ];
    setPhotos(prev => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
  };

  const handlePost = () => {
    if (!req) {
      Alert.alert('No Request Selected', 'Please select a plantation request first.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert(
        'Photos Required',
        'Please upload at least one photo documenting the planted saplings and protective guards.'
      );
      return;
    }

    volunteerUploadActivity(req.id, {
      photos,
      beforePhotos: photos,
      afterPhotos: photos,
      saplingsPlanted: saplingsCount,
      date,
      notes: notes.trim() || 'Saplings successfully planted with protective guard, vermicompost, and initial watering.',
    });

    router.replace({
      pathname: '/pages/request-details',
      params: { id: req.id },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Upload Plantation Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Active Request Selection Banner ─── */}
        <View style={styles.activeReqCard}>
          <View style={styles.activeReqLeft}>
            <View style={styles.activeReqHeader}>
              <Text style={styles.activeReqId}>#{req?.id?.toUpperCase()}</Text>
              <View style={styles.statusPillSmall}>
                <Text style={styles.statusPillSmallText}>
                  {req?.status === 'in_progress'
                    ? 'In Progress'
                    : req?.status === 'scheduled'
                    ? 'Scheduled'
                    : 'Assigned'}
                </Text>
              </View>
            </View>
            <Text style={styles.activeReqTitle} numberOfLines={1}>
              {req?.title}
            </Text>
            <View style={styles.activeReqLocationRow}>
              <Icon name="map-pin" size={12} color="#0D4E2B" />
              <Text style={styles.activeReqLocation} numberOfLines={1}>
                {req?.location}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Plantation Site Photos (Clean Single Section) ─── */}
        <View style={styles.bannerGreen}>
          <Icon name="plant" size={16} color="#FFFFFF" />
          <Text style={styles.bannerGreenText}>Plantation Site Photos</Text>
        </View>

        <View style={styles.photoSlotsContainer}>
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoWrap}>
              <Image source={{ uri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => handleRemovePhoto(idx)}
              >
                <Icon name="close" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 4 && (
            <TouchableOpacity
              style={styles.dashedSlot}
              onPress={handleAddPhoto}
            >
              <Icon name="camera" size={22} color="#0B3B24" />
              <Text style={styles.dashedSlotLabel}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Form Fields Card ─── */}
        <View style={styles.formCard}>
          {/* Stepper Counter */}
          <Text style={styles.inputLabel}>Number of Saplings Planted</Text>
          <View style={styles.stepperPill}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setSaplingsCount(c => Math.max(1, c - 1))}
            >
              <Text style={styles.stepBtnMinus}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepValue}>{saplingsCount}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnPlus]}
              onPress={() => setSaplingsCount(c => c + 1)}
            >
              <Text style={styles.stepBtnPlusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Date of Plantation (Auto-filled) */}
          <Text style={[styles.inputLabel, { marginTop: 18 }]}>Date of Plantation</Text>
          <View style={styles.dateInputBox}>
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="e.g. 21 Nov 2026"
            />
            <Icon name="calendar" size={18} color="#0B3B24" />
          </View>

          {/* Plantation Notes */}
          <Text style={[styles.inputLabel, { marginTop: 18 }]}>Plantation & Soil Notes</Text>
          <TextInput
            style={styles.notesTextarea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Record tree species planted, soil condition, tree guard setup, and initial watering notes for the citizen & admin..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ─── Notification Dispatch Notice ─── */}
        <View style={styles.noticeBox}>
          <Icon name="check-circle" size={16} color="#0B3B24" />
          <Text style={styles.noticeText}>
            Submitting marks this drive as planted. Both Kartik Vichare (Citizen) and Aanandvan Admin will see this update in the request thread.
          </Text>
        </View>

        {/* ─── Primary Submit CTA ─── */}
        <TouchableOpacity
          style={styles.postBtn}
          activeOpacity={0.88}
          onPress={handlePost}
        >
          <Text style={styles.postBtnText}>Post Plantation Update & Notify</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 48,
  },
  activeReqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  activeReqLeft: {
    flex: 1,
  },
  activeReqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activeReqId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  statusPillSmall: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusPillSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  activeReqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  activeReqLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeReqLocation: {
    fontSize: 12,
    color: '#4B5563',
  },
  bannerGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#163E2B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  bannerGreenText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  photoSlotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  photoWrap: {
    width: 88,
    height: 88,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedSlot: {
    width: 88,
    height: 88,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedSlotLabel: {
    fontSize: 10,
    color: '#163E2B',
    fontWeight: '600',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    width: 140,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnMinus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  stepBtnPlus: {
    backgroundColor: '#163E2B',
  },
  stepBtnPlusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  notesTextarea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    minHeight: 80,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 18,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  postBtn: {
    height: 44,
    backgroundColor: '#163E2B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
