/**
 * Volunteer Tree Maintenance Screen (Tab 3: Work)
 * Matches Batch 2 — Image 5:
 * - Back button + Tree Maintenance title + User initials circle
 * - Filter pills: [All], [Needs Attention]
 * - Urgent and Healthy maintenance cards with photo, location, planter, last visit
 * - Expandable Growth Timeline
 * - Interactive actions: "View Thread" (opens timeline thread) & "Upload Update"
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function VolunteerWorkScreen() {
  const { maintenanceItems, waterTree } = useApp();
  const [filter, setFilter] = useState<'all' | 'needs_attention'>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'maint-1': true });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = maintenanceItems.filter(item => {
    if (filter === 'needs_attention') {
      return item.status === 'needs_water' || item.isUrgent;
    }
    return true;
  });

  const handleWater = (id: string, name: string) => {
    waterTree(id);
    Alert.alert('Hydration Logged 💧', `${name} has been watered and marked Healthy!`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push('/(volunteer)' as any)}
          style={styles.backBtn}
        >
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Tree Maintenance</Text>
        <View style={styles.initialsBadge}>
          <Text style={styles.initialsText}>AK</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Filter Pills ─── */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'all' && styles.filterPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filter === 'needs_attention' && styles.filterPillActive,
            ]}
            onPress={() => setFilter('needs_attention')}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'needs_attention' && styles.filterPillTextActive,
              ]}
            >
              Needs Attention
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Maintenance Cards ─── */}
        <View style={styles.cardsList}>
          {filteredItems.map(item => {
            const isUrgent = item.isUrgent || item.status === 'needs_water';
            const isExpanded = !!expanded[item.id];

            return (
              <View key={item.id} style={styles.card}>
                {/* Tree Image with Urgent Tag */}
                <View style={styles.imageBox}>
                  <Image source={{ uri: item.imageUrl }} style={styles.treeImage} />
                  {isUrgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>URGENT</Text>
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.treeTitle}>{item.treeName}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        isUrgent ? styles.statusPillUrgent : styles.statusPillHealthy,
                      ]}
                    >
                      <Icon
                        name={isUrgent ? 'water' : 'check'}
                        size={12}
                        color={isUrgent ? '#DC2626' : '#059669'}
                      />
                      <Text
                        style={[
                          styles.statusPillText,
                          isUrgent
                            ? styles.statusPillTextUrgent
                            : styles.statusPillTextHealthy,
                        ]}
                      >
                        {isUrgent ? 'Needs Water' : 'Healthy'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locRow}>
                    <Icon name="map-pin" size={13} color="#6B7280" />
                    <Text style={styles.locText}>{item.location}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View>
                      <Text style={styles.metaLabel}>LAST VISIT</Text>
                      <Text style={styles.metaValue}>{item.lastVisit}</Text>
                    </View>
                    <View>
                      <Text style={styles.metaLabel}>PLANTER</Text>
                      <Text style={styles.metaValue}>{item.planterName}</Text>
                    </View>
                  </View>

                  {/* Expandable Growth Timeline */}
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    activeOpacity={0.7}
                    onPress={() => toggleExpand(item.id)}
                  >
                    <Text style={styles.accordionTitle}>Growth Timeline</Text>
                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#0B3B24"
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.timelineBody}>
                      {item.timeline.map((evt, idx) => (
                        <View key={idx} style={styles.timelineItem}>
                          <View style={styles.timelineDot} />
                          <View style={styles.timelineContent}>
                            <View style={styles.timelineDateRow}>
                              <Text style={styles.timelineTitle}>{evt.title}</Text>
                              <Text style={styles.timelineDate}>{evt.date}</Text>
                            </View>
                            <Text style={styles.timelineDesc}>{evt.description}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.viewThreadBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/pages/maintenance-thread',
                          params: { id: item.id },
                        } as any)
                      }
                    >
                      <Text style={styles.viewThreadText}>View Thread</Text>
                    </TouchableOpacity>

                    {isUrgent ? (
                      <TouchableOpacity
                        style={[styles.uploadUpdateBtn, { backgroundColor: '#2563EB' }]}
                        onPress={() => handleWater(item.id, item.treeName)}
                      >
                        <Icon name="water" size={15} color="#FFFFFF" />
                        <Text style={styles.uploadUpdateText}>Log Watered</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.uploadUpdateBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/pages/upload-activity',
                            params: { id: item.id },
                          } as any)
                        }
                      >
                        <Icon name="upload" size={15} color="#FFFFFF" />
                        <Text style={styles.uploadUpdateText}>Upload Update</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
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
  },
  backBtn: {
    padding: 6,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  initialsBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#C7EED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 14,
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
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
  },
  filterPillActive: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardsList: {
    gap: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageBox: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  treeImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  treeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusPillUrgent: {
    backgroundColor: '#FEE2E2',
  },
  statusPillHealthy: {
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextUrgent: {
    color: '#DC2626',
  },
  statusPillTextHealthy: {
    color: '#059669',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
  },
  timelineBody: {
    paddingLeft: 10,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E2F3E9',
    gap: 12,
    marginBottom: 8,
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 14,
  },
  timelineDot: {
    position: 'absolute',
    left: -17,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B3B24',
  },
  timelineContent: {},
  timelineDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  timelineDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  viewThreadBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewThreadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
  },
  uploadUpdateBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
  },
  uploadUpdateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

