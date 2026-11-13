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

export default function AdminInboxScreen() {
  const { adminInbox, markAdminInboxAsRead, markAllAdminInboxAsRead } = useApp();

  const handleMarkAllRead = () => {
    markAllAdminInboxAsRead();
  };

  const handleOpenItem = (item: any) => {
    markAdminInboxAsRead(item.id);
    if (item.params) {
      router.push({ pathname: item.route, params: item.params } as any);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.75}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Today</Text>

        <View style={styles.cardsStack}>
          {adminInbox.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleOpenItem(item)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Icon name={item.icon} size={18} color="#0D4E2B" />
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 19,
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
    paddingTop: 4,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#163020',
    marginBottom: 12,
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
    backgroundColor: '#EFF4A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
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

