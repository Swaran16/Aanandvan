/**
 * Volunteer Dashboard (Home) — Aanandvan
 * Matches Image 5:
 *  - Dark green header with brand, notifications bell, avatar
 *  - "Welcome back, Amit Kumar" with "✔ Verified Volunteer" badge
 *  - 4 Stat cards (3 Assigned, 7 Available, 23 Completed, 2 Maintenance Due)
 *  - Quick Actions (Available Requests, My Assigned Work, Partnered Nurseries, Upload Update)
 *  - Priority Alerts with "Take Action" CTA
 *  - Assigned Requests carousel with photos & status pills
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

const { width } = Dimensions.get('window');

const statsData = [
  { value: '3', label: 'Assigned', isAlert: false },
  { value: '7', label: 'Available', isAlert: false },
  { value: '23', label: 'Completed', isAlert: false },
  { value: '2', label: 'Maintenance Due', isAlert: true },
];

const quickActions = [
  {
    icon: '🔍',
    label: 'Available Requests',
    desc: 'Browse & accept',
    route: '/available-requests' as const,
  },
  {
    icon: '✔',
    label: 'My Assigned Work',
    desc: 'Location & guide',
    route: '/assignment-details' as const,
  },
  {
    icon: '📤',
    label: 'Upload Update',
    desc: 'Photos & saplings',
    route: '/upload-update' as const,
  },
];

const assignedRequests = [
  {
    id: 'TR-992',
    type: 'Watering',
    location: 'Riverside Willow Maintenance',
    area: 'North Bank, Station 4',
    image: require('../../assets/images/req_mangrove.png'),
  },
  {
    id: 'TR-104',
    type: 'Planting',
    location: 'Community Orchard Expansion',
    area: 'Greenway Heights',
    image: require('../../assets/images/req_neem.png'),
  },
];

export default function VolunteerHomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ─── Dark Green Header ─── */}
      <View style={styles.headerBg}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          {/* Top row: Brand + Icons */}
          <View style={styles.topRow}>
            <View style={styles.brandRow}>
              <View style={styles.treeIconWrap}>
                <Text style={styles.treeIcon}>🌲</Text>
              </View>
              <Text style={styles.brandName}>Aanandvan</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.bellBtn} activeOpacity={0.75}>
                <Text style={styles.bellIcon}>🔔</Text>
              </TouchableOpacity>
              <View style={styles.headerAvatarWrap}>
                <Image
                  source={require('../../assets/images/onboarding1.png')}
                  style={styles.headerAvatarImg}
                />
              </View>
            </View>
          </View>

          {/* Welcome row */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back, Amit Kumar</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
              <Text style={styles.verifiedText}>Verified Volunteer</Text>
            </View>
          </View>

          {/* 4 Stat Cards Grid */}
          <View style={styles.statsGrid}>
            {statsData.map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={[styles.statValue, s.isAlert && styles.statValueAlert]}>
                  {s.value}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </View>

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => action.route && router.push(action.route)}
            >
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionEmoji}>{action.icon}</Text>
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSubLabel}>{action.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Priority Alerts */}
        <Text style={styles.sectionTitle}>Priority Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeIcon}>⚠️</Text>
              <Text style={styles.alertBadgeText}>Maintenance Due</Text>
            </View>
            <Text style={styles.alertTime}>In 2 days</Text>
          </View>

          <Text style={styles.alertTitle}>Central Park Saplings (Zone 4)</Text>
          <Text style={styles.alertDesc}>
            Watering and mulching required for 12 oak saplings after the recent dry spell.
          </Text>

          <TouchableOpacity
            style={styles.alertBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/assignment-details')}
          >
            <Text style={styles.alertBtnText}>Take Action</Text>
          </TouchableOpacity>
        </View>

        {/* Assigned Requests */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Assigned Requests</Text>
          <TouchableOpacity onPress={() => router.push('/available-requests')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.requestsScroll}
        >
          {assignedRequests.map((req) => (
            <TouchableOpacity
              key={req.id}
              style={styles.requestCard}
              activeOpacity={0.85}
              onPress={() => router.push('/assignment-details')}
            >
              <Image source={req.image} style={styles.requestImg} resizeMode="cover" />
              <View style={styles.requestInfo}>
                <View style={styles.requestBadgeRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      req.type === 'Watering' ? styles.wateringBadge : styles.plantingBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        req.type === 'Watering'
                          ? styles.wateringBadgeText
                          : styles.plantingBadgeText,
                      ]}
                    >
                      {req.type}
                    </Text>
                  </View>
                  <Text style={styles.requestId}>ID: #{req.id}</Text>
                </View>

                <Text style={styles.requestLocation} numberOfLines={1}>
                  {req.location}
                </Text>

                <View style={styles.areaRow}>
                  <Text style={styles.areaIcon}>📍</Text>
                  <Text style={styles.areaText} numberOfLines={1}>
                    {req.area}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },

  // Dark Green Header
  headerBg: {
    backgroundColor: '#0F3821',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: Spacing[5],
  },
  headerSafe: {
    paddingHorizontal: Spacing[5],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[2],
    marginBottom: Spacing[4],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  treeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeIcon: {
    fontSize: 16,
  },
  brandName: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  headerAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#34D399',
    overflow: 'hidden',
    backgroundColor: '#1E3A2B',
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },

  // Welcome section
  welcomeSection: {
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  verifiedIcon: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing[3],
  },
  statCard: {
    width: (width - Spacing[5] * 2 - Spacing[3]) / 2,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    ...Shadow.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  statValueAlert: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: FontWeight.medium,
    color: '#64748B',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
    marginBottom: Spacing[4],
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: FontWeight.semiBold,
    color: '#059669',
  },

  // Quick Actions 2x2
  actionsGrid: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: Spacing[4],
    gap: Spacing[3],
    ...Shadow.sm,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  actionSubLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: FontWeight.medium,
  },

  // Priority Alert
  alertCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: Spacing[5],
    gap: Spacing[3],
    marginBottom: Spacing[6],
    ...Shadow.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  alertBadgeIcon: {
    fontSize: 12,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#B45309',
  },
  alertTime: {
    fontSize: 12,
    color: '#64748B',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  alertDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  alertBtn: {
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: '#0F3821',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[1],
  },
  alertBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Assigned Requests
  requestsScroll: {
    gap: Spacing[4],
    paddingBottom: Spacing[2],
  },
  requestCard: {
    width: 220,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  requestImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  requestInfo: {
    padding: Spacing[3],
    gap: 6,
  },
  requestBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  wateringBadge: {
    backgroundColor: '#DBEAFE',
  },
  plantingBadge: {
    backgroundColor: '#D1FAE5',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  wateringBadgeText: {
    color: '#1E40AF',
  },
  plantingBadgeText: {
    color: '#065F46',
  },
  requestId: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: FontWeight.medium,
  },
  requestLocation: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  areaIcon: {
    fontSize: 12,
  },
  areaText: {
    fontSize: 11,
    color: '#64748B',
  },
});
