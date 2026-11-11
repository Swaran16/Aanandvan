/**
 * Admin Profile & Platform Settings Screen (Tab 4)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function AdminProfileScreen() {
  const { logout, requests, volunteers } = useApp();

  const handleLogout = () => {
    Alert.alert('Admin Logout', 'Are you sure you want to end your administrator session?', [
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
      <StatusBar barStyle="light-content"  />

      {/* ─── Hero Header ─── */}
      <View style={styles.heroHeader}>
        <SafeAreaView edges={['top']} style={styles.safeHero}>
          <View style={styles.userSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AD</Text>
            </View>

            <View style={styles.nameBlock}>
              <Text style={styles.userName}>Aanandvan Administrator</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Super Admin • Level 5</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Platform Totals ─── */}
        <View style={styles.floatingStatsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REQUESTS</Text>
            <Text style={styles.statValue}>{requests.length + 116}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>VOLUNTEERS</Text>
            <Text style={styles.statValue}>{volunteers.length + 44}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TREES</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>312</Text>
          </View>
        </View>

        {/* ─── Administrator Information ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Administrator Account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admin ID</Text>
            <Text style={styles.infoValue}>ADM-HQ-001</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Email</Text>
            <Text style={styles.infoValue}>admin@aanandvan.in</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jurisdiction</Text>
            <Text style={styles.infoValue}>National Green Mission</Text>
          </View>
        </View>

        {/* ─── Platform Controls ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Management Controls</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-reports' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="overview" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>Reports & Analytics</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-events' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="calendar" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>Plantation Events</Text>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-settings' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="settings" size={18} color="#4B5563" />
              <Text style={styles.menuItemText}>Platform Settings</Text>
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
          <Text style={styles.logoutText}>Logout Admin Session</Text>
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
    paddingTop: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nameBlock: {
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B3B24',
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
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

