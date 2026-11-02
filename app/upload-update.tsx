/**
 * Upload Plantation Activity Screen — Aanandvan
 *
 * Allows volunteers to upload before/after plantation photos,
 * number of saplings planted, date of plantation, and notes.
 *
 * Matches Figma: orange "Before" photo section header,
 * green "After" photo section header, counter for saplings,
 * date picker, notes textarea, info banner, and
 * "Post Plantation Update" CTA button.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - Spacing[5] * 2 - Spacing[3] * 2) / 3;

// ─── Component ───────────────────────────────────────────────────────────────

export default function UploadUpdateScreen() {
  const [saplingCount, setSaplingCount] = useState(1);
  const [plantationDate, setPlantationDate] = useState('07/16/2026');
  const [notes, setNotes] = useState('');
  const [beforePhotos, setBeforePhotos] = useState<(null)[]>([null, null, null]);
  const [afterPhotos, setAfterPhotos] = useState<(null)[]>([null, null, null]);

  const incrementSaplings = () => setSaplingCount((prev) => prev + 1);
  const decrementSaplings = () => setSaplingCount((prev) => Math.max(1, prev - 1));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Upload Plantation</Text>
            <Text style={styles.headerTitle}>Activity</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Before Plantation Photos ─── */}
        <View style={styles.photoSection}>
          <View style={[styles.photoSectionHeader, styles.beforeHeader]}>
            <Text style={styles.photoSectionIcon}>⏱</Text>
            <Text style={styles.photoSectionTitle}>Before Plantation Photos</Text>
          </View>
          <View style={styles.photoGrid}>
            {beforePhotos.map((_, i) => (
              <TouchableOpacity
                key={`before-${i}`}
                style={styles.photoPlaceholder}
                activeOpacity={0.7}
              >
                <View style={styles.cameraIconWrap}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── After Plantation Photos ─── */}
        <View style={styles.photoSection}>
          <View style={[styles.photoSectionHeader, styles.afterHeader]}>
            <Text style={styles.photoSectionIcon}>✅</Text>
            <Text style={[styles.photoSectionTitle, { color: Colors.white }]}>
              After Plantation Photos
            </Text>
          </View>
          <View style={styles.photoGrid}>
            {afterPhotos.map((_, i) => (
              <TouchableOpacity
                key={`after-${i}`}
                style={styles.photoPlaceholder}
                activeOpacity={0.7}
              >
                <View style={styles.cameraIconWrap}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Form Section ─── */}
        <View style={styles.formCard}>
          {/* Sapling Counter */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Number of Saplings Planted</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={[styles.counterBtn, styles.counterBtnMinus]}
                onPress={decrementSaplings}
                activeOpacity={0.7}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.counterDisplay}>
                <Text style={styles.counterValue}>{saplingCount}</Text>
              </View>
              <TouchableOpacity
                style={[styles.counterBtn, styles.counterBtnPlus]}
                onPress={incrementSaplings}
                activeOpacity={0.7}
              >
                <Text style={[styles.counterBtnText, { color: Colors.white }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date of Plantation */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Date of Plantation</Text>
            <TouchableOpacity style={styles.dateInput} activeOpacity={0.7}>
              <Text style={styles.dateText}>{plantationDate}</Text>
              <Text style={styles.dateIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Plantation Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Plantation Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Share any specific details about the soil quality, weather conditions, or volunteer highlights..."
              placeholderTextColor={Colors.textDisabled}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* ─── Info Banner ─── */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>ℹ</Text>
          </View>
          <Text style={styles.infoText}>
            Ensure your photos are clear and well-lit. "Before" photos should show the empty patch,
            while "After" photos should clearly show the saplings in their new home.
          </Text>
        </View>

        {/* Bottom spacing for CTA */}
        <View style={{ height: Spacing[20] }} />
      </ScrollView>

      {/* ─── Bottom CTA ─── */}
      <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
          <Text style={styles.ctaIcon}>📤</Text>
          <Text style={styles.ctaText}>Post Plantation Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeTop: { backgroundColor: Colors.background },

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
  headerCenter: {
    flex: 1,
    marginLeft: Spacing[2],
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: FontSize.xl * 1.25,
  },
  menuBtn: { padding: 6 },
  menuIcon: { fontSize: 20, color: Colors.textPrimary },

  // Scroll
  scrollWrap: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
  },

  // Photo Sections
  photoSection: {
    marginBottom: Spacing[5],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    ...Shadow.sm,
  },
  photoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  beforeHeader: {
    backgroundColor: '#F97316',
  },
  afterHeader: {
    backgroundColor: Colors.brandPrimary,
  },
  photoSectionIcon: { fontSize: 14, color: Colors.white },
  photoSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: Spacing[3],
    padding: Spacing[4],
  },
  photoPlaceholder: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
  cameraIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  cameraIcon: { fontSize: 18 },

  // Form
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[5],
    marginBottom: Spacing[5],
    ...Shadow.sm,
  },
  formGroup: {
    gap: Spacing[3],
  },
  formLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },

  // Counter
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnMinus: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray300,
  },
  counterBtnPlus: {
    backgroundColor: Colors.brandPrimary,
  },
  counterBtnText: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  counterDisplay: {
    minWidth: 48,
    alignItems: 'center',
  },
  counterValue: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // Date
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    height: 48,
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  dateIcon: { fontSize: 18, opacity: 0.5 },

  // Notes
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    minHeight: 110,
    lineHeight: 20,
    backgroundColor: Colors.white,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[5],
  },
  infoIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoIcon: {
    fontSize: 14,
    color: Colors.white,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaBtn: {
    backgroundColor: Colors.brandAccent,
    borderRadius: BorderRadius['3xl'],
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    ...Shadow.md,
  },
  ctaIcon: { fontSize: 18 },
  ctaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
