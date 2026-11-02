/**
 * Login Screen — Aanandvan
 *
 * Simple mobile number + password login.
 * "Forgot Password" link + Register redirect.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';
import { Text } from '@/components/common';

export default function LoginScreen() {
  const [role, setRole] = useState<'citizen' | 'volunteer'>('citizen');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: 'citizen' | 'volunteer') => {
    setRole(newRole);
    if (newRole === 'citizen') {
      setMobile('+91 98765 43210');
    } else {
      setMobile('+91 91234 56789');
    }
  };

  const handleLogin = (forcedRole?: 'citizen' | 'volunteer') => {
    const targetRole = forcedRole || role;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (targetRole === 'volunteer') {
        router.replace('/(volunteer)' as any);
      } else {
        router.replace('/(tabs)');
      }
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Header ─── */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <View style={styles.miniLogo}>
              <View style={styles.miniLogoInner} />
            </View>
            <Text style={styles.brandTitle}>Aanandvan</Text>
          </View>

          {/* ─── Role Switch Tabs ─── */}
          <View style={styles.roleTabsWrap}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'citizen' && styles.roleTabActive]}
              onPress={() => handleRoleChange('citizen')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, role === 'citizen' && styles.roleTabTextActive]}>
                👤 Citizen Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'volunteer' && styles.roleTabActive]}
              onPress={() => handleRoleChange('volunteer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, role === 'volunteer' && styles.roleTabTextActive]}>
                🌿 Volunteer Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* ─── 1-Click Quick Demo Login ─── */}
          <View style={styles.quickDemoCard}>
            <Text style={styles.quickDemoHeading}>⚡ One-Click Mock Login</Text>
            <View style={styles.quickDemoRow}>
              <TouchableOpacity
                style={[styles.quickDemoBtn, role === 'citizen' && styles.quickDemoBtnSelected]}
                onPress={() => {
                  handleRoleChange('citizen');
                  handleLogin('citizen');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.quickDemoName}>Rahul Sharma</Text>
                <Text style={styles.quickDemoSub}>Citizen Dashboard →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickDemoBtn, role === 'volunteer' && styles.quickDemoBtnSelected]}
                onPress={() => {
                  handleRoleChange('volunteer');
                  handleLogin('volunteer');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.quickDemoName}>Amit Kumar</Text>
                <Text style={styles.quickDemoSub}>Volunteer Dashboard →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── Card ─── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {role === 'volunteer' ? 'Volunteer Login 👋' : 'Citizen Login 👋'}
            </Text>
            <Text style={styles.cardSub}>
              {role === 'volunteer'
                ? 'Welcome back, enter details to view assigned plantation work.'
                : 'Login to report locations and track neighborhood green drives.'}
            </Text>

            {/* Mobile field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="phone-pad"
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>
            </View>

            {/* Password field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.gray400}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Forgot */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login CTA */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={() => handleLogin()}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>
                {loading
                  ? 'Opening Dashboard...'
                  : `Login to ${role === 'volunteer' ? 'Volunteer' : 'Citizen'} Dashboard →`}
              </Text>
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerHint}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/role-select')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
    gap: Spacing[6],
  },

  // Header
  backBtn: { padding: Spacing[2], alignSelf: 'flex-start' },
  backArrow: { fontSize: 22, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
  },
  miniLogo: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  miniLogoInner: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.white,
  },
  brandTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },

  // Role Switch Tabs
  roleTabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: BorderRadius.lg,
    padding: 4,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: Spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  roleTabActive: {
    backgroundColor: Colors.white,
    ...Shadow.sm,
  },
  roleTabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  roleTabTextActive: {
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },

  // Quick Demo Card
  quickDemoCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    gap: Spacing[3],
  },
  quickDemoHeading: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#15803D',
    letterSpacing: 0.3,
  },
  quickDemoRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  quickDemoBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    alignItems: 'center',
    gap: 2,
    ...Shadow.sm,
  },
  quickDemoBtnSelected: {
    borderColor: '#15803D',
    borderWidth: 1.5,
    backgroundColor: '#DCFCE7',
  },
  quickDemoName: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  quickDemoSub: {
    fontSize: 10,
    fontWeight: FontWeight.semiBold,
    color: '#15803D',
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    gap: Spacing[5],
    ...Shadow.md,
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: -Spacing[3],
  },

  // Fields
  fieldGroup: { gap: Spacing[2] },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    height: 52,
    gap: Spacing[3],
    backgroundColor: Colors.white,
  },
  inputIcon: { fontSize: 16, opacity: 0.6 },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },

  // Forgot
  forgotBtn: { alignSelf: 'flex-end', marginTop: -Spacing[2] },
  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.brandAccent,
    fontWeight: FontWeight.medium,
  },

  // CTA
  loginBtn: {
    height: 54,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[1],
  },
  loginBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // Register row
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerHint: { fontSize: FontSize.sm, color: Colors.textSecondary },
  registerLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },
});
