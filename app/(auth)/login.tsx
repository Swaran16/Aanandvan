/**
 * Login Screen — Aanandvan
 * Clean OTP-based email login screen.
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
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errorMsg) setErrorMsg('');
  };

  const inferRoleFromEmail = (val: string): UserRole => {
    const lower = val.toLowerCase().trim();
    if (lower.includes('admin')) return 'admin';
    if (lower.includes('volunteer') || lower.includes('shirke') || lower.includes('aanandvan.in')) return 'volunteer';
    return 'citizen';
  };

  const handleSendOtp = (overrideEmail?: string) => {
    const targetEmail = (overrideEmail || email).trim().toLowerCase();
    if (!targetEmail) {
      setErrorMsg('Please enter your email ID.');
      return;
    }
    if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const inferredRole = inferRoleFromEmail(targetEmail);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/otp',
        params: {
          email: targetEmail,
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
              Enter your registered Email ID. We will send you a 6-digit OTP verification code.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email ID</Text>
              <View style={[styles.inputWrap, errorMsg ? styles.inputError : undefined]}>
                <View style={styles.inputIconBox}>
                  <Icon name="mail" size={20} color="#0B3B24" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. kartik.vichare@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={handleEmailChange}
                  returnKeyType="done"
                  onSubmitEditing={() => handleSendOtp()}
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
              onPress={() => handleSendOtp()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendOtpText}>Send OTP Verification Code</Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Login Presets */}
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsLabel}>Quick Switch / Demo Profiles</Text>
              <View style={styles.presetsRow}>
                <TouchableOpacity
                  style={styles.presetChip}
                  activeOpacity={0.85}
                  onPress={() => {
                    setEmail('kartik.vichare@gmail.com');
                    handleSendOtp('kartik.vichare@gmail.com');
                  }}
                >
                  <Text style={styles.presetChipText}>Citizen (Kartik)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  activeOpacity={0.85}
                  onPress={() => {
                    setEmail('vaibhav.shirke@aanandvan.in');
                    handleSendOtp('vaibhav.shirke@aanandvan.in');
                  }}
                >
                  <Text style={styles.presetChipText}>Volunteer (Vaibhav)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.presetChip, styles.presetChipAdmin]}
                  activeOpacity={0.85}
                  onPress={() => {
                    setEmail('admin@aanandvan.in');
                    handleSendOtp('admin@aanandvan.in');
                  }}
                >
                  <Text style={[styles.presetChipText, styles.presetChipAdminText]}>Admin</Text>
                </TouchableOpacity>
              </View>
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
    fontSize: 15,
    fontWeight: '500',
    color: '#1F3D2B',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
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
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIconBox: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 2,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  signupPrompt: {
    fontSize: 13,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    textDecorationLine: 'underline',
  },
  sendOtpBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#0B3B24',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 24,
  },
  sendOtpText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  presetsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  presetsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  presetChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B5E20',
  },
  presetChipAdmin: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  presetChipAdminText: {
    color: '#92400E',
  },
  privacyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});
