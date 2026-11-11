/**
 * Volunteer Upload Plantation Activity Screen
 * Matches Batch 2 — Image 4:
 * - Back button + Upload Plantation Activity title
 * - Before Plantation Photos (Orange section banner + 3 camera slots)
 * - After Plantation Photos (Green section banner + 3 camera slots)
 * - Number of Saplings Planted stepper counter [- 1 +]
 * - Date of Plantation calendar field
 * - Plantation Notes textarea
 * - Light green guidance banner
 * - "Post Plantation Update" primary CTA button
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, volunteerUploadActivity } = useApp();

  const req = requests.find(r => r.id === id) || requests[0];

  const [saplingsCount, setSaplingsCount] = useState(5);
  const [date, setDate] = useState('07/16/2026');
  const [notes, setNotes] = useState('');
  const [beforePhotos, setBeforePhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&auto=format&fit=crop&q=80',
  ]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
  ]);

  const handlePost = () => {
    volunteerUploadActivity(req.id, {
      beforePhotos,
      afterPhotos,
      saplingsPlanted: saplingsCount,
      date,
      notes,
    });

    router.replace({
      pathname: '/pages/update-submitted',
      params: { id: req.id },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Upload Plantation Activity</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => alert('Options')}>
          <Icon name="settings" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Before Plantation Photos ─── */}
        <View style={styles.bannerOrange}>
          <Icon name="clock" size={16} color="#FFFFFF" />
          <Text style={styles.bannerOrangeText}>Before Plantation Photos</Text>
        </View>

        <View style={styles.photoSlotsContainer}>
          {beforePhotos.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.photoPreview} />
          ))}
          {Array.from({ length: Math.max(0, 3 - beforePhotos.length) }).map(
            (_, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dashedSlot}
                onPress={() =>
                  setBeforePhotos(prev => [
                    ...prev,
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
                  ])
                }
              >
                <Icon name="camera" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* ─── After Plantation Photos ─── */}
        <View style={styles.bannerGreen}>
          <Icon name="plant" size={16} color="#FFFFFF" />
          <Text style={styles.bannerGreenText}>After Plantation Photos</Text>
        </View>

        <View style={styles.photoSlotsContainer}>
          {afterPhotos.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.photoPreview} />
          ))}
          {Array.from({ length: Math.max(0, 3 - afterPhotos.length) }).map(
            (_, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dashedSlot}
                onPress={() =>
                  setAfterPhotos(prev => [
                    ...prev,
                    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&auto=format&fit=crop&q=80',
                  ])
                }
              >
                <Icon name="camera" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            )
          )}
        </View>

        {/* ─── Form Card ─── */}
        <View style={styles.formCard}>
          {/* Saplings Counter Stepper */}
          <Text style={styles.inputLabel}>Number of Saplings Planted</Text>
          <View style={styles.stepperPill}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setSaplingsCount(Math.max(1, saplingsCount - 1))}
            >
              <Text style={styles.stepBtnMinus}>−</Text>
            </TouchableOpacity>

            <Text style={styles.stepValue}>{saplingsCount}</Text>

            <TouchableOpacity
              style={[styles.stepBtn, styles.stepBtnPlus]}
              onPress={() => setSaplingsCount(saplingsCount + 1)}
            >
              <Text style={styles.stepBtnPlusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Date of Plantation */}
          <Text style={[styles.inputLabel, { marginTop: 18 }]}>
            Date of Plantation
          </Text>
          <View style={styles.dateInputBox}>
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
            />
            <Icon name="calendar" size={18} color="#6B7280" />
          </View>

          {/* Plantation Notes */}
          <Text style={[styles.inputLabel, { marginTop: 18 }]}>
            Plantation Notes
          </Text>
          <TextInput
            style={styles.notesTextarea}
            multiline
            placeholder="Share any specific details about the soil quality, weather conditions, or volunteer highlights..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ─── Info Tips Banner ─── */}
        <View style={styles.infoBanner}>
          <Icon name="info" size={18} color="#059669" />
          <Text style={styles.infoBannerText}>
            Ensure your photos are clear and well-lit. "Before" photos should
            show the empty patch, while "After" photos should clearly show the
            saplings in their new home.
          </Text>
        </View>

        {/* ─── Primary CTA ─── */}
        <TouchableOpacity
          style={styles.primaryPostBtn}
          activeOpacity={0.85}
          onPress={handlePost}
        >
          <Icon name="upload" size={20} color="#FFFFFF" />
          <Text style={styles.primaryPostBtnText}>Post Plantation Update</Text>
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
    paddingBottom: 40,
  },
  bannerOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  bannerOrangeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bannerGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A2F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginTop: 14,
    marginBottom: 10,
  },
  bannerGreenText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  photoSlotsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 10,
  },
  photoPreview: {
    flex: 1,
    height: 85,
    borderRadius: 12,
  },
  dashedSlot: {
    flex: 1,
    height: 85,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    padding: 4,
    width: 170,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnMinus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  stepValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  stepBtnPlus: {
    backgroundColor: '#0B3B24',
  },
  stepBtnPlusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  notesTextarea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    height: 90,
    textAlignVertical: 'top',
    fontSize: 13,
    color: '#111827',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#D1FAE5',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  primaryPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    borderRadius: 16,
    height: 54,
    gap: 8,
    marginTop: 20,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryPostBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

