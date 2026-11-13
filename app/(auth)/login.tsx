/**
 * Login Screen — Aanandvan (Design 4)
 * Clean OTP-based mobile login screen, properly center-aligned.
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const { loginAs } = useApp();
  const [mobile, setMobile] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^0-9\s]/g, '');
    setMobile(cleaned);
    if (errorMsg) setErrorMsg('');
  };

  const inferRoleFromNumber = (digits: string): UserRole => {
    if (digits === '9999900000') return 'admin';
    if (digits === '9812345678' || digits === '9123456789') return 'volunteer';
    return 'citizen';
  };

  const handleSendOtp = () => {
    const digitsOnly = mobile.replace(/\s+/g, '');
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const finalDigits = digitsOnly.length === 10 ? digitsOnly : '9876543210';
    const inferredRole = inferRoleFromNumber(finalDigits);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/otp',
        params: {
          mobile: `+91 ${finalDigits.slice(0, 5)} ${finalDigits.slice(5)}`,
          role: inferredRole,
          source: 'login',
        },
      } as any);
    }, 350);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Top Navigation Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={26} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome back to Aanandvan</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollCenter}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Center-Aligned Form Block ─── */}
          <View style={styles.centerCard}>
            <Text style={styles.instructionText}>
              Enter your registered mobile number. We will send you a 6-digit OTP.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile number</Text>
              <View style={[styles.phoneInputWrap, errorMsg ? styles.phoneInputError : undefined]}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="00000 00000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={11}
                  value={mobile}
                  onChangeText={handleMobileChange}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOtp}
                />
              </View>
              {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            </View>

            {/* New to Aanandvan? Create an account */}
            <View style={styles.signupRow}>
              <Text style={styles.signupPrompt}>New to Aanandvan? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/role-select' as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.signupLink}>Create an account</Text>
              </TouchableOpacity>
            </View>

            {/* Primary CTA Button */}
            <TouchableOpacity
              style={styles.sendOtpBtn}
              activeOpacity={0.88}
              onPress={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendOtpText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Login Buttons */}
            <View style={styles.quickRolesRow}>
              <TouchableOpacity
                style={styles.quickRoleBtn}
                activeOpacity={0.85}
                onPress={() => {
                  loginAs('volunteer');
                  router.replace('/(volunteer)' as any);
                }}
              >
                <Text style={styles.quickRoleText}>Volunteer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickRoleBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/(auth)/admin-login' as any)}
              >
                <Text style={styles.quickRoleText}>Admin Login</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Footer */}
            <Text style={styles.privacyText}>
              Your data is protected by Aanandvan Privacy Protocol.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3B24',
    letterSpacing: -0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollCenter: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  centerCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B3B24',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 8,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  phoneInputError: {
    borderColor: '#DC2626',
  },
  countryCodeBox: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupPrompt: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  signupLink: {
    fontSize: 13,
    color: '#0B3B24',
    fontWeight: '700',
  },
  sendOtpBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sendOtpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickRolesRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 16,
  },
  quickRoleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#0A4D2E',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRoleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A4D2E',
  },
  privacyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
