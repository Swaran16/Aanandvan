import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

interface NotificationItem {
  id: string;
  section: 'Today' | 'Earlier';
  title: string;
  body: string;
  time: string;
  icon: IconName;
  unread: boolean;
  requestId?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    section: 'Today',
    title: 'Volunteer assigned',
    body: 'Amit Kumar has accepted Oak Valley Reforestation and will schedule a planting slot soon.',
    time: '2 hours ago',
    icon: 'profile',
    unread: true,
    requestId: 'REQ-2024-0042',
  },
  {
    id: 'n-2',
    section: 'Today',
    title: 'Request verified',
    body: 'Your plantation request for Mangrove Restoration has been verified and is open for volunteers.',
    time: '5 hours ago',
    icon: 'check',
    unread: true,
    requestId: 'REQ-8794',
  },
  {
    id: 'n-3',
    section: 'Earlier',
    title: 'Planting completed',
    body: '5 saplings have been planted at Cedar Buffer Zone. Tap to review site photos.',
    time: '02 Nov',
    icon: 'plant',
    unread: true,
    requestId: 'REQ-8652',
  },
  {
    id: 'n-4',
    section: 'Earlier',
    title: 'More information needed',
    body: 'Please add a clearer landmark photo so volunteers can locate the planting patch.',
    time: '30 Oct',
    icon: 'info',
    unread: false,
    requestId: 'REQ-2024-0042',
  },
  {
    id: 'n-5',
    section: 'Earlier',
    title: 'Planting completed',
    body: 'Maintenance hydration check recorded for Urban Fruit Orchard saplings.',
    time: '22 Oct',
    icon: 'camera',
    unread: false,
    requestId: 'REQ-8430',
  },
];

export default function NotificationsScreen() {
  const { requests } = useApp();
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handlePressItem = (item: NotificationItem) => {
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    const targetId = item.requestId ?? requests[0]?.id ?? 'REQ-2024-0042';
    router.push({
      pathname: '/pages/request-details',
      params: { id: targetId },
    } as any);
  };

  const renderSection = (sectionName: 'Today' | 'Earlier') => {
    const group = items.filter((n) => n.section === sectionName);
    if (group.length === 0) return null;

    return (
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>{sectionName}</Text>
        <View style={styles.cardsStack}>
          {group.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handlePressItem(item)}
            >
              <View style={styles.iconCircle}>
                <Icon name={item.icon} size={18} color="#0D4E2B" />
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardText} numberOfLines={2}>
                  {item.body}
                </Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="chevron-left" size={22} color="#163020" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.75}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Today')}
        {renderSection('Earlier')}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  markReadText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 28,
    gap: 20,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#374151',
  },
  cardsStack: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEEE7',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF5B2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardBody: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0B3E22',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0D4E2B',
  },
  cardText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#4F5C54',
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 11.5,
    color: '#7A867E',
  },
});

