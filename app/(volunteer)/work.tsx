import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { MaintenanceItem } from '@/types';


type AlertFilter = 'all' | 'needs_attention' | 'completed';

const formatReqId = (treeTag: string) => {
  const digits = treeTag.replace(/[^0-9]/g, '').padStart(4, '0');
  return `#REQ-2024-${digits}`;
};

export default function VolunteerAlertsScreen() {
  const { maintenanceItems, requests } = useApp();
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredItems = useMemo(() => {
    return maintenanceItems.filter((item) => {
      if (filter === 'needs_attention') {
        return item.status === 'needs_water' || item.status === 'pruning_needed' || item.isUrgent;
      }
      if (filter === 'completed') {
        return item.status === 'healthy' && !item.isUrgent;
      }
      return true;
    });
  }, [maintenanceItems, filter]);

  const toggleTimeline = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resolveRequestId = (item: MaintenanceItem) => {
    const matched = requests.find(
      (r) =>
        r.title.toLowerCase().includes(item.treeName.toLowerCase()) ||
        r.location.toLowerCase() === item.location.toLowerCase()
    );
    return matched?.id ?? requests[0]?.id ?? 'REQ-2024-0042';
  };

  const openDetails = (item: MaintenanceItem) => {
    router.push({
      pathname: '/pages/request-details',
      params: { id: resolveRequestId(item) },
    } as any);
  };

  const openUploadUpdate = (item: MaintenanceItem) => {
    router.push({
      pathname: '/pages/log-nurturing',
      params: { id: resolveRequestId(item) },
    } as any);
  };

  const renderCard = ({ item }: { item: MaintenanceItem }) => {
    const needsAttention =
      item.status === 'needs_water' || item.status === 'pruning_needed' || item.isUrgent;
    const isExpanded = !!expanded[item.id];
    const badgeLabel =
      item.status === 'needs_water'
        ? 'Need water'
        : item.status === 'pruning_needed'
          ? 'Need care'
          : 'Completed';
    const taskLabel =
      item.status === 'needs_water'
        ? 'Water the plants'
        : item.status === 'pruning_needed'
          ? 'Trim & care'
          : 'Water the plants';

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openDetails(item)}
          style={styles.imageWrapper}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.statusPill,
              needsAttention ? styles.statusPillWarn : styles.statusPillOk,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: needsAttention ? '#DF6C4F' : '#1B7E48' },
              ]}
            />
            <Text
              style={[
                styles.statusPillText,
                { color: needsAttention ? '#B44F32' : '#0D4E2B' },
              ]}
            >
              {badgeLabel}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.reqIdText}>{formatReqId(item.treeTag)}</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={() => openDetails(item)}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.treeName}
          </Text>
        </TouchableOpacity>

        <View style={styles.locationRow}>
          <Icon name="map-pin" size={13} color="#5F6C64" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Task</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {taskLabel}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Last visit</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {item.lastVisit}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Planter</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {item.planterName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.timelineHeader}
          onPress={() => toggleTimeline(item.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.timelineLabel}>Growth timeline</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#4F5C54"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.timelineBody}>
            {item.timeline.map((ev, idx) => (
              <View key={`${item.id}-ev-${idx}`} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {ev.title} • {ev.date}
                  </Text>
                  <Text style={styles.timelineDesc}>{ev.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {needsAttention ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.threadBtn}
              onPress={() => openDetails(item)}
              activeOpacity={0.75}
            >
              <Text style={styles.threadBtnText}>View Care Thread 💬</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => openUploadUpdate(item)}
              activeOpacity={0.85}
            >
              <Text style={styles.uploadBtnText}>Log Nurturing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.detailsOutlineBtn}
            onPress={() => openDetails(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsOutlineBtnText}>View details</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Field Care Alerts</Text>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
          {filter === 'all' && <Icon name="close" size={12} color="#FFFFFF" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            filter === 'needs_attention' && styles.filterPillActive,
          ]}
          onPress={() => setFilter('needs_attention')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'needs_attention' && styles.filterTextActive,
            ]}
          >
            Needs attention
          </Text>
          {filter === 'needs_attention' && (
            <Icon name="close" size={12} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'completed' && styles.filterPillActive]}
          onPress={() => setFilter('completed')}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}
          >
            Completed
          </Text>
          {filter === 'completed' && <Icon name="close" size={12} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="bell" size={36} color="#8BA093" />
            <Text style={styles.emptyTitle}>No alerts right now</Text>
            <Text style={styles.emptySub}>
              All planted saplings are currently healthy and up to date.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CED7CD',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4F5C54',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageWrapper: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  statusPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 5,
  },
  statusPillWarn: {
    backgroundColor: '#FEF2F2',
  },
  statusPillOk: {
    backgroundColor: '#ECFDF5',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reqIdText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  timelineBody: {
    paddingBottom: 8,
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#163E2B',
    marginTop: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  timelineDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  threadBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#163E2B',
  },
  uploadBtn: {
    flex: 1.5,
    backgroundColor: '#163E2B',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsOutlineBtn: {
    marginTop: 4,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#163E2B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsOutlineBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#163E2B',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#163020',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#6C7870',
    textAlign: 'center',
  },
});
