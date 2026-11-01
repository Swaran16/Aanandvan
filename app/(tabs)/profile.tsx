/**
 * Profile Screen — Aanandvan
 *
 * Shows citizen's basic profile information.
 * Layout: avatar circle, name, email, phone, and a "Edit Profile" button.
 * Matches the clean, premium design language used throughout the app.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Colors, Spacing, BorderRadius, Shadow, FontWeight, FontSize } from '@/constants';

export default function ProfileScreen() {
  // In a real app these would come from user context / API
  const user = {
    name: "Aanand Kumar",
    email: "aanand@example.com",
    mobile: "+91 98765 43210",
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.avatarName}>{user.name}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Mobile" value={user.mobile} />
        </View>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.85} onPress={() => { /* placeholder */ }}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing[5], paddingTop: Spacing[6] },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  backBtn: { padding: Spacing[2] },
  backArrow: { fontSize: 22, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },

  // Avatar section
  avatarWrap: { alignItems: 'center', marginTop: Spacing[8], marginBottom: Spacing[6] },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  avatarIcon: { fontSize: 44, color: Colors.white },
  avatarName: {
    marginTop: Spacing[2],
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing[5],
    gap: Spacing[3],
    ...Shadow.md,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  infoValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.semiBold },

  // Edit button
  editBtn: {
    marginTop: Spacing[6],
    height: 48,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  editBtnText: { fontSize: FontSize.md, color: Colors.white, fontWeight: FontWeight.semiBold },
});
