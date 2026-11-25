/**
 * Active Challenges Screen — Aanandvan
 *
 * Shows:
 * 1. Current Tasks Assigned to Me (live workload with direct action buttons)
 * 2. Community Challenges & Season Missions (Hydration streak, Squad planting, Tree guard patrol)
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { DashboardPalette } from '@/constants/colors';
import { PlantationRequest } from '@/types';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tag: string;
  tagBg: string;
  tagFg: string;
  current: number;
  total: number;
  reward: string;
  deadline: string;
  joined: boolean;
}

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Summer Hydration Streak',
    description: 'Log root watering visits for 10 assigned saplings to beat midday heat in Dadar.',
    icon: 'water',
    tag: 'Priority Hydration',
    tagBg: '#DBE8F0',
    tagFg: '#0369A1',
    current: 7,
    total: 10,
    reward: '🌱 +50 Green Points & Hydration Hero Badge',
    deadline: 'Ends in 3 days',
    joined: true,
  },
  {
    id: 'ch-2',
    title: 'Weekend Squad Planting Drive',
    description: 'Ground 5 native saplings (Neem, Peepal, Jamun) with your local volunteer squad.',
    icon: 'plant',
    tag: 'Plantation Drive',
    tagBg: '#CDE1D2',
    tagFg: '#166534',
    current: 3,
    total: 5,
    reward: '🌳 Master Planter Badge & Community Shoutout',
    deadline: 'Saturday 8:00 AM',
    joined: true,
  },
  {
    id: 'ch-3',
    title: 'Tree Guard Patrol & Alignment',
    description: 'Inspect and straighten 5 protective bamboo/metal tree guards at Dadar TT circle.',
    icon: 'shield',
    tag: 'Tree Protection',
    tagBg: '#EBF29D',
    tagFg: '#854D0E',
    current: 2,
    total: 5,
    reward: '🛡️ Guardian Shield Badge',
    deadline: 'Ends Sunday',
    joined: false,
  },
  {
    id: 'ch-4',
    title: 'Canopy Health Photo Check',
    description: 'Capture and upload 8 clear growth monitoring photos for newly planted roadside saplings.',
    icon: 'camera',
    tag: 'Monitoring',
    tagBg: '#F3F4F6',
    tagFg: '#4B5563',
    current: 4,
    total: 8,
    reward: '📷 Green Inspector Badge',
    deadline: 'Ongoing challenge',
    joined: false,
  },
];

export default function ActiveChallengesScreen() {
  const { requests, currentUser } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  // Live tasks currently assigned to the volunteer
  const assignedTasks = requests.filter(
    (r) =>
      r.status === 'assigned' ||
      r.status === 'scheduled' ||
      r.status === 'in_progress' ||
      (r.status === 'completed' && (!r.assignedVolunteerName || r.assignedVolunteerName.includes('Vaibhav')))
  );

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.joined;
          Alert.alert(
            next ? 'Challenge Joined! 🎯' : 'Challenge Paused',
            next
              ? `You have entered the "${c.title}" challenge. Complete tasks from your assigned list to progress!`
              : `You have paused "${c.title}".`
          );
          return { ...c, joined: next };
        }
        return c;
      })
    );
  };

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

        {/* Assigned Card Actions */}
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
          <Text style={styles.headerTitle}>Active Challenges &amp; Tasks</Text>
          <Text style={styles.headerSubtitle}>Tasks assigned to you &amp; field missions</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>{assignedTasks.length} Assigned</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── SECTION 1: Tasks Assigned to Me ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Current Tasks Assigned to Me</Text>
          <Text style={styles.sectionCount}>{assignedTasks.length} in progress</Text>
        </View>

        {assignedTasks.length > 0 ? (
          assignedTasks.map(renderAssignedCard)
        ) : (
          <View style={styles.emptyTasksBox}>
            <Icon name="check-circle" size={32} color="#059669" />
            <Text style={styles.emptyTasksTitle}>No pending assignments</Text>
            <Text style={styles.emptyTasksSub}>
              Accept a new verified plantation drive from Available Requests to begin your next mission!
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

        {/* ─── SECTION 2: Season Community Missions ─── */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={styles.sectionHeading}>Season Field Missions</Text>
          <Text style={styles.sectionCount}>Gamified Milestones</Text>
        </View>

        {challenges.map((item) => {
          const progressPercent = Math.min(100, Math.round((item.current / item.total) * 100));

          return (
            <View key={item.id} style={styles.challengeCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: item.tagBg }]}>
                  <Icon name={item.icon} size={20} color={DashboardPalette.brandDark} />
                </View>

                <View style={styles.metaCol}>
                  <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                      <Text style={[styles.tagText, { color: item.tagFg }]}>{item.tag}</Text>
                    </View>
                    <Text style={styles.deadlineText}>{item.deadline}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>{item.description}</Text>

              {/* Progress Bar */}
              <View style={styles.progressWrap}>
                <View style={styles.progressTopRow}>
                  <Text style={styles.progressLabel}>
                    Progress: {item.current} of {item.total} completed
                  </Text>
                  <Text style={styles.progressPercent}>{progressPercent}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%`, backgroundColor: DashboardPalette.brandDark },
                    ]}
                  />
                </View>
              </View>

              {/* Footer Reward & Action */}
              <View style={styles.footerRow}>
                <Text style={styles.rewardText} numberOfLines={1}>
                  {item.reward}
                </Text>

                <TouchableOpacity
                  style={[styles.joinBtn, item.joined && styles.joinedBtn]}
                  onPress={() => toggleJoin(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.joinBtnText, item.joined && styles.joinedBtnText]}>
                    {item.joined ? 'In Progress' : 'Accept Mission'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
    marginBottom: 10,
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
    marginBottom: 10,
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
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
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
    marginTop: 12,
    backgroundColor: '#163E2B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* Community Challenge Card */
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metaCol: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  deadlineText: {
    fontSize: 11,
    color: '#6B7280',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  progressWrap: {
    marginBottom: 12,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#163E2B',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  rewardText: {
    fontSize: 11.5,
    color: '#047857',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  joinBtn: {
    backgroundColor: '#163E2B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinedBtn: {
    backgroundColor: '#E8EFEA',
    borderWidth: 1,
    borderColor: '#C5DCCF',
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  joinedBtnText: {
    color: '#163E2B',
  },
});
