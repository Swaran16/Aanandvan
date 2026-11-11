/**
 * Admin Settings Screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

export default function AdminSettingsScreen() {
  const [autoVerify, setAutoVerify] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [duplicateScan, setDuplicateScan] = useState(true);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Platform Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verification & AI Rules</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>AI Duplicate Location Detection</Text>
              <Text style={styles.switchSub}>Flags multiple requests within 50 meters</Text>
            </View>
            <Switch
              value={duplicateScan}
              onValueChange={setDuplicateScan}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Auto-Verify Level 4 Volunteers</Text>
              <Text style={styles.switchSub}>Instantly confirm scheduled drives from trusted volunteers</Text>
            </View>
            <Switch
              value={autoVerify}
              onValueChange={setAutoVerify}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Urgent Hydration Alerts</Text>
              <Text style={styles.switchSub}>Push notification when tree exceeds 7 days without rain</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#0B3B24' }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 6 },
  topTitle: { fontSize: 18, fontWeight: '800', color: '#0B3B24' },
  content: { padding: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0B3B24', marginBottom: 14 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  switchSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
});

