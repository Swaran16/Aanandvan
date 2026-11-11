import React, { useMemo } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const DEFAULT_AREA = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop',
];

const DEFAULT_LANDMARK = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
];

function chunkIntoRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function AdminReviewRequestScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, rejectRequest } = useApp();

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
          <Text style={styles.headerTitle}>Review request</Text>
        </View>
      </SafeAreaView>
    );
  }

  const areaPhotos =
    req.areaPhotos && req.areaPhotos.length >= 2
      ? req.areaPhotos
      : [...(req.areaPhotos ?? []), ...DEFAULT_AREA].slice(0, 4);

  const landmarkPhotos =
    req.landmarkPhotos && req.landmarkPhotos.length > 0
      ? req.landmarkPhotos
      : DEFAULT_LANDMARK;

  const areaRows = chunkIntoRows(areaPhotos, 3);
  const landmarkRows = chunkIntoRows(landmarkPhotos, 3);

  const badgeLabel =
    req.status === 'pending'
      ? 'Pending'
      : req.status === 'verified'
        ? 'Verified'
        : req.status === 'rejected'
          ? 'Need info'
          : req.status.replace(/_/g, ' ');

  const handleOpenMaps = () => {
    const query = encodeURIComponent(req.coordinates || req.manualAddress || req.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleAskMoreInfo = () => {
    rejectRequest(req.id);
    if (Platform.OS === 'web') {
      router.back();
      return;
    }
    Alert.alert(
      'More Information Requested',
      `The citizen (${req.citizenName}) will be notified to provide clearer details.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleReject = () => {
    if (Platform.OS === 'web') {
      rejectRequest(req.id);
      router.back();
      return;
    }
    Alert.alert('Reject Request', `Are you sure you want to reject "${req.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectRequest(req.id);
          router.back();
        },
      },
    ]);
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
        <Text style={styles.headerTitle}>Review request</Text>
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
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{badgeLabel}</Text>
            </View>
            <Text style={styles.reqIdText}>#{req.id.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Area photographs</Text>
        <View style={styles.gridGroup}>
          {areaRows.map((row, rIdx) => (
            <View key={`area-r-${rIdx}`} style={styles.photoRow}>
              {row.map((uri, cIdx) => (
                <View key={`area-${rIdx}-${cIdx}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, eIdx) => (
                <View key={`area-e-${rIdx}-${eIdx}`} style={styles.photoSpacer} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Landmark photographs</Text>
        <View style={styles.gridGroup}>
          {landmarkRows.map((row, rIdx) => (
            <View key={`lm-r-${rIdx}`} style={styles.photoRow}>
              {row.map((uri, cIdx) => (
                <View key={`lm-${rIdx}-${cIdx}`} style={styles.photoCell}>
                  <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
                </View>
              ))}
              {Array.from({ length: 3 - row.length }).map((_, eIdx) => (
                <View key={`lm-e-${rIdx}-${eIdx}`} style={styles.photoSpacer} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.metaLabel}>Address</Text>
        <Text style={styles.metaValue}>
          {req.manualAddress || req.location}
        </Text>

        <Text style={[styles.metaLabel, { marginTop: 12 }]}>Nearby landmark</Text>
        <Text style={styles.metaValue}>{req.landmark || 'Near main road'}</Text>

        <TouchableOpacity
          style={styles.mapsBtn}
          onPress={handleOpenMaps}
          activeOpacity={0.8}
        >
          <Icon name="navigation" size={16} color="#0D4E2B" />
          <Text style={styles.mapsBtnText}>Open in maps</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{`"${req.description}"`}</Text>
        </View>

        <View style={styles.submitterRow}>
          <Image
            source={{
              uri:
                req.citizenAvatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.citizenAvatar}
          />
          <View>
            <Text style={styles.submittedBy}>Submitted by: {req.citizenName}</Text>
            <Text style={styles.submittedDate}>{req.createdAt}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() =>
            router.push({
              pathname: '/pages/verify-publish',
              params: { id: req.id },
            } as any)
          }
          activeOpacity={0.85}
        >
          <Text style={styles.verifyBtnText}>Verify & publish to volunteers</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={handleAskMoreInfo}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineBtnText}>Ask more info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={handleReject}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineBtnText}>Reject request</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#FBF0C4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92580A',
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
  metaLabel: {
    fontSize: 12,
    color: '#7A867E',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    lineHeight: 20,
    color: '#163020',
  },
  mapsBtn: {
    marginTop: 14,
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
  mapsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5EAE2',
    padding: 16,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 21,
    fontStyle: 'italic',
    color: '#4F5C54',
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  citizenAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5EAE3',
  },
  submittedBy: {
    fontSize: 13,
    fontWeight: '600',
    color: '#163020',
  },
  submittedDate: {
    fontSize: 12,
    color: '#6E7B73',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EAEEE7',
    gap: 10,
  },
  verifyBtn: {
    height: 46,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#0D4E2B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});
