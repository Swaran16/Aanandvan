/**
 * Admin Profile & Platform Settings Screen (Settings Tab)
 *
 * Clean layout adhering to Aanandvan design system:
 * - Proper safe area layout with zero overlapping boxes
 * - Header with RoleSwitcher
 * - Admin profile badge & jurisdiction details
 * - Platform totals and management controls
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
import { Text, RoleSwitcher } from '@/components/common';
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

  const totalTrees = requests.reduce(
    (acc, r) => acc + (r.activityUpdate?.saplingsPlanted || (r.status === 'completed' ? 5 : 0)),
    1280
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Top Header Bar ─── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Settings</Text>
          <Text style={styles.headerSubtitle}>Platform Governance &amp; Controls</Text>
        </View>

        <RoleSwitcher theme="light" />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Administrator Identity Card ─── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AD</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Aanandvan Administrator</Text>
            <Text style={styles.userEmail}>admin@aanandvan.in</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Super Admin • Level 5</Text>
            </View>
          </View>
        </View>

        {/* ─── Platform Totals (Clean Soft Pastel Cards) ─── */}
        <Text style={styles.sectionTitle}>Platform Totals</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#EBF2FA' }]}>
            <Text style={styles.statNum}>{requests.length + 116}</Text>
            <Text style={styles.statLabel}>Total Requests</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#E2EFE5' }]}>
            <Text style={styles.statNum}>{volunteers.length + 42}</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#F4F8D3' }]}>
            <Text style={styles.statNum}>{totalTrees.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Trees Planted</Text>
          </View>
        </View>

        {/* ─── Administrator Credentials ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Account &amp; Jurisdiction</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admin ID</Text>
            <Text style={styles.infoValue}>ADM-MUM-001</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operational Zone</Text>
            <Text style={styles.infoValue}>Dadar, Matunga &amp; Prabhadevi</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role Permissions</Text>
            <Text style={styles.infoValue}>Full Verification &amp; Squad Dispatch</Text>
          </View>
        </View>

        {/* ─── Administrative Management Controls ─── */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Management Controls</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-reports' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#EBF2FA' }]}>
                <Icon name="overview" size={17} color="#1E40AF" />
              </View>
              <View>
                <Text style={styles.menuItemText}>Impact Reports &amp; Analytics</Text>
                <Text style={styles.menuItemSub}>Export canopy growth and monthly audits</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-events' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#E2EFE5' }]}>
                <Icon name="calendar" size={17} color="#166534" />
              </View>
              <View>
                <Text style={styles.menuItemText}>Community Drives &amp; Events</Text>
                <Text style={styles.menuItemSub}>Organize public volunteer drives</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/pages/admin-settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F4F8D3' }]}>
                <Icon name="settings" size={17} color="#854D0E" />
              </View>
              <View>
                <Text style={styles.menuItemText}>Dadar Zone Configuration</Text>
                <Text style={styles.menuItemSub}>Ward boundaries &amp; dispatch preferences</Text>
              </View>
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
          <Text style={styles.logoutText}>Logout Administrator Session</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#163E2B',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#163E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#166534',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 3,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#163E2B',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12.5,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111827',
  },
  menuItemSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    height: 44,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#DC2626',
  },
});
