/**
 * Dynamic Universal Request Details Screen
 * Seamlessly adapts based on the active role and request state:
 * - Matches Batch 1 Image 3, Batch 3 Image 1, and Batch 3 Image 3
 * - Hero banner with request ID, title, and location status
 * - Populated area photos & landmark photos
 * - Satellite map preview with GPS tag & "Get Directions"
 * - Assigned Volunteer card with "Contact" button (for citizen)
 * - "Accept Request" -> "Schedule Plantation" -> "Upload Activity" (for volunteer)
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

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, currentRole, volunteerAcceptRequest } = useApp();

  const req = requests.find(r => r.id === id) || requests[0];

  const isCitizen = currentRole === 'citizen';
  const isVolunteer = currentRole === 'volunteer';
  const isAdmin = currentRole === 'admin';

  const isVerified = req.status === 'verified';
  const isAssigned = req.status === 'assigned';
  const isScheduled = req.status === 'scheduled';
  const isInProgress = req.status === 'in_progress';
  const isCompleted = req.status === 'completed';

  const handleVolunteerAction = () => {
    if (isVerified) {
      volunteerAcceptRequest(req.id);
      Alert.alert(
        'Request Accepted! 🎉',
        `You are now assigned to "${req.title}". Please proceed to schedule the plantation drive.`,
        [
          {
            text: 'Schedule Now',
            onPress: () =>
              router.push({
                pathname: '/pages/schedule-plantation',
                params: { id: req.id },
              } as any),
          },
        ]
      );
    } else if (isAssigned) {
      router.push({
        pathname: '/pages/schedule-plantation',
        params: { id: req.id },
      } as any);
    } else if (isScheduled) {
      Alert.alert(
        'Scheduled Awaiting Admin',
        'Your scheduled drive is currently pending Admin confirmation. You will be able to post plantation updates once confirmed.'
      );
    } else if (isInProgress) {
      router.push({
        pathname: '/pages/upload-activity',
        params: { id: req.id },
      } as any);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Aanandvan</Text>
        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => alert('Notification settings')}
          >
            <Icon name="bell" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => alert('Share request link')}
          >
            <Icon name="share" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Green Header Card ─── */}
        <View style={styles.heroCard}>
          <View style={styles.heroCardTop}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {req.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.heroReqCode}>#{req.id}</Text>
          </View>

          <Text style={styles.heroTitle}>{req.title}</Text>
          <Text style={styles.heroSubtitle}>
            {req.manualAddress || req.location}
          </Text>
        </View>

        {/* ─── Status Ribbon (for Citizen) ─── */}
        {isCitizen && (
          <View style={styles.statusRibbon}>
            <View style={styles.statusDotRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      req.status === 'pending'
                        ? '#F59E0B'
                        : req.status === 'completed'
                        ? '#10B981'
                        : '#3B82F6',
                  },
                ]}
              />
              <Text style={styles.statusRibbonText}>
                Current Status:{' '}
                <Text style={{ fontWeight: '800' }}>
                  {req.status === 'pending'
                    ? 'Pending Verification'
                    : req.status === 'verified'
                    ? 'Verified by Admin'
                    : req.status === 'assigned'
                    ? 'Assigned to Volunteer'
                    : req.status === 'scheduled'
                    ? 'Drive Scheduled'
                    : req.status === 'in_progress'
                    ? 'Plantation In Progress'
                    : 'Completed'}
                </Text>
              </Text>
            </View>
            <Text style={styles.statusRibbonTime}>Updated recently</Text>
          </View>
        )}

        {/* ─── Description ─── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="document" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.descriptionText}>"{req.description}"</Text>
        </View>

        {/* ─── Area Photographs ─── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Area Photographs</Text>
          </View>
          <View style={styles.photosRow}>
            {req.areaPhotos.map((photo, i) => (
              <Image key={i} source={{ uri: photo }} style={styles.photoThumb} />
            ))}
          </View>
        </View>

        {/* ─── Landmark Photographs ─── */}
        {req.landmarkPhotos.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="building" size={16} color="#0B3B24" />
              <Text style={styles.sectionTitle}>Landmark Photographs</Text>
            </View>
            <View style={styles.photosRow}>
              {req.landmarkPhotos.map((photo, i) => (
                <Image key={i} source={{ uri: photo }} style={styles.photoThumb} />
              ))}
            </View>
          </View>
        )}

        {/* ─── Location & Address ─── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="map-pin" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Location & Address</Text>
          </View>

          {/* Map Preview */}
          <View style={styles.mapPreviewBox}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
              }}
              style={styles.mapImage}
            />
            <View style={styles.gpsPill}>
              <Icon name="navigation" size={12} color="#0B3B24" />
              <Text style={styles.gpsText}>{req.coordinates}</Text>
            </View>
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Manual Address</Text>
            <Text style={styles.addressValue}>{req.manualAddress}</Text>

            {req.landmark && (
              <View style={styles.landmarkRow}>
                <Icon name="map-pin" size={14} color="#0B3B24" />
                <Text style={styles.landmarkText}>
                  Nearby Landmark: {req.landmark}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.directionsBtn}
              onPress={() => alert(`Navigating to coordinates: ${req.coordinates}`)}
            >
              <Icon name="navigation" size={16} color="#0B3B24" />
              <Text style={styles.directionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Citizen View: Requester & Volunteer Cards ─── */}
        {isCitizen && (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.subCardLabel}>REQUESTED BY</Text>
              <View style={styles.personRow}>
                <View style={styles.personAvatarBox}>
                  <Icon name="profile" size={20} color="#0B3B24" />
                </View>
                <View>
                  <Text style={styles.personName}>{req.citizenName}</Text>
                  <Text style={styles.personSub}>
                    Community Member • 5 Requests
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.subCardLabel}>ASSIGNED VOLUNTEER</Text>
              <View style={styles.volunteerAssignRow}>
                <View style={styles.volunteerLeft}>
                  <View style={styles.volAvatarCircle}>
                    <Icon name="plant" size={20} color="#0B3B24" />
                  </View>
                  <View>
                    <View style={styles.volNameRow}>
                      <Text style={styles.personName}>
                        {req.assignedVolunteerName || 'Amit Kumar'}
                      </Text>
                      <View style={styles.verifiedTag}>
                        <Text style={styles.verifiedTagText}>✓ Verified</Text>
                      </View>
                    </View>
                    <Text style={styles.personSub}>
                      {req.assignedVolunteerLevel || 'Level 4 • 25+ Plantations'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => alert('Opening direct chat with volunteer')}
                >
                  <Icon name="message" size={14} color="#FFFFFF" />
                  <Text style={styles.contactBtnText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Needed Card */}
            <View style={styles.helpCard}>
              <Text style={styles.helpTitle}>HELP NEEDED?</Text>
              <Text style={styles.helpSubtitle}>
                Need to reschedule or update your request details?
              </Text>
              <TouchableOpacity
                style={styles.contactSupportBtn}
                onPress={() => alert('Support helpline: help@aanandvan.in')}
              >
                <Text style={styles.contactSupportText}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ─── Volunteer Actions ─── */}
        {isVolunteer && (
          <View style={styles.actionSection}>
            {isVerified && (
              <TouchableOpacity
                style={styles.primaryActionBtn}
                activeOpacity={0.85}
                onPress={handleVolunteerAction}
              >
                <Icon name="check" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Accept Request</Text>
              </TouchableOpacity>
            )}

            {isAssigned && (
              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: '#0B3B24' }]}
                activeOpacity={0.85}
                onPress={handleVolunteerAction}
              >
                <Icon name="calendar" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>
                  Schedule Plantation Drive
                </Text>
              </TouchableOpacity>
            )}

            {isScheduled && (
              <View style={styles.pendingScheduleCard}>
                <Icon name="clock" size={18} color="#D97706" />
                <Text style={styles.pendingScheduleText}>
                  Scheduled for {req.schedule?.date} ({req.schedule?.timeSlot}).
                  Awaiting Admin confirmation.
                </Text>
              </View>
            )}

            {isInProgress && (
              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: '#0B3B24' }]}
                activeOpacity={0.85}
                onPress={handleVolunteerAction}
              >
                <Icon name="upload" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>
                  Upload Plantation Activity
                </Text>
              </TouchableOpacity>
            )}

            {isCompleted && (
              <View style={styles.completedCard}>
                <Icon name="check-circle" size={20} color="#059669" />
                <Text style={styles.completedText}>
                  Plantation Drive Successfully Completed!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ─── Admin Action Shortcut ─── */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() =>
              router.push({
                pathname: '/pages/admin-review-request',
                params: { id: req.id },
              } as any)
            }
          >
            <Text style={styles.primaryActionBtnText}>
              Open Full Admin Verification Review →
            </Text>
          </TouchableOpacity>
        )}
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
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
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
  heroCard: {
    backgroundColor: '#0B3B24',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  heroReqCode: {
    fontSize: 12,
    color: '#A8D5BA',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D8EFE1',
    marginTop: 4,
  },
  statusRibbon: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusRibbonText: {
    fontSize: 13,
    color: '#C2410C',
  },
  statusRibbonTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B3B24',
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  photoThumb: {
    flex: 1,
    height: 85,
    borderRadius: 12,
  },
  mapPreviewBox: {
    position: 'relative',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  gpsPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  addressBlock: {
    gap: 6,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  addressValue: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
  landmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: '#0B3B24',
    fontWeight: '600',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#0B3B24',
    borderRadius: 12,
    height: 44,
    marginTop: 10,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  subCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  personSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  volunteerAssignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volunteerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B3B24',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  helpCard: {
    backgroundColor: '#0B3B24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A8D5BA',
    letterSpacing: 0.6,
  },
  helpSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
  },
  contactSupportBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactSupportText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  primaryActionBtn: {
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
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pendingScheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  pendingScheduleText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '600',
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  completedText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '700',
  },
});

