/**
 * Request Screen — Aanandvan
 *
 * Shows a filterable list of tree‑plantation requests.
 * Top tabs: "All", "Pending", "Approved", "Completed".
 * Each list item displays location, status badge, distance and a short description.
 * Matches the Figma design: mint‑green accent, rounded cards, subtle shadows.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, Spacing, BorderRadius, Shadow, FontSize, FontWeight } from '@/constants';

interface RequestItem {
  id: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Completed';
  distance: string;
  description: string;
}

const dummyData: RequestItem[] = [
  {
    id: 'r1',
    location: 'Sector 12 Park',
    status: 'Pending',
    distance: '0.8 km',
    description: 'Plant 5 neem saplings near the children’s playground.',
  },
  {
    id: 'r2',
    location: 'MG Road Divider',
    status: 'Approved',
    distance: '1.4 km',
    description: 'Restore mangrove seedlings along the roadside.',
  },
  {
    id: 'r3',
    location: 'Lake View Garden',
    status: 'Completed',
    distance: '2.1 km',
    description: 'Community event: 20 saplings of native oak planted.',
  },
];

const statusBgMap = {
  Pending: Colors.warningLight,
  Approved: Colors.brandMint,
  Completed: Colors.infoLight,
} as const;

export default function RequestScreen() {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Completed'>('All');

  const filtered = filter === 'All' ? dummyData : dummyData.filter((r) => r.status === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Requests</Text>
        </View>

        {/* Filter tabs */}
        <View style={styles.tabRow}>
          {(['All', 'Pending', 'Approved', 'Completed'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, filter === t ? styles.tabActive : undefined]}
              onPress={() => setFilter(t)}
            >
              <Text style={[styles.tabText, filter === t ? styles.tabTextActive : {}]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((req) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.location}>{req.location}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBgMap[req.status] }]}>
                  <Text style={styles.statusText}>{req.status}</Text>
                </View>
              </View>
              <Text style={styles.distance}>{req.distance} away</Text>
              <Text style={styles.description}>{req.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  backBtn: { padding: Spacing[2] },
  backArrow: { fontSize: 22, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  tabRow: { flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[4] },
  tabBtn: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
  },
  tabActive: { backgroundColor: Colors.brandPrimary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tabTextActive: { color: Colors.white, fontWeight: FontWeight.medium },
  listContainer: { gap: Spacing[4], paddingBottom: Spacing[8] },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[5],
    gap: Spacing[2],
    ...Shadow.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { fontSize: FontSize.base, fontWeight: FontWeight.semiBold, color: Colors.textPrimary },
  statusBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
  distance: { fontSize: FontSize.xs, color: Colors.textSecondary },
  description: { fontSize: FontSize.sm, color: Colors.textPrimary, marginTop: Spacing[1] },
});
