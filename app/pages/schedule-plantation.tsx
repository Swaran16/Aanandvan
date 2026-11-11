import React, { useMemo, useState } from 'react';
import {
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
import { useApp } from '@/context/AppContext';

const DATES = [
  { id: 'thu-12', day: 'Thu', date: '12', month: 'Oct', full: 'Thu, 12 Oct' },
  { id: 'fri-13', day: 'Fri', date: '13', month: 'Oct', full: 'Fri, 13 Oct' },
  { id: 'sat-14', day: 'Sat', date: '14', month: 'Oct', full: 'Sat, 14 Oct' },
  { id: 'sun-15', day: 'Sun', date: '15', month: 'Oct', full: 'Sun, 15 Oct' },
  { id: 'mon-16', day: 'Mon', date: '16', month: 'Oct', full: 'Mon, 16 Oct' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '8:00 AM - 11:00 AM', value: 'Morning (8:00 AM - 11:00 AM)' },
  { id: 'afternoon', label: 'Afternoon', time: '3:00 PM - 6:00 PM', value: 'Afternoon (3:00 PM - 6:00 PM)' },
];

const CHECKLIST_ITEMS = [
  'Native saplings (arranged or pickup confirmed)',
  'Organic compost / Vermicompost (2-3 kg per sapling)',
  'Bamboo tree guard / Tree protection cage',
  'Gardening spade / Trowel & digging tools',
  'Watering can / Water supply arrangement',
  'Gardening gloves & safety gear',
];

export default function SchedulePlantationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, volunteerAcceptRequest, volunteerScheduleRequest } = useApp();

  const req = useMemo(() => {
    if (!id) return requests[0];
    return requests.find((r) => r.id === id) ?? requests[0];
  }, [id, requests]);

  const [selectedDateId, setSelectedDateId] = useState<string>('thu-12');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('morning');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    [CHECKLIST_ITEMS[0]]: true,
    [CHECKLIST_ITEMS[1]]: true,
    [CHECKLIST_ITEMS[3]]: true,
  });
  const [notes, setNotes] = useState('');

  if (!req) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule plantation</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedId = `#${req.id.toUpperCase()}`;

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleConfirm = () => {
    const pickedDate = DATES.find((d) => d.id === selectedDateId)?.full ?? 'Thu, 12 Oct';
    const pickedSlot =
      TIME_SLOTS.find((s) => s.id === selectedSlotId)?.value ??
      'Morning (8:00 AM - 11:00 AM)';

    if (req.status === 'verified') {
      volunteerAcceptRequest(req.id);
    }

    volunteerScheduleRequest(req.id, {
      date: pickedDate,
      timeSlot: pickedSlot,
      checklist: CHECKLIST_ITEMS.filter((item) => checkedItems[item]),
      notes: notes.trim() || undefined,
      confirmedAt: new Date().toISOString(),
      isApprovedByAdmin: true,
    });

    router.push({ pathname: '/pages/collect-saplings', params: { id: req.id } } as any);
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
        <Text style={styles.headerTitle}>Schedule plantation</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reqHeaderBlock}>
          <Text style={styles.reqTitle}>{req.title}</Text>
          <View style={styles.reqMetaRow}>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color="#5F6C64" />
              <Text style={styles.locationText}>{req.location}</Text>
            </View>
            <Text style={styles.reqIdText}>{formattedId}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select date</Text>
        <View style={styles.datesRow}>
          {DATES.map((d) => {
            const active = selectedDateId === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.dateCard, active && styles.dateCardActive]}
                onPress={() => setSelectedDateId(d.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateDay, active && styles.dateTextActive]}>
                  {d.day}
                </Text>
                <Text style={[styles.dateNum, active && styles.dateTextActive]}>
                  {d.date}
                </Text>
                <Text style={[styles.dateMonth, active && styles.dateTextActive]}>
                  {d.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Select time slot</Text>
        <View style={styles.slotsRow}>
          {TIME_SLOTS.map((slot) => {
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

        <Text style={styles.sectionLabel}>Checklist of materials</Text>
        <View style={styles.checklistList}>
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item];
            return (
              <TouchableOpacity
                key={item}
                style={styles.checkRow}
                onPress={() => toggleCheck(item)}
                activeOpacity={0.75}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Icon name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkLabel}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Additional notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Add your comments here..."
          placeholderTextColor="#8B968F"
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmBtnText}>Confirm schedule</Text>
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
    paddingTop: 4,
    paddingBottom: 24,
  },
  reqHeaderBlock: {
    marginBottom: 22,
  },
  reqTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 6,
  },
  reqMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  locationText: {
    fontSize: 13,
    color: '#5F6C64',
    flexShrink: 1,
  },
  reqIdText: {
    fontSize: 12,
    color: '#7A867E',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0D4E2B',
    marginBottom: 10,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCardActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  dateDay: {
    fontSize: 11.5,
    color: '#6E7B73',
    marginBottom: 2,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#163020',
  },
  dateMonth: {
    fontSize: 11,
    color: '#6E7B73',
    marginTop: 1,
  },
  dateTextActive: {
    color: '#FFFFFF',
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
  slotTextActive: {
    color: '#FFFFFF',
  },
  slotSubActive: {
    color: '#D5EBD9',
  },
  checklistList: {
    gap: 12,
    marginBottom: 22,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#8B968F',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  checkLabel: {
    flex: 1,
    fontSize: 13.5,
    color: '#2B3E33',
    lineHeight: 19,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 12,
    padding: 14,
    minHeight: 104,
    fontSize: 13.5,
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
  confirmBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
