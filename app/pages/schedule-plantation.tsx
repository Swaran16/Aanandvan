/**
 * Volunteer Schedule Plantation Screen
 * Matches Batch 3 — Image 2:
 * - Back button + "Schedule Plantation"
 * - Select Date: Horizontal date selector (THU 12, FRI 13, SAT 14, SUN 15 Oct)
 * - Select Time Slot: Morning (8-11 AM), Afternoon (3-6 PM)
 * - Materials Checklist: 6 checkable preparation items
 * - Notes for Admin (Optional)
 * - "Confirm Schedule" primary CTA
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const DATES = [
  { day: 'THU', num: '12', month: 'Oct', full: 'Oct 12, 2026' },
  { day: 'FRI', num: '13', month: 'Oct', full: 'Oct 13, 2026' },
  { day: 'SAT', num: '14', month: 'Oct', full: 'Oct 14, 2026' },
  { day: 'SUN', num: '15', month: 'Oct', full: 'Oct 15, 2026' },
];

const CHECKLIST_ITEMS = [
  'Saplings (as per request)',
  'Shovel / Digging tool',
  'Watering can / Hose',
  'Organic fertilizer / Compost',
  'Mulch',
  'Gloves',
];

export default function SchedulePlantationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, volunteerScheduleRequest } = useApp();

  const req = requests.find(r => r.id === id) || requests[0];

  const [selectedDate, setSelectedDate] = useState('Oct 12, 2026');
  const [selectedSlot, setSelectedSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'Saplings (as per request)': true,
    'Shovel / Digging tool': true,
  });
  const [notes, setNotes] = useState('');

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleConfirm = () => {
    volunteerScheduleRequest(req.id, {
      date: selectedDate,
      timeSlot: selectedSlot,
      checklist: Object.keys(checkedItems).filter(k => checkedItems[k]),
      notes,
      isApprovedByAdmin: false,
    });

    Alert.alert(
      'Schedule Submitted 📅',
      `Your plantation drive for "${req.title}" has been scheduled on ${selectedDate} (${selectedSlot}) and sent to Admin for review. Once confirmed, you can proceed to execute and post before/after updates!`,
      [
        {
          text: 'Go to Work',
          onPress: () => router.replace('/(volunteer)/work' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Schedule Plantation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Select Date ─── */}
        <Text style={styles.sectionHeading}>Select Date</Text>
        <View style={styles.datesRow}>
          {DATES.map((item, idx) => {
            const isSelected = selectedDate === item.full;

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.dateCard, isSelected ? styles.dateCardActive : undefined]}
                onPress={() => setSelectedDate(item.full)}
              >
                <Text
                  style={[styles.dateDayText, isSelected ? styles.dateTextActive : undefined]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[styles.dateNumText, isSelected ? styles.dateTextActive : undefined]}
                >
                  {item.num}
                </Text>
                <Text
                  style={[styles.dateMonthText, isSelected ? styles.dateTextActive : undefined]}
                >
                  {item.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Select Time Slot ─── */}
        <Text style={styles.sectionHeading}>Select Time Slot</Text>
        <View style={styles.timeSlotsRow}>
          {/* Morning */}
          <TouchableOpacity
            style={[
              styles.timeSlotCard,
              selectedSlot.startsWith('Morning') ? styles.timeSlotCardActive : undefined,
            ]}
            onPress={() => setSelectedSlot('Morning (8:00 AM - 11:00 AM)')}
          >
            <Icon
              name="sun"
              size={22}
              color={selectedSlot.startsWith('Morning') ? '#FFFFFF' : '#0B3B24'}
            />
            <Text
              style={[
                styles.slotTitle,
                selectedSlot.startsWith('Morning') ? styles.slotTextActive : undefined,
              ]}
            >
              Morning
            </Text>
            <Text
              style={[
                styles.slotTime,
                selectedSlot.startsWith('Morning') ? styles.slotSubActive : undefined,
              ]}
            >
              8:00 AM - 11:00 AM
            </Text>
          </TouchableOpacity>

          {/* Afternoon */}
          <TouchableOpacity
            style={[
              styles.timeSlotCard,
              selectedSlot.startsWith('Afternoon') ? styles.timeSlotCardActive : undefined,
            ]}
            onPress={() => setSelectedSlot('Afternoon (3:00 PM - 6:00 PM)')}
          >
            <Icon
              name="sun"
              size={22}
              color={selectedSlot.startsWith('Afternoon') ? '#FFFFFF' : '#0B3B24'}
            />
            <Text
              style={[
                styles.slotTitle,
                selectedSlot.startsWith('Afternoon') ? styles.slotTextActive : undefined,
              ]}
            >
              Afternoon
            </Text>
            <Text
              style={[
                styles.slotTime,
                selectedSlot.startsWith('Afternoon') ? styles.slotSubActive : undefined,
              ]}
            >
              3:00 PM - 6:00 PM
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Materials Checklist ─── */}
        <View style={styles.checklistSection}>
          <Text style={styles.sectionHeading}>Materials Checklist</Text>
          <Text style={styles.checklistSubtitle}>
            Please confirm you have the following items ready for the plantation
            drive.
          </Text>

          <View style={styles.checklistCard}>
            {CHECKLIST_ITEMS.map((item, idx) => {
              const isChecked = !!checkedItems[item];

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkItemRow}
                  activeOpacity={0.8}
                  onPress={() => toggleCheck(item)}
                >
                  <View
                    style={[
                      styles.circleCheckbox,
                      isChecked ? styles.circleCheckboxChecked : undefined,
                    ]}
                  >
                    {isChecked && <Icon name="check" size={12} color="#FFFFFF" />}
                  </View>
                  <Text
                    style={[
                      styles.checkItemText,
                      isChecked ? styles.checkItemTextChecked : undefined,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── Notes for Admin (Optional) ─── */}
        <Text style={styles.sectionHeading}>Notes for Admin (Optional)</Text>
        <View style={styles.notesCard}>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Any specific requirements or questions..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ─── Confirm Button ─── */}
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Icon name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>Confirm Schedule</Text>
        </TouchableOpacity>
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
    fontSize: 19,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dateCardActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  dateDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  dateNumText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginVertical: 2,
  },
  dateMonthText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  timeSlotCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  timeSlotCardActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  slotTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
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
    color: '#A8D5BA',
  },
  checklistSection: {
    marginBottom: 24,
  },
  checklistSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: -6,
    marginBottom: 12,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 14,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCheckboxChecked: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  checkItemText: {
    fontSize: 14,
    color: '#374151',
  },
  checkItemTextChecked: {
    fontWeight: '700',
    color: '#111827',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 24,
  },
  notesInput: {
    height: 90,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#111827',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    borderRadius: 16,
    height: 54,
    gap: 8,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

