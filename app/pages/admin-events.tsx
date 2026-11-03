/**
 * Admin Events Screen
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

export default function AdminEventsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Plantation Events</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.eventTitle}>Mega Monsoon Plantation Drive</Text>
          <Text style={styles.eventDate}>Sunday, 20 Oct 2026 • 8:00 AM</Text>
          <Text style={styles.eventLoc}>Aravalli Biodiversity Park, Gurugram</Text>
          <Text style={styles.eventDesc}>
            Community-scale sapling drive targeting 500 indigenous trees with 80+ volunteers participating.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => alert('New event creation modal')}
        >
          <Icon name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Schedule New Public Drive</Text>
        </TouchableOpacity>
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
  content: { padding: 18, gap: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    gap: 6,
  },
  eventTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  eventDate: { fontSize: 12, fontWeight: '700', color: '#059669' },
  eventLoc: { fontSize: 13, color: '#6B7280' },
  eventDesc: { fontSize: 13, color: '#374151', lineHeight: 18, marginTop: 4 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    borderRadius: 14,
    height: 50,
    gap: 8,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

