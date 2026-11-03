/**
 * Volunteer Profile Screen (Tab 4)
 * Custom designed profile for Volunteer (Amit Kumar)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function VolunteerProfileScreen() {
  const { currentUser, logout, requests } = useApp();

  const assignedCount = requests.filter(
    r => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  ).length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3B24" />

      {/* ─── Hero Header ─── */}
      <View style={styles.heroHeader}>
        <SafeAreaView edges={['top']} style={styles.safeHero}>
          <View style={styles.heroTopRow}>
            <View style={styles.userSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{
                    uri:
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <Icon name="check" size={12} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.nameBlock}>
                <Text style={styles.userName}>{currentUser.name || 'Amit Kumar'}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Verified Volunteer</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.settingsIconBtn}
              onPress={() => alert('Volunteer Settings')}
            >
              <Icon name="settings" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 3 Floating Stat Cards ─── */}
        <View style={styles.floatingStatsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ASSIGNED</Text>
            <Text style={styles.statValue}>{String(assignedCount).padStart(2, '0')}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>COMPLETED</Text>
            <Text style={styles.statValue}>23</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>HOURS</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>48</Text>
          </View>
        </View>

        {/* ─── Volunteer Information ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Volunteer Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {currentUser.email || 'amit.kumar@example.com'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile</Text>
            <Text style={styles.infoValue}>
              {currentUser.phone || '+91 98123 45678'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operating City</Text>
            <Text style={styles.infoValue}>{currentUser.city || 'Gurugram'}</Text>
          </View>
        </View>

        {/* ─── Settings & Support ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Volunteer Tools</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/my-assigned-work' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="check" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>My Assigned Work</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/upload-activity' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="camera" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>Upload Plantation Activity</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => alert('Support line active')}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="help" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ─── Logout ─── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Icon name="logout" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  heroHeader: {
    backgroundColor: '#0B3B24',
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  safeHero: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    gap: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  roleBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
  },
  settingsIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  floatingStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -28,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    height: 52,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
});
