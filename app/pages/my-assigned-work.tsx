/**
 * Volunteer "My Assigned Work" Screen
 * Linked from Quick Actions on Volunteer Home
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function MyAssignedWorkScreen() {
  const { requests } = useApp();

  const assigned = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Assigned Work</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerSubtitle}>
          You have {assigned.length} ongoing plantation assignments. Select an initiative to schedule or post updates.
        </Text>

        <View style={styles.list}>
          {assigned.map(item => {
            const isScheduled = item.status === 'scheduled';
            const isInProgress = item.status === 'in_progress';

            return (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{
                    uri:
                      item.areaPhotos[0] ||
                      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
                  }}
                  style={styles.cardImage}
                />

                <View style={styles.cardBody}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.cardId}>#{item.id}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        isInProgress ? styles.statusInProgress : styles.statusAssigned,
                      ]}
                    >
                      <Text style={styles.statusPillText}>
                        {isScheduled
                          ? 'Scheduled'
                          : isInProgress
                          ? 'In Progress'
                          : 'Assigned'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardLoc}>{item.manualAddress || item.location}</Text>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.outlineActionBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/pages/request-details',
                          params: { id: item.id },
                        } as any)
                      }
                    >
                      <Text style={styles.outlineActionText}>View Details</Text>
                    </TouchableOpacity>

                    {item.status === 'assigned' && (
                      <TouchableOpacity
                        style={styles.fillActionBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/pages/schedule-plantation',
                            params: { id: item.id },
                          } as any)
                        }
                      >
                        <Text style={styles.fillActionText}>Schedule Drive</Text>
                      </TouchableOpacity>
                    )}

                    {isInProgress && (
                      <TouchableOpacity
                        style={styles.fillActionBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/pages/upload-activity',
                            params: { id: item.id },
                          } as any)
                        }
                      >
                        <Text style={styles.fillActionText}>Upload Update</Text>
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
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusAssigned: {
    backgroundColor: '#DBEAFE',
  },
  statusInProgress: {
    backgroundColor: '#D1FAE5',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  cardLoc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  outlineActionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  outlineActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  fillActionBtn: {
    flex: 1.2,
    backgroundColor: '#0B3B24',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  fillActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

