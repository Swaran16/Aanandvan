/**
 * Admin Volunteer Management Screen (Tab 3)
 * Matches Batch 4 — Image 2:
 * - Summary chips: 5 Pending, 42 Verified, 8 Rejected
 * - Tabs: Pending, Verified, Rejected, Suspended
 * - Volunteer cards with avatar, contact details, location, applied date
 * - Approve & Reject actions with full dynamic state updates
 * - "View Full Application →" linking to Priya Sharma profile (Batch 4 Image 3)
 */

import React, { useState } from 'react';
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

export default function AdminVolunteersScreen() {
  const { volunteers, approveVolunteer, rejectVolunteer } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'suspended'>('pending');

  const pendingCount = volunteers.filter(v => v.status === 'pending').length;
  const verifiedCount = volunteers.filter(v => v.status === 'verified').length + 41;
  const rejectedCount = volunteers.filter(v => v.status === 'rejected').length + 8;

  const filteredVolunteers = volunteers.filter(v => v.status === activeTab);

  const handleApprove = (id: string, name: string) => {
    approveVolunteer(id);
    Alert.alert('Volunteer Approved 🎉', `${name} is now an official verified volunteer!`);
  };

  const handleReject = (id: string, name: string) => {
    Alert.alert('Confirm Rejection', `Are you sure you want to reject ${name}'s application?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectVolunteer(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content"  />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => router.push('/(admin)' as any)}
          >
            <Icon name="chevron-left" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.screenHeading}>Volunteer Management</Text>
        </View>

        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Search volunteers')}>
            <Icon name="search" size={20} color="#111827" />
          </TouchableOpacity>
          <View style={styles.adminMiniAvatar}>
            <Text style={styles.adminMiniAvatarText}>AD</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Summary Count Chips ─── */}
        <View style={styles.summaryChipsRow}>
          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.summaryChipText}>{pendingCount} PENDING</Text>
          </View>

          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#10B981' }]} />
            <Text style={styles.summaryChipText}>{verifiedCount} VERIFIED</Text>
          </View>

          <View style={styles.summaryChip}>
            <View style={[styles.dotIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.summaryChipText}>{rejectedCount} REJECTED</Text>
          </View>
        </View>

        {/* ─── Tab Switcher ─── */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'pending' && styles.tabBtnTextActive,
              ]}
            >
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'verified' && styles.tabBtnActive]}
            onPress={() => setActiveTab('verified')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'verified' && styles.tabBtnTextActive,
              ]}
            >
              Verified ({verifiedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'rejected' && styles.tabBtnActive]}
            onPress={() => setActiveTab('rejected')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'rejected' && styles.tabBtnTextActive,
              ]}
            >
              Rejected ({rejectedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'suspended' && styles.tabBtnActive]}
            onPress={() => setActiveTab('suspended')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'suspended' && styles.tabBtnTextActive,
              ]}
            >
              Suspended (2)
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Volunteer Cards List ─── */}
        <View style={styles.cardsContainer}>
          {filteredVolunteers.map(vol => {
            const isPending = vol.status === 'pending';
            const isVerified = vol.status === 'verified';

            return (
              <View key={vol.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatarWrap}>
                    <Image
                      source={{
                        uri:
                          vol.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                      }}
                      style={styles.avatarImg}
                    />
                    {isPending && (
                      <View style={styles.hourglassTag}>
                        <Icon name="clock" size={10} color="#D97706" />
                      </View>
                    )}
                  </View>

                  <View style={styles.detailsBlock}>
                    <View style={styles.nameStatusRow}>
                      <Text style={styles.volunteerName}>{vol.name}</Text>
                      <View
                        style={[
                          styles.statusPill,
                          isPending ? styles.statusPillPending : styles.statusPillVerified,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            isPending
                              ? styles.statusPillTextPending
                              : styles.statusPillTextVerified,
                          ]}
                        >
                          {isPending ? 'PENDING' : 'VERIFIED'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.contactText}>
                      {vol.email} • {vol.phone}
                    </Text>
                  </View>
                </View>

                {/* Location & Applied Tags */}
                <View style={styles.tagsRow}>
                  <View style={styles.metaPill}>
                    <Icon name="map-pin" size={12} color="#6B7280" />
                    <Text style={styles.metaPillText}>{vol.city}</Text>
                  </View>

                  <View style={styles.metaPill}>
                    <Icon name="calendar" size={12} color="#6B7280" />
                    <Text style={styles.metaPillText}>Applied: {vol.appliedDate}</Text>
                  </View>
                </View>

                {/* Stats if Verified */}
                {isVerified && (
                  <View style={styles.statsRow}>
                    <View style={styles.volStatBox}>
                      <Text style={styles.volStatNum}>
                        {vol.plantationsCount || 23}
                      </Text>
                      <Text style={styles.volStatLabel}>PLANTATIONS</Text>
                    </View>
                    <View style={styles.volStatBox}>
                      <Text style={styles.volStatNum}>
                        {vol.lastActive || '2d ago'}
                      </Text>
                      <Text style={styles.volStatLabel}>LAST ACTIVE</Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons for Pending */}
                {isPending ? (
                  <View style={styles.pendingActionsBlock}>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => handleApprove(vol.id, vol.name)}
                      >
                        <Icon name="check" size={15} color="#FFFFFF" />
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => handleReject(vol.id, vol.name)}
                      >
                        <Icon name="close" size={14} color="#DC2626" />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.viewFullAppBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/pages/volunteer-details',
                          params: { id: vol.id },
                        } as any)
                      }
                    >
                      <Text style={styles.viewFullAppText}>
                        View Full Application →
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.verifiedActionsBlock}>
                    <TouchableOpacity
                      style={styles.viewProfileBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/pages/volunteer-details',
                          params: { id: vol.id },
                        } as any)
                      }
                    >
                      <Text style={styles.viewProfileBtnText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.suspendBtn}
                      onPress={() => alert('Suspend options')}
                    >
                      <Text style={styles.suspendBtnText}>Suspend</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => alert('Invite new volunteer')}
      >
        <Icon name="users" size={22} color="#FFFFFF" />
      </TouchableOpacity>
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
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBtn: {
    padding: 4,
  },
  screenHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B3B24',
    letterSpacing: -0.4,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  adminMiniAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminMiniAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
  summaryChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  dotIndicator: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  summaryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 3,
    gap: 2,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  hourglassTag: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  nameStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextPending: {
    color: '#D97706',
  },
  statusPillTextVerified: {
    color: '#059669',
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  metaPillText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  volStatBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  volStatNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3B24',
  },
  volStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  pendingActionsBlock: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3B24',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  rejectBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  viewFullAppBtn: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 4,
  },
  viewFullAppText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
  },
  verifiedActionsBlock: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  suspendBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  suspendBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B3B24',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});

