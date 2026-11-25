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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { AcceptRequestModal } from '@/components/volunteer/AcceptRequestModal';
import { useApp } from '@/context/AppContext';

const DEFAULT_AREA_PHOTOS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop',
];

const DEFAULT_LANDMARK_PHOTOS = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
];

const STATUS_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  submitted: { label: 'Submitted', bg: '#FEF3C7', fg: '#92400E' },
  needs_info: { label: 'Clarification Needed', bg: '#FEE2E2', fg: '#B91C1C' },
  verified: { label: 'Available', bg: '#CCF2DB', fg: '#0D4E2B' },
  assigned: { label: 'Assigned', bg: '#CCF2DB', fg: '#0D4E2B' },
  scheduled: { label: 'Scheduled', bg: '#DCFCE7', fg: '#166534' },
  in_progress: { label: 'In Progress', bg: '#E0F2FE', fg: '#0369A1' },
  completed: { label: 'Planted & Nurturing', bg: '#CCF2DB', fg: '#0D4E2B' },
  maintenance_due: { label: 'Maintenance Due', bg: '#FEE2E2', fg: '#B91C1C' },
  rejected: { label: 'Rejected', bg: '#FEE2E2', fg: '#B91C1C' },
};

function chunkIntoRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { currentRole, requests, updateCitizenRequest } = useApp();
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  // Edit form state for Citizen
  const [editTitle, setEditTitle] = useState(req?.title || '');
  const [editDescription, setEditDescription] = useState(req?.description || '');
  const [editLocation, setEditLocation] = useState(req?.location || '');

  if (!req) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request details</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isVolunteer = currentRole === 'volunteer';
  const isAdmin = currentRole === 'admin';
  const isCitizen = !isVolunteer && !isAdmin;

  const isNeedsInfo = req.status === 'needs_info';
  const isVerified = req.status === 'verified';
  const isAssigned = req.status === 'assigned';
  const isScheduled = req.status === 'scheduled';
  const isInProgress = req.status === 'in_progress';
  const isCompleted = req.status === 'completed';

  const statusMeta = STATUS_BADGE[req.status] ?? {
    label: req.status.replace(/_/g, ' '),
    bg: '#CCF2DB',
    fg: '#0D4E2B',
  };

  const formattedId = `#${req.id.toUpperCase()}`;

  const areaPhotos: string[] =
    req.areaPhotos && req.areaPhotos.length >= 2
      ? req.areaPhotos
      : [...(req.areaPhotos ?? []), ...DEFAULT_AREA_PHOTOS].slice(0, 4);

  const landmarkPhotos: string[] =
    req.landmarkPhotos && req.landmarkPhotos.length > 0
      ? req.landmarkPhotos
      : DEFAULT_LANDMARK_PHOTOS;

  const areaRows = chunkIntoRows(areaPhotos, 3);
  const landmarkRows = chunkIntoRows(landmarkPhotos, 3);

  const handleGetDirections = () => {
    const query = encodeURIComponent(req.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleAcceptAndSchedule = () => {
    setAcceptModalVisible(false);
    router.push({ pathname: '/pages/schedule-plantation', params: { id: req.id } } as any);
  };

  const handleSaveCitizenEdit = () => {
    updateCitizenRequest(req.id, {
      title: editTitle,
      description: editDescription,
      location: editLocation,
    });
    setEditModalVisible(false);
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
        <Text style={styles.headerTitle}>Request details</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Card */}
        <View style={styles.topInfoRow}>
          <View style={styles.topInfoLeft}>
            <Text style={styles.title}>{req.title}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color="#5F6C64" />
              <Text style={styles.locationText}>{req.location}</Text>
            </View>
          </View>

          <View style={styles.topInfoRight}>
            <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusMeta.fg }]}>
                {statusMeta.label}
              </Text>
            </View>
            <Text style={styles.reqIdText}>{formattedId}</Text>
          </View>
        </View>

        {/* ─── Admin Clarification Alert (if needs_info) ─── */}
        {isNeedsInfo && (
          <View style={styles.clarificationAlert}>
            <View style={styles.alertHeader}>
              <Icon name="alert-triangle" size={18} color="#B91C1C" />
              <Text style={styles.alertTitle}>Admin Clarification Requested</Text>
            </View>
            <Text style={styles.alertBody}>
              {req.adminClarificationNotes ||
                'Please update landmark details or upload clearer spot photographs so volunteers can accurately identify the site.'}
            </Text>
            {isCitizen && (
              <TouchableOpacity
                style={styles.editRequestBtn}
                activeOpacity={0.85}
                onPress={() => setEditModalVisible(true)}
              >
                <Icon name="edit" size={14} color="#FFFFFF" />
                <Text style={styles.editRequestBtnText}>Edit Request & Resubmit</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ─── Continuous Thread: Plantation & Nurturing Progress ─── */}
        {(isCompleted ||
          req.status === 'in_progress' ||
          !!req.activityUpdate ||
          (req.nurturingUpdates && req.nurturingUpdates.length > 0)) && (
          <View style={styles.threadSection}>
            <View style={styles.threadHeaderRow}>
              <Icon name="plant" size={18} color="#0B3B24" />
              <Text style={styles.threadHeaderTitle}>Plantation & Care Timeline</Text>
            </View>
            <Text style={styles.threadHeaderSub}>
              Transparent field updates log showing sapling planting &amp; recurring nurturing care for this spot.
            </Text>

            {/* Phase 1: Initial Plantation Card */}
            <View style={styles.threadCard}>
              <View style={styles.threadBadgeRow}>
                <View style={styles.phaseBadge}>
                  <Text style={styles.phaseBadgeText}>PHASE 1: PLANTATION COMPLETED</Text>
                </View>
                <Text style={styles.threadDateText}>
                  {req.activityUpdate?.date || '18 Nov 2026'}
                </Text>
              </View>

              <Text style={styles.threadVolunteerText}>
                Planted by {req.activityUpdate?.volunteerName || req.assignedVolunteerName || 'Vaibhav Shirke'}
              </Text>

              <Text style={styles.threadCountHighlight}>
                🌱 {req.activityUpdate?.saplingsPlanted || 5} native saplings planted with protective guards
              </Text>

              {/* Photos */}
              {((req.activityUpdate?.photos && req.activityUpdate.photos.length > 0) ||
                (req.activityUpdate?.afterPhotos && req.activityUpdate.afterPhotos.length > 0)) && (
                <View style={styles.threadPhotosRow}>
                  {(req.activityUpdate.photos || req.activityUpdate.afterPhotos || []).map(
                    (uri: string, idx: number) => (
                      <Image key={idx} source={{ uri }} style={styles.threadPhotoThumb} />
                    )
                  )}
                </View>
              )}

              <Text style={styles.threadNotes}>
                &ldquo;{req.activityUpdate?.notes || 'Saplings planted with 20L initial watering, tree guard, and organic compost.'}&rdquo;
              </Text>
            </View>

            {/* Phase 2: Recurring Nurturing Thread Updates */}
            {req.nurturingUpdates && req.nurturingUpdates.map((update, idx) => (
              <View key={update.id || idx} style={styles.threadCardNurturing}>
                <View style={styles.threadBadgeRow}>
                  <View style={styles.nurtureBadge}>
                    <Text style={styles.nurtureBadgeText}>CARE UPDATE #{idx + 1}</Text>
                  </View>
                  <Text style={styles.threadDateText}>{update.date}</Text>
                </View>

                <Text style={styles.threadVolunteerText}>
                  Care Logged by {update.volunteerName} ({update.volunteerId || 'Volunteer'})
                </Text>

                {/* Actions Taken Chips */}
                {update.actionsTaken && (
                  <View style={styles.actionsTakenRow}>
                    {update.actionsTaken.map((act, actIdx) => (
                      <View key={actIdx} style={styles.actionChip}>
                        <Text style={styles.actionChipText}>✓ {act}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Nurturing Photos */}
                {update.photos && update.photos.length > 0 && (
                  <View style={styles.threadPhotosRow}>
                    {update.photos.map((uri, pIdx) => (
                      <Image key={pIdx} source={{ uri }} style={styles.threadPhotoThumb} />
                    ))}
                  </View>
                )}

                <Text style={styles.threadNotes}>&ldquo;{update.notes}&rdquo;</Text>
              </View>
            ))}

            {/* Alternate-day Nurturing Schedule Info */}
            <View style={styles.nurturingScheduleNotice}>
              <Icon name="bell" size={15} color="#0B3B24" />
              <Text style={styles.nurturingScheduleText}>
                Aanandvan Nurturing Protocol: Volunteer receives automated alerts every 48 hours for watering and sapling health monitoring.
              </Text>
            </View>
          </View>
        )}

        {/* ─── Site Original Photographs ─── */}
        <Text style={styles.sectionTitle}>Area photographs</Text>
        <View style={styles.gridGroup}>
          {areaRows.map((row, rowIndex) => (
            <View key={`area-row-${rowIndex}`} style={styles.photoRow}>
              {row.map((uri, colIndex) => (
                <View key={`area-${rowIndex}-${colIndex}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, emptyIdx) => (
                <View key={`area-empty-${rowIndex}-${emptyIdx}`} style={styles.photoSpacer} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Landmark photographs</Text>
        <View style={styles.gridGroup}>
          {landmarkRows.map((row, rowIndex) => (
            <View key={`landmark-row-${rowIndex}`} style={styles.photoRow}>
              {row.map((uri, colIndex) => (
                <View key={`landmark-${rowIndex}-${colIndex}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, emptyIdx) => (
                <View
                  key={`landmark-empty-${rowIndex}-${emptyIdx}`}
                  style={styles.photoSpacer}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Location & Directions */}
        <Text style={styles.sectionTitle}>Location Details</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.locationDetailText}>{req.manualAddress || req.location}</Text>
          {req.landmark && (
            <Text style={styles.landmarkDetailText}>Landmark: {req.landmark}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={handleGetDirections}
          activeOpacity={0.8}
        >
          <Icon name="navigation" size={16} color="#0B3B24" />
          <Text style={styles.directionsBtnText}>Get directions via Google Maps</Text>
        </TouchableOpacity>

        {/* Description */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{`"${req.description}"`}</Text>
        </View>

        {/* Request Metadata */}
        <View style={styles.metaCard}>
          <Text style={styles.metaCardLabel}>Requested by</Text>
          <Text style={styles.metaCardValue}>{req.citizenName || 'Kartik Vichare'}</Text>
          {req.assignedVolunteerName && (
            <>
              <Text style={[styles.metaCardLabel, { marginTop: 10 }]}>
                Assigned volunteer
              </Text>
              <Text style={styles.metaCardValue}>{req.assignedVolunteerName}</Text>
            </>
          )}
        </View>

        {req.schedule && (
          <View style={styles.metaCard}>
            <Text style={styles.metaCardLabel}>Scheduled plantation</Text>
            <Text style={styles.metaCardValue}>
              {req.schedule.date} • {req.schedule.timeSlot}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ─── Footer Action Bar ─── */}
      <View style={styles.footer}>
        {isVolunteer && isVerified && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setAcceptModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Accept plantation request</Text>
          </TouchableOpacity>
        )}

        {isVolunteer && isAssigned && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({ pathname: '/pages/schedule-plantation', params: { id: req.id } } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Schedule plantation drive</Text>
          </TouchableOpacity>
        )}

        {isVolunteer && isScheduled && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({ pathname: '/pages/upload-activity', params: { id: req.id } } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Upload plantation activity</Text>
          </TouchableOpacity>
        )}

        {isVolunteer && isInProgress && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({ pathname: '/pages/upload-activity', params: { id: req.id } } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Upload plantation activity</Text>
          </TouchableOpacity>
        )}

        {/* Volunteer completed: Log Nurturing button */}
        {isVolunteer && isCompleted && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({ pathname: '/pages/log-nurturing', params: { id: req.id } } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>+ Log Nurturing & Watering Update</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({
                pathname: '/pages/admin-review-request',
                params: { id: req.id },
              } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Open admin review & verification</Text>
          </TouchableOpacity>
        )}

        {isCitizen && !isNeedsInfo && (
          <View style={styles.completedBanner}>
            <Icon
              name={isCompleted ? 'check-circle' : isAssigned || isInProgress ? 'plant' : 'clock'}
              size={18}
              color="#0B3B24"
            />
            <Text style={styles.completedText}>
              {isCompleted
                ? `Plantation completed by ${req.assignedVolunteerName || 'Vaibhav Shirke'}! Nurturing is ongoing.`
                : isAssigned || isInProgress
                ? `${req.assignedVolunteerName || 'Vaibhav Shirke'} is working on this drive.`
                : isVerified
                ? 'Request verified by Admin & open for volunteers to accept.'
                : 'Awaiting admin verification.'}
            </Text>
          </View>
        )}
      </View>

      {/* Volunteer Accept Modal */}
      <AcceptRequestModal
        visible={acceptModalVisible}
        requestTitle={req.title}
        requestLocation={req.location}
        onAcceptAndSchedule={handleAcceptAndSchedule}
        onClose={() => setAcceptModalVisible(false)}
      />

      {/* Citizen Edit Request Modal (for clarification) */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Request Details</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.editLabel}>Request Title</Text>
              <TextInput
                style={styles.editInput}
                value={editTitle}
                onChangeText={setEditTitle}
              />

              <Text style={styles.editLabel}>Location / Street</Text>
              <TextInput
                style={styles.editInput}
                value={editLocation}
                onChangeText={setEditLocation}
              />

              <Text style={styles.editLabel}>Description & Landmarks</Text>
              <TextInput
                style={[styles.editInput, { minHeight: 90 }]}
                multiline
                value={editDescription}
                onChangeText={setEditDescription}
                textAlignVertical="top"
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.saveEditBtn}
              onPress={handleSaveCitizenEdit}
              activeOpacity={0.88}
            >
              <Text style={styles.saveEditText}>Save & Resubmit to Admin</Text>
            </TouchableOpacity>
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
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 100,
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
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#5F6C64',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reqIdText: {
    fontSize: 11.5,
    color: '#6E7B73',
    marginTop: 6,
    fontWeight: '600',
  },
  clarificationAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  alertBody: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 10,
  },
  editRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  editRequestBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  threadSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  threadHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  threadHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  threadHeaderSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 14,
  },
  threadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  threadCardNurturing: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 3,
    borderLeftColor: '#163E2B',
    marginBottom: 10,
  },
  threadBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  phaseBadge: {
    backgroundColor: '#163E2B',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  nurtureBadge: {
    backgroundColor: '#166534',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  nurtureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  threadDateText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  threadVolunteerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  threadCountHighlight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#163E2B',
    marginBottom: 8,
  },
  actionsTakenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  actionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  actionChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  threadPhotosRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  threadPhotoThumb: {
    width: 68,
    height: 68,
    borderRadius: 6,
  },
  threadNotes: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#4B5563',
    lineHeight: 18,
  },
  nurturingScheduleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 10,
    borderRadius: 6,
  },
  nurturingScheduleText: {
    flex: 1,
    fontSize: 11,
    color: '#166534',
    lineHeight: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 10,
  },
  gridGroup: {
    gap: 10,
    marginBottom: 20,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E5EAE3',
  },
  photoSpacer: {
    flex: 1,
    aspectRatio: 1,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 10,
    marginBottom: 16,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  locationDetailText: {
    fontSize: 13.5,
    color: '#111827',
    fontWeight: '600',
  },
  landmarkDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
  metaCardLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaCardValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EA',
  },
  primaryBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 10,
  },
  completedText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#5F6C64',
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3B24',
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 4,
    marginTop: 10,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
  },
  saveEditBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  saveEditText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
