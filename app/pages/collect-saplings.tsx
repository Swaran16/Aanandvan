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
  { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM' },
  { id: 'afternoon', label: 'Afternoon', time: '3:00 PM - 6:00 PM' },
];

const PARTNER_NURSERIES = [
  { id: 'hariyali', name: 'Hariyali plant nursery', meta: '1.1 kms | Dadar West' },
  { id: 'green-earth', name: 'Green earth nursery', meta: '2.3 kms | Matunga East' },
  { id: 'prakriti', name: 'Prakriti tree nursery', meta: '3.4 kms | Sion Circle' },
];

export default function CollectSaplingsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests } = useApp();

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  const [selectedSlotId, setSelectedSlotId] = useState('morning');
  const [selectedNurseryId, setSelectedNurseryId] = useState('hariyali');
  const [saplingCount, setSaplingCount] = useState(5);

  const selectedNursery =
    PARTNER_NURSERIES.find((n) => n.id === selectedNurseryId) ?? PARTNER_NURSERIES[0];

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${selectedNursery.name} ${selectedNursery.meta.split('|')[1] ?? ''}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleMarkCollected = () => {
    if (Platform.OS === 'web') {
      router.replace('/(volunteer)' as any);
      return;
    }
    Alert.alert(
      'Saplings Collected',
      `${saplingCount} saplings confirmed from ${selectedNursery.name}. This plantation request is now assigned to you.`,
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
    : '#REQ-2024-0042';
  const reqTitle = req?.title ?? 'Oak valley reforestation';

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
        <Text style={styles.headerTitle}>Collect saplings</Text>
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
            <Text style={styles.summaryNeed}>{saplingCount} saplings needed</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Choose a partner nursery</Text>
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
                <Text style={[styles.slotTitle, active && styles.slotTitleActive]}>
                  {slot.label}
                </Text>
                <Text style={[styles.slotTime, active && styles.slotTimeActive]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Checklist of materials</Text>
        <View style={styles.nurseryList}>
          {PARTNER_NURSERIES.map((nursery) => {
            const selected = selectedNurseryId === nursery.id;
            return (
              <TouchableOpacity
                key={nursery.id}
                style={[styles.nurseryCard, selected && styles.nurseryCardSelected]}
                onPress={() => setSelectedNurseryId(nursery.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.nurseryInfo}>
                  <Text style={styles.nurseryName}>{nursery.name}</Text>
                  <Text style={styles.nurseryMeta}>{nursery.meta}</Text>
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
          <Icon name="navigation" size={16} color="#0D4E2B" />
          <Text style={styles.directionsBtnText}>Get directions</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { marginTop: 22 }]}>
          No. of saplings required
        </Text>
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => setSaplingCount((c) => Math.max(1, c - 1))}
            activeOpacity={0.75}
          >
            <Icon name="minus" size={18} color="#163020" />
          </TouchableOpacity>

          <View style={styles.stepperValueBox}>
            <Text style={styles.stepperValue}>
              {String(saplingCount).padStart(2, '0')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => setSaplingCount((c) => Math.min(99, c + 1))}
            activeOpacity={0.75}
          >
            <Icon name="plus" size={18} color="#163020" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.collectBtn}
          onPress={handleMarkCollected}
          activeOpacity={0.85}
        >
          <Text style={styles.collectBtnText}>Mark as collected</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9F6',
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EAE2',
    padding: 16,
    marginBottom: 22,
  },
  summaryTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 8,
  },
  summaryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryId: {
    fontSize: 12,
    color: '#7A867E',
    fontWeight: '500',
  },
  summaryNeed: {
    fontSize: 12.5,
    color: '#0D4E2B',
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0D4E2B',
    marginBottom: 10,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  slotCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotCardActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  slotTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#163020',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 11.5,
    color: '#5F6C64',
    textAlign: 'center',
  },
  slotTitleActive: {
    color: '#FFFFFF',
  },
  slotTimeActive: {
    color: '#D5EBD9',
  },
  nurseryList: {
    gap: 10,
    marginBottom: 16,
  },
  nurseryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  nurseryCardSelected: {
    borderColor: '#0D4E2B',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.8,
    borderColor: '#8B968F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#0D4E2B',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D4E2B',
  },
  nurseryInfo: {
    flex: 1,
  },
  nurseryName: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#163020',
    marginBottom: 2,
  },
  nurseryMeta: {
    fontSize: 12.5,
    color: '#6E7B73',
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
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueBox: {
    minWidth: 68,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3E22',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#F8F9F6',
    borderTopWidth: 1,
    borderTopColor: '#E5EAE2',
  },
  collectBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

