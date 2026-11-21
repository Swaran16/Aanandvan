import React, { useMemo, useState } from 'react';
import {
  Alert,
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

const PICKUP_SLOTS = [
  { id: 'morning', label: 'Morning Slot', time: '8:00 AM - 11:00 AM' },
  { id: 'afternoon', label: 'Afternoon Slot', time: '3:00 PM - 6:00 PM' },
];

const DISTRIBUTION_HUBS = [
  { id: 'dadar-hub', name: 'Aanandvan Shivaji Park Hub', meta: '0.8 kms • Ranade Road, Dadar West' },
  { id: 'matunga-hub', name: 'Aanandvan Five Gardens Hub', meta: '2.1 kms • Mancherji Joshi Rd, Matunga' },
  { id: 'worli-hub', name: 'Aanandvan Prabhadevi Center', meta: '2.6 kms • Near Siddhivinayak, Prabhadevi' },
];

export default function CollectSaplingsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, volunteerAcceptRequest } = useApp();

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  const [selectedSlotId, setSelectedSlotId] = useState('morning');
  const [selectedHubId, setSelectedHubId] = useState('dadar-hub');
  const [saplingCount, setSaplingCount] = useState(5);

  const selectedHub =
    DISTRIBUTION_HUBS.find((n) => n.id === selectedHubId) ?? DISTRIBUTION_HUBS[0];

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${selectedHub.name}, Dadar, Mumbai`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleMarkCollected = () => {
    if (req) {
      volunteerAcceptRequest(req.id);
    }
    if (Platform.OS === 'web') {
      router.replace('/(volunteer)' as any);
      return;
    }
    Alert.alert(
      'Saplings & Tools Collected',
      `${saplingCount} saplings, tree guards, and digging tools confirmed from ${selectedHub.name}. This drive is now in progress in your assigned work.`,
      [
        {
          text: 'Done',
          onPress: () => router.replace('/(volunteer)' as any),
        },
      ]
    );
  };

  const formattedId = req
    ? `#${req.id.toUpperCase()}`
    : '#REQ-DAD-01';
  const reqTitle = req?.title ?? 'Shivaji Park Corner Drive';

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
        <Text style={styles.headerTitle}>Collect Saplings & Tools</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{reqTitle}</Text>
          <View style={styles.summaryBottomRow}>
            <Text style={styles.summaryId}>{formattedId}</Text>
            <Text style={styles.summaryNeed}>{saplingCount} saplings allocated</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select Aanandvan Distribution Hub</Text>
        <View style={styles.hubList}>
          {DISTRIBUTION_HUBS.map((hub) => {
            const selected = selectedHubId === hub.id;
            return (
              <TouchableOpacity
                key={hub.id}
                style={[styles.hubCard, selected && styles.hubCardSelected]}
                onPress={() => setSelectedHubId(hub.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.hubInfo}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <Text style={styles.hubMeta}>{hub.meta}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={handleGetDirections}
          activeOpacity={0.8}
        >
          <Icon name="navigation" size={16} color="#0B3B24" />
          <Text style={styles.directionsBtnText}>Get Directions to Hub</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Pickup Timing Slot</Text>
        <View style={styles.slotsRow}>
          {PICKUP_SLOTS.map((slot) => {
            const active = selectedSlotId === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[styles.slotCard, active && styles.slotCardActive]}
                onPress={() => setSelectedSlotId(slot.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.slotTitle, active && styles.slotTextActive]}>
                  {slot.label}
                </Text>
                <Text style={[styles.slotTime, active && styles.slotSubActive]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.includedCard}>
          <Text style={styles.includedTitle}>Bundle Provided at Hub:</Text>
          <Text style={styles.includedItem}>✓ Native saplings (Neem / Karanj / Peepal)</Text>
          <Text style={styles.includedItem}>✓ Bamboo protective guards & zip-ties</Text>
          <Text style={styles.includedItem}>✓ Digging spade & soil aeration trowel</Text>
          <Text style={styles.includedItem}>✓ 5kg organic vermicompost packet</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.collectBtn}
          onPress={handleMarkCollected}
          activeOpacity={0.85}
        >
          <Text style={styles.collectBtnText}>Confirm Pickup & Start Drive</Text>
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
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  summaryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  summaryNeed: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 10,
  },
  hubList: {
    gap: 10,
    marginBottom: 14,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  hubCardSelected: {
    borderColor: '#0B3B24',
    backgroundColor: '#F0FDF4',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B3B24',
  },
  hubInfo: {
    flex: 1,
  },
  hubName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  hubMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    height: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  directionsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  slotCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  slotCardActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  slotTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  slotTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  slotTextActive: {
    color: '#FFFFFF',
  },
  slotSubActive: {
    color: '#D1E7DD',
  },
  includedCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  includedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 8,
  },
  includedItem: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FAFBF9',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EA',
  },
  collectBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
