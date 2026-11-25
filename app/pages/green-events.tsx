/**
 * Green Events Screen — Aanandvan
 * Notification-style task feed for community green activities.
 * Citizen can view and take part in tasks such as watering, soil changing, tree guard maintenance, etc.
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

interface GreenTask {
  id: string;
  category: 'Today' | 'Upcoming';
  title: string;
  description: string;
  location: string;
  time: string;
  icon: IconName;
  tag: string;
  tagBg: string;
  tagFg: string;
  completed: boolean;
}

const INITIAL_TASKS: GreenTask[] = [
  {
    id: 'gt-1',
    category: 'Today',
    title: 'Water the plants',
    description: 'Shivaji Park Corner Drive saplings need morning hydration due to rising temperatures.',
    location: 'Shivaji Park Corner, Dadar West',
    time: 'Due today • 7:00 AM - 10:00 AM',
    icon: 'water',
    tag: 'Urgent Hydration',
    tagBg: '#DBE8F0',
    tagFg: '#0369A1',
    completed: false,
  },
  {
    id: 'gt-2',
    category: 'Today',
    title: 'Change soil & add vermicompost',
    description: 'Replenish topsoil with organic vermicompost to supply micro-nutrients before monsoon.',
    location: 'Five Gardens Canopy, Matunga East',
    time: 'Due today • 4:30 PM',
    icon: 'plant',
    tag: 'Soil Nutrition',
    tagBg: '#CDE1D2',
    tagFg: '#166534',
    completed: false,
  },
  {
    id: 'gt-3',
    category: 'Today',
    title: 'Tree guard realignment',
    description: 'Check sapling #4 & #7 wire guards that tilted after heavy pavement traffic.',
    location: 'Dadar TT Circle, Dr. Ambedkar Rd',
    time: 'Due today • Flexible',
    icon: 'shield',
    tag: 'Tree Protection',
    tagBg: '#EBF29D',
    tagFg: '#854D0E',
    completed: false,
  },
  {
    id: 'gt-4',
    category: 'Upcoming',
    title: 'Mulching & weed clearance',
    description: 'Clear wild grass around the sapling basins and layer dried leaves to lock in moisture.',
    location: 'Hindu Colony 4th Lane, Dadar',
    time: 'Tomorrow • 8:00 AM',
    icon: 'sun',
    tag: 'Maintenance',
    tagBg: '#F3F4F6',
    tagFg: '#4B5563',
    completed: false,
  },
  {
    id: 'gt-5',
    category: 'Upcoming',
    title: 'Sapling health & photo check',
    description: 'Capture 2 fresh growth photos and check leaf color for nitrogen deficiency signs.',
    location: 'Prabhadevi Seashore Walkway',
    time: 'Saturday • 9:30 AM',
    icon: 'camera',
    tag: 'Monitoring',
    tagBg: '#F3F4F6',
    tagFg: '#4B5563',
    completed: false,
  },
];

export default function GreenEventsScreen() {
  const [tasks, setTasks] = useState<GreenTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            Alert.alert('Task Completed! 🌱', 'Thank you for taking care of our urban green canopy.');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const todayTasks = tasks.filter((t) => t.category === 'Today');
  const upcomingTasks = tasks.filter((t) => t.category === 'Upcoming');

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
          <Text style={styles.headerTitle}>Green Events & Tasks</Text>
          <Text style={styles.headerSubtitle}>Community care activities around you</Text>
        </View>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>{todayTasks.length} Active</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Today's Priority Tasks</Text>
          <Text style={styles.sectionCount}>{todayTasks.length} tasks</Text>
        </View>

        {todayTasks.map((item) => (
          <View
            key={item.id}
            style={[
              styles.taskCard,
              item.completed && styles.taskCardCompleted,
            ]}
          >
            <View style={styles.taskCardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: item.tagBg }]}>
                <Icon name={item.icon} size={20} color={DashboardPalette.brandDark} />
              </View>

              <View style={styles.taskMetaCol}>
                <View style={styles.tagRow}>
                  <View style={[styles.taskTag, { backgroundColor: item.tagBg }]}>
                    <Text style={[styles.taskTagText, { color: item.tagFg }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.taskTime}>{item.time}</Text>
                </View>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                  {item.title}
                </Text>
              </View>
            </View>

            <Text style={styles.taskDesc}>{item.description}</Text>

            <View style={styles.taskFooter}>
              <View style={styles.locationWrap}>
                <Icon name="map-pin" size={14} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  item.completed && styles.actionBtnDone,
                ]}
                onPress={() => toggleTask(item.id)}
                activeOpacity={0.8}
              >
                <Icon
                  name={item.completed ? 'check' : 'check'}
                  size={14}
                  color={item.completed ? '#065F46' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    item.completed && styles.actionBtnTextDone,
                  ]}
                >
                  {item.completed ? 'Done' : 'Mark Done'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Upcoming Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={styles.sectionHeading}>Upcoming Community Work</Text>
          <Text style={styles.sectionCount}>{upcomingTasks.length} tasks</Text>
        </View>

        {upcomingTasks.map((item) => (
          <View
            key={item.id}
            style={[
              styles.taskCard,
              item.completed && styles.taskCardCompleted,
            ]}
          >
            <View style={styles.taskCardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: item.tagBg }]}>
                <Icon name={item.icon} size={20} color={DashboardPalette.brandDark} />
              </View>

              <View style={styles.taskMetaCol}>
                <View style={styles.tagRow}>
                  <View style={[styles.taskTag, { backgroundColor: item.tagBg }]}>
                    <Text style={[styles.taskTagText, { color: item.tagFg }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.taskTime}>{item.time}</Text>
                </View>
                <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                  {item.title}
                </Text>
              </View>
            </View>

            <Text style={styles.taskDesc}>{item.description}</Text>

            <View style={styles.taskFooter}>
              <View style={styles.locationWrap}>
                <Icon name="map-pin" size={14} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  item.completed && styles.actionBtnDone,
                ]}
                onPress={() => toggleTask(item.id)}
                activeOpacity={0.8}
              >
                <Icon
                  name={item.completed ? 'check' : 'check'}
                  size={14}
                  color={item.completed ? '#065F46' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    item.completed && styles.actionBtnTextDone,
                  ]}
                >
                  {item.completed ? 'Done' : 'I will do this'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  taskCard: {
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
  taskCardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.75,
  },
  taskCardHeader: {
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
  taskMetaCol: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  taskTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  taskTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#163E2B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnDone: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionBtnTextDone: {
    color: '#065F46',
  },
});
