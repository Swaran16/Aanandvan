import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const RADIUS_OPTIONS = [
  { id: '2km', label: '2 kms', volunteerCount: 5 },
  { id: '5km', label: '5 kms', volunteerCount: 12 },
  { id: '10km', label: '10 kms', volunteerCount: 24 },
];

export default function VerifyPublishScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, volunteers, verifyRequest, adminApproveSchedule } = useApp();

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  const [visibilityMode, setVisibilityMode] = useState<'nearby' | 'direct'>('nearby');
  const [selectedRadius, setSelectedRadius] = useState('5km');
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(
    volunteers.find((v) => v.status === 'verified')?.id ?? volunteers[0]?.id ?? ''
  );
  const [notifyCitizen, setNotifyCitizen] = useState(true);

  if (!req) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify and publish</Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeRadiusObj =
    RADIUS_OPTIONS.find((r) => r.id === selectedRadius) ?? RADIUS_OPTIONS[1];

  const handlePublish = () => {
    if (req.status === 'scheduled') {
      adminApproveSchedule(req.id);
    } else {
      verifyRequest(req.id);
    }

    if (Platform.OS === 'web') {
      router.replace('/(admin)/requests' as any);
      return;
    }

    Alert.alert(
      'Verified & Published',
      visibilityMode === 'nearby'
        ? `${activeRadiusObj.volunteerCount} nearby volunteers have been notified for "${req.title}".`
        : `"${req.title}" has been verified and published.`,
      [
        {
          text: 'Done',
          onPress: () => router.replace('/(admin)/requests' as any),
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Verify and publish</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryTitle} numberOfLines={1}>
              {req.title}
            </Text>
            <Text style={styles.summaryId}>#{req.id.toUpperCase()}</Text>
          </View>
          <View style={styles.locationRow}>
            <Icon name="map-pin" size={14} color="#5F6C64" />
            <Text style={styles.locationText}>{req.location}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Who should see this request?</Text>
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              visibilityMode === 'nearby' && styles.togglePillActive,
            ]}
            onPress={() => setVisibilityMode('nearby')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.togglePillText,
                visibilityMode === 'nearby' && styles.togglePillTextActive,
              ]}
            >
              Nearby volunteers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.togglePill,
              visibilityMode === 'direct' && styles.togglePillActive,
            ]}
            onPress={() => setVisibilityMode('direct')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.togglePillText,
                visibilityMode === 'direct' && styles.togglePillTextActive,
              ]}
            >
              Assign directly
            </Text>
          </TouchableOpacity>
        </View>

        {visibilityMode === 'nearby' ? (
          <>
            <Text style={styles.sectionLabel}>Notify volunteers within</Text>
            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map((opt) => {
                const active = selectedRadius === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.radiusPill, active && styles.radiusPillActive]}
                    onPress={() => setSelectedRadius(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.radiusText, active && styles.radiusTextActive]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.checkIconWrap}>
                <Icon name="check" size={13} color="#0D4E2B" />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>
                  {activeRadiusObj.volunteerCount} volunteers
                </Text>{' '}
                will be notified. The first to accept gets the request.
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Select volunteer</Text>
            <View style={styles.volunteersList}>
              {volunteers.slice(0, 3).map((v) => {
                const selected = selectedVolunteerId === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.volOption, selected && styles.volOptionActive]}
                    onPress={() => setSelectedVolunteerId(v.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.volOptionName,
                        selected && styles.volOptionNameActive,
                      ]}
                    >
                      {v.name} • {v.city}
                    </Text>
                    {selected && <Icon name="check" size={14} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.switchCard}>
          <Text style={styles.switchLabel}>Tell the citizen it is verified.</Text>
          <Switch
            value={notifyCitizen}
            onValueChange={setNotifyCitizen}
            trackColor={{ false: '#D1D5DB', true: '#0D4E2B' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.publishBtn}
          onPress={handlePublish}
          activeOpacity={0.85}
        >
          <Text style={styles.publishBtnText}>Verify & publish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
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
    paddingTop: 6,
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    padding: 14,
    marginBottom: 22,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  summaryTitle: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0B3E22',
  },
  summaryId: {
    fontSize: 11.5,
    color: '#7A867E',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 13,
    color: '#5F6C64',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0B3E22',
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  togglePill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
  },
  togglePillActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  togglePillText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#4F5C54',
  },
  togglePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  radiusPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#0D4E2B',
    backgroundColor: '#FFFFFF',
  },
  radiusPillActive: {
    backgroundColor: '#0D4E2B',
  },
  radiusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  radiusTextActive: {
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  checkIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CCF2DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#4F5C54',
  },
  infoBold: {
    fontWeight: '700',
    color: '#163020',
  },
  volunteersList: {
    gap: 8,
    marginBottom: 18,
  },
  volOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  volOptionActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  volOptionName: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#163020',
  },
  volOptionNameActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  switchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 13.5,
    color: '#4F5C54',
    flex: 1,
    paddingRight: 10,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
    gap: 10,
  },
  publishBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelBtn: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

