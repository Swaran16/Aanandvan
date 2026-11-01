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
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call — replace with real auth
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1200);
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

          {/* ─── Card ─── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back 👋</Text>
            <Text style={styles.cardSub}>Login to continue your green journey.</Text>

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
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'Logging in...' : 'Login  →'}
              </Text>
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerHint}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
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
