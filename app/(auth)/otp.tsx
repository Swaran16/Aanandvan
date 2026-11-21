/**
 * OTP Verification Screen — Aanandvan
 *
 * Verifies 6-digit OTP sent to registered Email ID.
 * Mock OTP: Accepts any 6 digits (e.g. 123456) and verifies seamlessly.
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
  const { email, mobile, role, source, name, bio, address } = useLocalSearchParams<{
    email?: string;
    mobile?: string;
    role?: string;
    source?: string;
    name?: string;
    bio?: string;
    address?: string;
  }>();
  const { loginAs, submitVolunteerApplication } = useApp();

  const resolvedRole: UserRole =
    role === 'admin' ? 'admin' : role === 'volunteer' ? 'volunteer' : 'citizen';
  const isRegisterFlow = source === 'register';

  const userIdentifier = email || mobile || 'user@aanandvan.in';

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
      setErrorMsg('Please enter all 6 digits of the OTP verification code.');
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
            name: name || 'Vaibhav Shirke',
            phone: mobile || '+91 98123 45678',
            bio: bio || 'Active resident of Dadar West passionate about green canopy expansion and tree nurturing.',
            address: address || '14, Ranade Road, Dadar West, Mumbai - 400028',
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
        <Text style={styles.headerTitle}>Email OTP Verification</Text>
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
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              Enter 6-digit verification code sent to{'\n'}
              <Text style={styles.emailHighlight}>{userIdentifier}</Text>
            </Text>

            {isRegisterFlow && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.changeEmailBtn}
                activeOpacity={0.75}
              >
                <Text style={styles.changeEmailText}>Change email address</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.otpLabel, isRegisterFlow && { marginTop: 18 }]}>
              Enter 6-digit Code
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
                    errorMsg ? styles.otpBoxError : undefined,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                  autoFocus={i === 0}
                />
              ))}
            </View>

            {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {/* Resend OTP Row */}
            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive the email? </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerBold}>00:{formattedSeconds}</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.75}>
                  <Text style={styles.resendLink}>Resend code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Hint / Demo helper */}
            <View style={styles.demoHintBox}>
              <Icon name="info" size={16} color="#0B3B24" />
              <Text style={styles.demoHintText}>
                Demo Mode: Enter any 6 digits (e.g. 1 2 3 4 5 6) to proceed.
              </Text>
            </View>
          </View>

          {/* ─── Bottom CTA ─── */}
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
                <Text style={styles.verifyText}>Verify & Proceed</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.privacyNote}>
              Protected by Aanandvan Green Identity protocol
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    paddingTop: 28,
    paddingBottom: 36,
  },
  topSection: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B3B24',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#0B3B24',
  },
  changeEmailBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  changeEmailText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B5E20',
    textDecorationLine: 'underline',
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  otpBox: {
    flex: 1,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 22,
    fontWeight: '700',
    color: '#0B3B24',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#0B3B24',
    backgroundColor: '#F0FDF4',
  },
  otpBoxError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 12,
    marginLeft: 2,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  resendLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  timerText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timerBold: {
    fontWeight: '700',
    color: '#0B3B24',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B3B24',
    textDecorationLine: 'underline',
  },
  demoHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 10,
  },
  demoHintText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
    lineHeight: 16,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 24,
  },
  verifyBtn: {
    height: 52,
    backgroundColor: '#0B3B24',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  privacyNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
