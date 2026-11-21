/**
 * Admin Settings & Zone Configuration Screen — Aanandvan
 *
 * Clean, practical administrative settings:
 * - Dadar & Mumbai Zone Coverage
 * - AI Duplicate & Feasibility Scanner
 * - Alternate-day Nurturing Reminders
 * - Admin Emergency Helpline & Support
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

export default function AdminSettingsScreen() {
  const [duplicateScan, setDuplicateScan] = useState(true);
  const [alternateDayReminders, setAlternateDayReminders] = useState(true);
  const [autoTakeoverAlerts, setAutoTakeoverAlerts] = useState(true);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Platform Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Dadar & Mumbai Active Zones */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Active Operational Zones</Text>
          <Text style={styles.cardSub}>
            Aanandvan field volunteer operations are currently active across the following Mumbai municipal wards:
          </Text>

          <View style={styles.zonesList}>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>📍 Shivaji Park & Ranade Road (Dadar W)</Text>
            </View>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>📍 Dadar TT & Hindu Colony</Text>
            </View>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>📍 Five Gardens & Matunga East</Text>
            </View>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>📍 Prabhadevi Beachside Garden</Text>
            </View>
            <View style={styles.zonePill}>
              <Text style={styles.zonePillText}>📍 Wadala West & Five Bungalows</Text>
            </View>
          </View>
        </View>

        {/* Operational Rules */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Verification & Alert Rules</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>Nearby Duplicate Detection</Text>
              <Text style={styles.switchSub}>Flags multiple requests logged within 50 meters of an existing site</Text>
            </View>
            <Switch
              value={duplicateScan}
              onValueChange={setDuplicateScan}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>Alternate-Day Nurturing Reminders</Text>
              <Text style={styles.switchSub}>Sends automated push reminders to assigned volunteers every 48 hours</Text>
            </View>
            <Switch
              value={alternateDayReminders}
              onValueChange={setAlternateDayReminders}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchTitle}>Unassigned Request Takeover Alerts</Text>
              <Text style={styles.switchSub}>Highlights verified requests unaccepted by volunteers for &gt; 3 days</Text>
            </View>
            <Switch
              value={autoTakeoverAlerts}
              onValueChange={setAutoTakeoverAlerts}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>
        </View>

        {/* Administrative Helpline */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Aanandvan Field Support</Text>
          <Text style={styles.helplineText}>
            Central Coordinator: +91 98200 12345{'\n'}
            Email: admin@aanandvan.in{'\n'}
            Hub: Shivaji Park Smarak Ground, Dadar West, Mumbai 400028
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFBF9' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FAFBF9',
  },
  backBtn: { padding: 4 },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#0B3B24' },
  content: { padding: 18, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0B3B24', marginBottom: 6 },
  cardSub: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  zonesList: {
    gap: 8,
  },
  zonePill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  zonePillText: {
    fontSize: 12.5,
    color: '#166534',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchTitle: { fontSize: 13.5, fontWeight: '700', color: '#111827' },
  switchSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  helplineText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
  },
});
