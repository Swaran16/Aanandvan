/**
 * Active Tasks Screen — Aanandvan
 * Displays all current plantation and nurturing tasks assigned to the volunteer.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { PlantationRequest } from '@/types';

export default function ActiveChallengesScreen() {
  const { requests, currentUser } = useApp();

  // Live tasks currently assigned to the volunteer
  const assignedTasks = requests.filter(
    (r) =>
      r.status === 'assigned' ||
      r.status === 'scheduled' ||
      r.status === 'in_progress' ||
      (r.status === 'completed' &&
        (!r.assignedVolunteerName ||
          r.assignedVolunteerName.includes('Vaibhav') ||
          r.assignedVolunteerName.includes('Shirke')))
  );

  const renderAssignedCard = (item: PlantationRequest) => {
    const hasSchedule = !!item.schedule?.date;
    const isPlanted = !!item.activityUpdate?.photos?.length || item.status === 'completed';
    const needsScheduling = !hasSchedule && item.status === 'assigned';

    const thumb =
      item.areaPhotos?.[0] ||
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop';

    return (
      <View key={item.id} style={styles.assignedCard}>
        <View style={styles.assignedCardTop}>
          <Image source={{ uri: thumb }} style={styles.assignedThumb} resizeMode="cover" />

          <View style={styles.assignedInfo}>
            <View style={styles.assignedMetaRow}>
              <Text style={styles.assignedId}>#{item.id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  isPlanted
                    ? styles.statusPlanted
                    : hasSchedule
                    ? styles.statusScheduled
                    : styles.statusAssigned,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isPlanted
                      ? styles.statusPlantedText
                      : hasSchedule
                      ? styles.statusScheduledText
                      : styles.statusAssignedText,
                  ]}
                >
                  {isPlanted
                    ? 'Planted • Care Due'
                    : hasSchedule
                    ? `Scheduled: ${item.schedule?.date}`
                    : 'Awaiting Schedule'}
                </Text>
              </View>
            </View>

            <Text style={styles.assignedTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.assignedLocRow}>
              <Icon name="map-pin" size={12} color="#6B7280" />
              <Text style={styles.assignedLoc} numberOfLines={1}>
                {item.manualAddress || item.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.assignedActionsRow}>
          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() =>
              router.push({
                pathname: '/pages/request-details',
                params: { id: item.id },
              } as any)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.detailsBtnText}>View Details</Text>
          </TouchableOpacity>

          {needsScheduling && (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() =>
                router.push({
                  pathname: '/pages/schedule-plantation',
                  params: { id: item.id },
                } as any)
              }
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionBtnText}>Schedule Drive</Text>
            </TouchableOpacity>
          )}

          {hasSchedule && !isPlanted && (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() =>
                router.push({
                  pathname: '/pages/upload-activity',
                  params: { id: item.id },
                } as any)
              }
              activeOpacity={0.85}
            >
              <Icon name="camera" size={14} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>Upload Photos</Text>
            </TouchableOpacity>
          )}

          {isPlanted && (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() =>
                router.push({
                  pathname: '/pages/log-nurturing',
                  params: { id: item.id },
                } as any)
              }
              activeOpacity={0.85}
            >
              <Icon name="water" size={14} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>Log Care</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163E2B" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Tasks Assigned to Me</Text>
          <Text style={styles.headerSubtitle}>Active field drives &amp; ongoing care</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>{assignedTasks.length} Active</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Current Workload</Text>
          <Text style={styles.sectionCount}>{assignedTasks.length} in progress</Text>
        </View>

        {assignedTasks.length > 0 ? (
          assignedTasks.map(renderAssignedCard)
        ) : (
          <View style={styles.emptyTasksBox}>
            <Icon name="check-circle" size={32} color="#059669" />
            <Text style={styles.emptyTasksTitle}>No pending assignments</Text>
            <Text style={styles.emptyTasksSub}>
              Accept a new verified plantation drive from Available Requests to begin your next task!
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push('/(volunteer)/available' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnText}>Take New Step →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: '#EBF29D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE588',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#163E2B',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163E2B',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  /* Assigned Task Card */
  assignedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  assignedCardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  assignedThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  assignedInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  assignedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assignedId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  statusPlanted: {
    backgroundColor: '#ECFDF5',
  },
  statusPlantedText: {
    color: '#047857',
  },
  statusScheduled: {
    backgroundColor: '#EFF6FF',
  },
  statusScheduledText: {
    color: '#1D4ED8',
  },
  statusAssigned: {
    backgroundColor: '#FEF3C7',
  },
  statusAssignedText: {
    color: '#B45309',
  },
  assignedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  assignedLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignedLoc: {
    fontSize: 11.5,
    color: '#6B7280',
    flex: 1,
  },
  assignedActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  detailsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#374151',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#163E2B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  primaryActionBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyTasksBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  emptyTasksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  emptyTasksSub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: 280,
  },
  exploreBtn: {
    marginTop: 14,
    backgroundColor: '#163E2B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
