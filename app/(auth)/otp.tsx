/**
 * OTP Verification Screen — Aanandvan (Designs 1 & 3)
 *
 * - Design 1 (`source === 'login'`): Clean 6-digit OTP verification after login
 * - Design 3 (`source === 'register'`): Adds "Change mobile number" link after registration
 * - Mock OTP: Accepts any 6 numeric digits and verifies seamlessly
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { mobile, role, source, name } = useLocalSearchParams<{
    mobile?: string;
    role?: string;
    source?: string;
    name?: string;
  }>();
  const { loginAs, submitVolunteerApplication } = useApp();

  const resolvedRole: UserRole =
    role === 'admin' ? 'admin' : role === 'volunteer' ? 'volunteer' : 'citizen';
  const isRegisterFlow = source === 'register';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(42);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const refs = useRef<Array<any>>(Array(OTP_LENGTH).fill(null));

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatMaskedMobile = (raw?: string): string => {
    const digits = (raw || '').replace(/\D/g, '');
    const last4 = digits.length >= 4 ? digits.slice(-4) : '2536';
    return `+91 ***** *${last4}`;
  };

  const handleChange = (text: string, index: number) => {
    const digits = text.replace(/[^0-9]/g, '');
    if (errorMsg) setErrorMsg('');

    // Handle paste of multiple digits
    if (digits.length > 1) {
      const next = [...otp];
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = digits[i];
      }
      setOtp(next);
      const focusIdx = Math.min(index + digits.length, OTP_LENGTH - 1);
      refs.current[focusIdx]?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(42);
    setOtp(Array(OTP_LENGTH).fill(''));
    setErrorMsg('');
    refs.current[0]?.focus();
  };

  const handleVerify = () => {
    const isComplete = otp.every((d) => d !== '');
    if (!isComplete) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginAs(resolvedRole);
      if (resolvedRole === 'admin') {
        router.replace('/(admin)' as any);
      } else if (resolvedRole === 'volunteer') {
        if (isRegisterFlow) {
          submitVolunteerApplication({
            name: name || 'New Volunteer',
            phone: mobile || '+91 98123 45678',
          });
          router.replace('/(auth)/volunteer-verification' as any);
        } else {
          router.replace('/(volunteer)' as any);
        }
      } else {
        router.replace('/(citizen)' as any);
      }
    }, 450);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login' as any);
    }
  };

  const formattedSeconds = String(timer).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={26} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile number verification</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Top Form Section ─── */}
          <View style={styles.topSection}>
            <Text style={styles.title}>Verify mobile number</Text>
            <Text style={styles.subtitle}>
              Enter 6-digit OTP send to {formatMaskedMobile(mobile)}
            </Text>

            {isRegisterFlow && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.changeMobileBtn}
                activeOpacity={0.75}
              >
                <Text style={styles.changeMobileText}>Change mobile number</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.otpLabel, isRegisterFlow && { marginTop: 18 }]}>
              Enter OTP
            </Text>

            {/* 6 OTP Boxes */}
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : undefined,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  selectionColor="#0A4D2E"
                />
              ))}
            </View>

            {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {/* Resend Timer Row */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>
                Resend OTP in 00:{formattedSeconds} seconds. Didn't receive the code?{' '}
                <Text style={styles.resendLink} onPress={handleResend}>
                  Resend
                </Text>
              </Text>
            </View>
          </View>

          {/* ─── Bottom Pinned CTA & Legal ─── */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.verifyBtn}
              activeOpacity={0.88}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.legalText}>
              By proceeding, you agree to Aanandvan's Terms of Service and Privacy Policy.
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  topSection: {
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#6B7280',
    lineHeight: 19,
  },
  changeMobileBtn: {
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  changeMobileText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  otpLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0B3B24',
    marginTop: 22,
    marginBottom: 10,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    flex: 1,
    maxWidth: 50,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  otpBoxFilled: {
    borderColor: '#0A4D2E',
    backgroundColor: '#F4F9F6',
  },
  errorText: {
    fontSize: 12.5,
    color: '#DC2626',
    marginTop: 8,
  },
  resendRow: {
    marginTop: 12,
  },
  resendText: {
    fontSize: 12.5,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  resendLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  bottomSection: {
    width: '100%',
    paddingTop: 32,
  },
  verifyBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  legalText: {
    fontSize: 11.5,
    color: '#9CA3AF',
    lineHeight: 17,
  },
});
