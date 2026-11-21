/**
 * Admin Verify & Publish Screen — Aanandvan
 *
 * Clean verification confirmation:
 * - Direct confirmation without fake radius or direct assign clutter
 * - Marks request as verified and publishes to the volunteer pool
 */

import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VerifyPublishScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, verifyRequest, adminApproveSchedule } = useApp();

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  if (!req) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#0B3B24" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify and publish</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      `"${req.title}" has been verified and published to the active volunteer pool.`,
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
          <Icon name="chevron-left" size={22} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify & Publish Request</Text>
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
            <Icon name="map-pin" size={14} color="#0B3B24" />
            <Text style={styles.locationText}>{req.manualAddress || req.location}</Text>
          </View>
          <Text style={styles.citizenMeta}>Submitted by: {req.citizenName || 'Kartik Vichare'}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHead}>
            <Icon name="check-circle" size={18} color="#0B3B24" />
            <Text style={styles.infoTitle}>Verification Outcome</Text>
          </View>
          <Text style={styles.infoDesc}>
            Publishing marks this spot as verified by Aanandvan Administration. It will immediately appear on the &ldquo;Available Drives&rdquo; feed for all registered volunteers across Dadar and Mumbai to accept and schedule.
          </Text>
        </View>

        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Verification Checklist Verified:</Text>
          <Text style={styles.checklistText}>✓ Public space or municipal permission confirmed</Text>
          <Text style={styles.checklistText}>✓ Area photographs verified for plantation feasibility</Text>
          <Text style={styles.checklistText}>✓ Soil & street accessibility checked</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.publishBtn}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Text style={styles.publishBtnText}>Confirm Verification & Publish</Text>
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
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  summaryId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginLeft: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
  },
  citizenMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  infoHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
  },
  infoDesc: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  guidelinesCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
  },
  guidelinesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 10,
  },
  checklistText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EA',
  },
  publishBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
