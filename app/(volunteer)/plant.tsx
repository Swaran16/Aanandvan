/**
 * Plant Screen — Schedule Plantation (Volunteer Tab)
 * Matches Image 4:
 *  - Header: Back arrow, "Schedule Plantation"
 *  - Select Date: THU 12 Oct, FRI 13 Oct, SAT 14 Oct, SUN 15 Oct
 *  - Select Time Slot: Morning (8:00 AM - 11:00 AM), Afternoon (3:00 PM - 6:00 PM)
 *  - Materials Checklist with toggleable check items
 *  - Notes for Admin (Optional) multiline input
 *  - "Confirm Schedule 📅" CTA button
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

const DATES = [
  { day: 'THU', date: '12', month: 'Oct' },
  { day: 'FRI', date: '13', month: 'Oct' },
  { day: 'SAT', date: '14', month: 'Oct' },
  { day: 'SUN', date: '15', month: 'Oct' },
];

const TIME_SLOTS = [
  {
    id: 'morning',
    icon: '☀️',
    title: 'Morning',
    time: '8:00 AM - 11:00 AM',
  },
  {
    id: 'afternoon',
    icon: '🌤️',
    title: 'Afternoon',
    time: '3:00 PM - 6:00 PM',
  },
];

const CHECKLIST_ITEMS = [
  'Saplings (as per request)',
  'Shovel / Digging tool',
  'Watering can / Hose',
  'Organic fertilizer / Compost',
  'Mulch',
  'Gloves',
];

export default function PlantScreen() {
  const [selectedDate, setSelectedDate] = useState('12');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'Saplings (as per request)': true,
    'Shovel / Digging tool': true,
  });
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleConfirm = () => {
    setConfirmed(true);
    Alert.alert(
      'Schedule Confirmed! 🌿',
      `Your plantation drive is scheduled for ${selectedDate} Oct (${selectedSlot === 'morning' ? '8:00 AM - 11:00 AM' : '3:00 PM - 6:00 PM'}).`,
      [
        {
          text: 'View Work & Tasks',
          onPress: () => router.push('/(volunteer)/events'),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule Plantation</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Select Date ─── */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.datesRow}>
          {DATES.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <TouchableOpacity
                key={item.date}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                  {item.date}
                </Text>
                <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>
                  {item.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Select Time Slot ─── */}
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.slotsRow}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[styles.slotCard, isSelected && styles.slotCardSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedSlot(slot.id)}
              >
                <Text style={styles.slotIcon}>{slot.icon}</Text>
                <Text style={[styles.slotTitle, isSelected && styles.slotTitleSelected]}>
                  {slot.title}
                </Text>
                <Text style={[styles.slotTime, isSelected && styles.slotTimeSelected]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Materials Checklist ─── */}
        <Text style={styles.sectionTitle}>Materials Checklist</Text>
        <Text style={styles.sectionSubtitle}>
          Please confirm you have the following items ready for the plantation drive.
        </Text>

        <View style={styles.checklistCard}>
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item];
            return (
              <TouchableOpacity
                key={item}
                style={styles.checkItem}
                activeOpacity={0.7}
                onPress={() => toggleCheck(item)}
              >
                <View style={[styles.circleCheck, isChecked && styles.circleCheckActive]}>
                  {isChecked && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkLabel, isChecked && styles.checkLabelActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Notes for Admin (Optional) ─── */}
        <Text style={styles.sectionTitle}>Notes for Admin (Optional)</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.notesInput}
            placeholder="Any specific requirements or questions..."
            placeholderTextColor="#94A3B8"
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ─── Bottom CTA Button ─── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text style={styles.ctaBtnText}>Confirm Schedule 📅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFCFA',
  },
  safeTop: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },

  // Titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
    marginBottom: Spacing[3],
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginTop: -Spacing[1],
    marginBottom: Spacing[3],
  },

  // Dates
  datesRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  dateCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: Spacing[3],
    alignItems: 'center',
    gap: 3,
    ...Shadow.sm,
  },
  dateCardSelected: {
    backgroundColor: '#0F3821',
    borderColor: '#0F3821',
  },
  dayText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: '#64748B',
  },
  dayTextSelected: {
    color: '#A7F3D0',
  },
  dateText: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  dateTextSelected: {
    color: Colors.white,
  },
  monthText: {
    fontSize: 11,
    fontWeight: FontWeight.medium,
    color: '#64748B',
  },
  monthTextSelected: {
    color: '#A7F3D0',
  },

  // Time Slots
  slotsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  slotCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  slotCardSelected: {
    backgroundColor: '#0F3821',
    borderColor: '#0F3821',
  },
  slotIcon: {
    fontSize: 26,
    marginBottom: 2,
  },
  slotTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  slotTitleSelected: {
    color: Colors.white,
  },
  slotTime: {
    fontSize: 11,
    fontWeight: FontWeight.medium,
    color: '#64748B',
  },
  slotTimeSelected: {
    color: '#A7F3D0',
  },

  // Checklist
  checklistCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: Spacing[4],
    gap: Spacing[4],
    marginBottom: Spacing[6],
    ...Shadow.sm,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  circleCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCheckActive: {
    backgroundColor: '#0F3821',
    borderColor: '#0F3821',
  },
  checkMark: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  checkLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: FontWeight.medium,
  },
  checkLabelActive: {
    fontWeight: FontWeight.semiBold,
    color: '#0F172A',
  },

  // Notes Input
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  notesInput: {
    height: 100,
    fontSize: 14,
    color: '#0F172A',
    paddingTop: 0,
  },

  // Sticky Bottom CTA
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Shadow.md,
  },
  ctaBtn: {
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: '#0F3821',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
