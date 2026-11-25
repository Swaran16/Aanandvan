/**
 * Active Challenges Screen — Aanandvan
 * Gamified community challenges for volunteers:
 * - Hydration Streaks
 * - Squad Plantation Drives
 * - Tree Guard Maintenance
 * - Photo Monitoring
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { DashboardPalette } from '@/constants/colors';

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
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const toggleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.joined;
          Alert.alert(
            next ? 'Challenge Joined! 🎯' : 'Challenge Paused',
            next
              ? `You have entered the "${c.title}" challenge. Log care activities to progress!`
              : `You have left "${c.title}".`
          );
          return { ...c, joined: next };
        }
        return c;
      })
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
          <Text style={styles.headerTitle}>Active Challenges</Text>
          <Text style={styles.headerSubtitle}>Field missions and community milestones</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>2 Active</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconWrap}>
            <Icon name="sun" size={24} color="#163E2B" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>Volunteer Season Missions</Text>
            <Text style={styles.bannerDesc}>
              Complete field challenges to earn verified volunteer badges and boost Mumbai’s urban canopy.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Current Field Missions</Text>

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
                  style={[
                    styles.joinBtn,
                    item.joined && styles.joinedBtn,
                  ]}
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
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F29E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCE888',
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#163E2B',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 12,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
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
