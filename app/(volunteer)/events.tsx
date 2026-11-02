/**
 * Events Screen — Tree Maintenance (Volunteer Tab)
 * Matches Image 5:
 *  - Header: Back arrow, "Tree Maintenance", avatar badge "JD"
 *  - Filter pills: "All" and "Needs Attention"
 *  - Tree Maintenance Cards:
 *      * Card 1: Young White Oak #042 (URGENT, Needs Water, Lincoln Park)
 *      * Card 2: Red Maple #109 (Healthy, Heritage Square)
 *  - Growth Timeline expander, "View Thread" link, and "Upload Update" button
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';

interface MaintenanceTree {
  id: string;
  name: string;
  tag: string;
  status: 'Needs Water' | 'Healthy';
  statusColor: string;
  statusBg: string;
  isUrgent?: boolean;
  location: string;
  lastVisit: string;
  planter: string;
  image: any;
  timeline: string[];
}

const TREES: MaintenanceTree[] = [
  {
    id: '1',
    name: 'Young White Oak #042',
    tag: '#042',
    status: 'Needs Water',
    statusColor: '#DC2626',
    statusBg: '#FEE2E2',
    isUrgent: true,
    location: 'Lincoln Park, Sector C',
    lastVisit: 'Oct 12, 2023',
    planter: 'Sarah Mitchell',
    image: require('../../assets/images/req_neem.png'),
    timeline: [
      'Oct 12, 2023: Soil dry spell noted, urgent watering assigned.',
      'Sep 28, 2023: Routine checkup, healthy growth.',
      'Aug 15, 2023: Planted by Sarah Mitchell.',
    ],
  },
  {
    id: '2',
    name: 'Red Maple #109',
    tag: '#109',
    status: 'Healthy',
    statusColor: '#059669',
    statusBg: '#D1FAE5',
    isUrgent: false,
    location: 'Heritage Square',
    lastVisit: 'Nov 02, 2023',
    planter: 'Mark J. Peterson',
    image: require('../../assets/images/req_mangrove.png'),
    timeline: [
      'Nov 02, 2023: 15cm new canopy growth, well hydrated.',
      'Oct 05, 2023: Mulching refreshed by local volunteer.',
      'Jul 20, 2023: Planted in public park square.',
    ],
  },
];

export default function EventsScreen() {
  const [filter, setFilter] = useState<'All' | 'Needs Attention'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleTimeline = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredTrees = TREES.filter((tree) => {
    if (filter === 'Needs Attention') {
      return tree.status === 'Needs Water' || tree.isUrgent;
    }
    return true;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tree Maintenance</Text>
          </View>

          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>JD</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Filter Pills ─── */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'All' && styles.filterPillActive]}
            activeOpacity={0.8}
            onPress={() => setFilter('All')}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'All' && styles.filterPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filter === 'Needs Attention' && styles.filterPillActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setFilter('Needs Attention')}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'Needs Attention' && styles.filterPillTextActive,
              ]}
            >
              Needs Attention
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Maintenance Cards ─── */}
        <View style={styles.cardsList}>
          {filteredTrees.map((tree) => {
            const isExpanded = expandedId === tree.id;
            return (
              <View key={tree.id} style={styles.treeCard}>
                {/* Image Wrap */}
                <View style={styles.imgWrap}>
                  <Image source={tree.image} style={styles.treeImg} resizeMode="cover" />
                  {tree.isUrgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                  )}
                </View>

                {/* Card Details */}
                <View style={styles.cardDetails}>
                  {/* Title & Status */}
                  <View style={styles.titleRow}>
                    <Text style={styles.treeTitle}>{tree.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: tree.statusBg }]}>
                      <Text style={[styles.statusText, { color: tree.statusColor }]}>
                        {tree.status === 'Needs Water' ? '💧 ' : '✓ '}
                        {tree.status}
                      </Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.locRow}>
                    <Text style={styles.locIcon}>📍</Text>
                    <Text style={styles.locText}>{tree.location}</Text>
                  </View>

                  {/* Meta Information */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>LAST VISIT</Text>
                      <Text style={styles.metaValue}>{tree.lastVisit}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>PLANTER</Text>
                      <Text style={styles.metaValue}>{tree.planter}</Text>
                    </View>
                  </View>

                  {/* Growth Timeline Collapsible */}
                  <TouchableOpacity
                    style={styles.timelineToggle}
                    activeOpacity={0.7}
                    onPress={() => toggleTimeline(tree.id)}
                  >
                    <Text style={styles.timelineToggleText}>Growth Timeline</Text>
                    <Text style={styles.timelineArrow}>{isExpanded ? '∧' : '∨'}</Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.timelineContent}>
                      {tree.timeline.map((entry, idx) => (
                        <View key={idx} style={styles.timelineItem}>
                          <View style={styles.timelineDot} />
                          <Text style={styles.timelineEntryText}>{entry}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Actions Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.viewThreadBtn} activeOpacity={0.7}>
                      <Text style={styles.viewThreadText}>View Thread</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.uploadBtn}
                      activeOpacity={0.85}
                      onPress={() => router.push('/upload-update')}
                    >
                      <Text style={styles.uploadIcon}>☁</Text>
                      <Text style={styles.uploadText}>Upload Update</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAF8',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  backBtn: {
    padding: Spacing[1],
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
  userBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBadgeText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },

  // Filter Pills
  filterRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  filterPill: {
    paddingHorizontal: Spacing[5],
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillActive: {
    backgroundColor: '#0F3821',
    borderColor: '#0F3821',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  filterPillTextActive: {
    color: Colors.white,
  },

  // Tree Cards
  cardsList: {
    gap: Spacing[5],
  },
  treeCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadow.sm,
  },
  imgWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  treeImg: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#DC2626',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  cardDetails: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  treeTitle: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },

  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -Spacing[1],
  },
  locIcon: {
    fontSize: 12,
  },
  locText: {
    fontSize: 13,
    color: '#64748B',
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#1E293B',
  },

  // Timeline
  timelineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[2],
  },
  timelineToggleText: {
    fontSize: 13,
    fontWeight: FontWeight.semiBold,
    color: '#059669',
  },
  timelineArrow: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#059669',
  },
  timelineContent: {
    backgroundColor: '#F8FAF8',
    borderRadius: BorderRadius.md,
    padding: Spacing[3],
    gap: Spacing[2],
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginTop: 5,
  },
  timelineEntryText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 16,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  viewThreadBtn: {
    paddingVertical: 8,
    paddingHorizontal: Spacing[2],
  },
  viewThreadText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#059669',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F3821',
    paddingHorizontal: Spacing[4],
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  uploadIcon: {
    fontSize: 13,
    color: Colors.white,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
