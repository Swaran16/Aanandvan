import React, { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
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
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop',
];

const DEFAULT_LANDMARK_PHOTOS = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
];

const STATUS_BADGE: Record<string, { label: string; bg: string; fg: string }> = {
  submitted: { label: 'Submitted', bg: '#FEF3C7', fg: '#92400E' },
  verified: { label: 'Available', bg: '#CCF2DB', fg: '#0D4E2B' },
  assigned: { label: 'Assigned', bg: '#CCF2DB', fg: '#0D4E2B' },
  scheduled: { label: 'Scheduled', bg: '#DCFCE7', fg: '#166534' },
  in_progress: { label: 'In Progress', bg: '#E0F2FE', fg: '#0369A1' },
  completed: { label: 'Completed', bg: '#CCF2DB', fg: '#0D4E2B' },
  maintenance_due: { label: 'Maintenance', bg: '#FEE2E2', fg: '#B91C1C' },
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
  const { currentRole, requests } = useApp();
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

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

  const formattedId = req.id.toUpperCase().startsWith('REQ-')
    ? `#${req.id.toUpperCase()}`
    : `#${req.id.toUpperCase()}`;

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

  const saplingCount = 5;
  const distanceLabel =
    req.distanceKm !== undefined ? `${req.distanceKm.toFixed(1)} kms` : '1.2 kms';

  const handleGetDirections = () => {
    const query = encodeURIComponent(req.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleAcceptAndSchedule = () => {
    setAcceptModalVisible(false);
    router.push({ pathname: '/pages/schedule-plantation', params: { id: req.id } } as any);
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

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Distance from you</Text>
            <Text style={styles.metricValue}>{distanceLabel}</Text>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Space for</Text>
            <Text style={styles.metricValue}>about {saplingCount} saplings</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={handleGetDirections}
          activeOpacity={0.8}
        >
          <Icon name="navigation" size={16} color="#0D4E2B" />
          <Text style={styles.directionsBtnText}>Get directions</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{`"${req.description}"`}</Text>
        </View>

        {!isVolunteer && (
          <View style={styles.metaCard}>
            <Text style={styles.metaCardLabel}>Requested by</Text>
            <Text style={styles.metaCardValue}>{req.citizenName}</Text>
            {req.assignedVolunteerName ? (
              <>
                <Text style={[styles.metaCardLabel, { marginTop: 10 }]}>
                  Assigned volunteer
                </Text>
                <Text style={styles.metaCardValue}>{req.assignedVolunteerName}</Text>
              </>
            ) : null}
          </View>
        )}

        {req.schedule ? (
          <View style={styles.metaCard}>
            <Text style={styles.metaCardLabel}>Scheduled plantation</Text>
            <Text style={styles.metaCardValue}>
              {req.schedule.date} • {req.schedule.timeSlot}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {isVolunteer && isVerified && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setAcceptModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Accept request</Text>
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
            <Text style={styles.primaryBtnText}>Schedule plantation</Text>
          </TouchableOpacity>
        )}

        {isVolunteer && isScheduled && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({ pathname: '/pages/collect-saplings', params: { id: req.id } } as any)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Collect saplings</Text>
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

        {isVolunteer && isCompleted && (
          <View style={styles.completedBanner}>
            <Icon name="check-circle" size={18} color="#0D4E2B" />
            <Text style={styles.completedText}>Plantation drive completed</Text>
          </View>
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
            <Text style={styles.primaryBtnText}>Open admin verification review</Text>
          </TouchableOpacity>
        )}

        {!isVolunteer && !isAdmin && (
          <View style={styles.completedBanner}>
            <Icon
              name={isCompleted ? 'check' : isAssigned || isInProgress ? 'plant' : 'clock'}
              size={18}
              color="#0D4E2B"
            />
            <Text style={styles.completedText}>
              {isCompleted
                ? `Plantation completed by ${req.assignedVolunteerName || 'Volunteer'}!`
                : isAssigned || isInProgress
                ? `${req.assignedVolunteerName || 'Volunteer'} is working on this drive.`
                : isVerified
                ? 'Request verified & open for volunteers.'
                : 'Awaiting admin verification.'}
            </Text>
          </View>
        )}
      </View>

      <AcceptRequestModal
        visible={acceptModalVisible}
        requestTitle={req.title}
        requestLocation={req.location}
        onAcceptAndSchedule={handleAcceptAndSchedule}
        onClose={() => setAcceptModalVisible(false)}
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
    backgroundColor: '#FAFBF9',
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
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  topInfoLeft: {
    flex: 1,
    paddingRight: 12,
  },
  topInfoRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3E22',
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reqIdText: {
    fontSize: 11.5,
    color: '#6E7B73',
    marginTop: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0D4E2B',
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7A867E',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#163020',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#0D4E2B',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  directionsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6DDD4',
    padding: 16,
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontStyle: 'italic',
    color: '#4F5C54',
  },
  metaCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBE4',
    padding: 14,
  },
  metaCardLabel: {
    fontSize: 11.5,
    color: '#7A867E',
    marginBottom: 2,
  },
  metaCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#163020',
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
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedBanner: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#CCF2DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
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
});
