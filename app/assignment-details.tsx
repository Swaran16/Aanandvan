/**
 * Assignment Details Screen — Aanandvan
 *
 * Detailed view of an assigned plantation request.
 * Shows: status badge, request ID, title, area photographs,
 * landmark photographs, location & address with map preview,
 * description, and "Upload Plantation Activity" CTA.
 *
 * Matches the Figma design with green header card, photo grid,
 * location section, and bottom action button.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - Spacing[5] * 2 - Spacing[3] * 2) / 3;

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const ASSIGNMENT = {
  refId: 'REQ-2024-0042',
  status: 'ASSIGNED',
  title: 'Oak Valley Reforestation',
  subtitle: 'Assigned Location Details',
  areaPhotos: [null, null, null, null, null],
  landmarkPhotos: [null, null],
  address: {
    full: 'Greenwood North District, Area 4B. Access via the service road near the old water tower, Sector 12, Los Angeles, CA.',
    coordinates: '34.0522° N, 118.2437° W',
    nearbyLandmark: 'Near the Old Water Tower',
  },
  description:
    '"This area requires immediate reforestation due to recent erosion. The soil is predominantly loam, suitable for White Oak. Please ensure to follow the grid planting method discussed during the briefing. Accessibility is good for small transport vehicles via the northern service road."',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AssignmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aanandvan</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollWrap}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Green Hero Card ─── */}
        <View style={styles.heroCard}>
          {/* Decorative circle */}
          <View style={styles.heroDecor} />

          <View style={styles.heroBadgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{ASSIGNMENT.status}</Text>
            </View>
            <Text style={styles.heroRefId}>#{id || ASSIGNMENT.refId}</Text>
          </View>

          <Text style={styles.heroTitle}>{ASSIGNMENT.title}</Text>
          <Text style={styles.heroSubtitle}>{ASSIGNMENT.subtitle}</Text>
        </View>

        {/* ─── Area Photographs ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📷</Text>
            <Text style={styles.sectionTitle}>Area Photographs</Text>
          </View>
          <View style={styles.photoGrid}>
            {ASSIGNMENT.areaPhotos.map((_, i) => (
              <View key={`area-${i}`} style={styles.photoPlaceholder}>
                <View style={styles.photoInner} />
              </View>
            ))}
          </View>
        </View>

        {/* ─── Landmark Photographs ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏛</Text>
            <Text style={styles.sectionTitle}>Landmark Photographs</Text>
          </View>
          <View style={styles.photoGrid}>
            {ASSIGNMENT.landmarkPhotos.map((_, i) => (
              <View key={`landmark-${i}`} style={styles.photoPlaceholder}>
                <View style={styles.photoInner} />
              </View>
            ))}
          </View>
        </View>

        {/* ─── Location & Address ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Location & Address</Text>
          </View>

          {/* Map Preview */}
          <View style={styles.mapPreview}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapEmoji}>🗺</Text>
              <Text style={styles.mapText}>Map Preview</Text>
            </View>
            <View style={styles.coordsBadge}>
              <Text style={styles.coordsIcon}>📍</Text>
              <Text style={styles.coordsText}>{ASSIGNMENT.address.coordinates}</Text>
            </View>
          </View>

          {/* Address Details */}
          <View style={styles.addressCard}>
            <Text style={styles.addressLabel}>Manual Address</Text>
            <Text style={styles.addressText}>{ASSIGNMENT.address.full}</Text>

            <View style={styles.landmarkRow}>
              <Text style={styles.landmarkIcon}>🏠</Text>
              <View>
                <Text style={styles.landmarkLabel}>Nearby Landmark</Text>
                <Text style={styles.landmarkText}>{ASSIGNMENT.address.nearbyLandmark}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.directionsBtn} activeOpacity={0.7}>
              <Text style={styles.directionsIcon}>◎</Text>
              <Text style={styles.directionsText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Description ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{ASSIGNMENT.description}</Text>
          </View>
        </View>

        {/* Bottom spacing for CTA */}
        <View style={{ height: Spacing[20] }} />
      </ScrollView>

      {/* ─── Bottom CTA ─── */}
      <SafeAreaView edges={['bottom']} style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/upload-update')}
        >
          <Text style={styles.ctaIcon}>📤</Text>
          <Text style={styles.ctaText}>Upload Plantation Activity</Text>
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
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  iconBtn: { padding: 6 },
  iconText: { fontSize: 18, color: Colors.textPrimary },

  // Scroll
  scrollWrap: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
  },

  // Hero Card
  heroCard: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[2],
    marginBottom: Spacing[6],
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: Colors.brandMint,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
    letterSpacing: 0.5,
  },
  heroRefId: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  heroTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.white,
    lineHeight: FontSize['2xl'] * 1.2,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.brandCream,
  },

  // Sections
  section: {
    marginBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },

  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  photoPlaceholder: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
  photoInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },

  // Map
  mapPreview: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  mapEmoji: { fontSize: 48, opacity: 0.4 },
  mapText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  coordsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  coordsIcon: { fontSize: 14 },
  coordsText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  // Address
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[4],
    ...Shadow.sm,
  },
  addressLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  landmarkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  landmarkIcon: { fontSize: 16, marginTop: 2 },
  landmarkLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  landmarkText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius['3xl'],
    borderWidth: 1.5,
    borderColor: Colors.brandAccent,
  },
  directionsIcon: {
    fontSize: 14,
    color: Colors.brandAccent,
  },
  directionsText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandAccent,
  },

  // Description
  descriptionCard: {
    backgroundColor: Colors.brandLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
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
    backgroundColor: Colors.brandPrimary,
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
