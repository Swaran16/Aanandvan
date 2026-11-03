/**
 * Tree Maintenance Thread & Growth History Screen
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function MaintenanceThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { maintenanceItems, addMaintenanceLog, waterTree } = useApp();

  const item = maintenanceItems.find(m => m.id === id) || maintenanceItems[0];
  const [newLog, setNewLog] = useState('');

  const handleAddLog = () => {
    if (!newLog.trim()) return;
    addMaintenanceLog(item.id, newLog);
    setNewLog('');
    Alert.alert('Log Added', 'Your field observation has been added to the tree timeline.');
  };

  const handleWater = () => {
    waterTree(item.id);
    Alert.alert('Hydration Confirmed 💧', 'Tree marked healthy with full hydration log recorded.');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{item.treeName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.heroBox}>
          <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{item.treeName}</Text>
            <Text style={styles.heroSubtitle}>{item.location}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMetaText}>Planter: {item.planterName}</Text>
              <Text style={styles.heroMetaText}>Last Visit: {item.lastVisit}</Text>
            </View>
          </View>
        </View>

        {/* Quick Water Button */}
        <TouchableOpacity
          style={styles.waterBtn}
          activeOpacity={0.85}
          onPress={handleWater}
        >
          <Icon name="water" size={18} color="#FFFFFF" />
          <Text style={styles.waterBtnText}>Log Hydration & Mulch 💧</Text>
        </TouchableOpacity>

        {/* Timeline Thread */}
        <Text style={styles.sectionTitle}>Observation Thread & History</Text>
        <View style={styles.timelineList}>
          {item.timeline.map((entry, idx) => (
            <View key={idx} style={styles.timelineCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDate}>{entry.date}</Text>
              </View>
              <Text style={styles.entryDesc}>{entry.description}</Text>
            </View>
          ))}
        </View>

        {/* Add Observation Note */}
        <View style={styles.newLogCard}>
          <Text style={styles.newLogTitle}>Add Maintenance Observation</Text>
          <TextInput
            style={styles.newLogInput}
            multiline
            placeholder="Record soil moisture, pests, weed clearing, or pruning..."
            placeholderTextColor="#9CA3AF"
            value={newLog}
            onChangeText={setNewLog}
          />
          <TouchableOpacity style={styles.postLogBtn} onPress={handleAddLog}>
            <Text style={styles.postLogBtnText}>Post Observation</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  heroContent: {
    padding: 16,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  heroMetaText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  waterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 48,
    gap: 8,
    marginBottom: 20,
  },
  waterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 12,
  },
  timelineList: {
    gap: 12,
    marginBottom: 20,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  entryDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  entryDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  newLogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  newLogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 8,
  },
  newLogInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 13,
    color: '#111827',
  },
  postLogBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  postLogBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

