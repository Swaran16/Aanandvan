/**
 * OTP Verification Screen — Aanandvan
 *
 * 6 individual OTP input boxes. Auto-advances focus on input.
 * "Verify & Proceed" button + Resend link.
 *
 * Matches Figma: mint phone icon circle, dark green check badge,
 * 6 outlined square boxes, dark rounded CTA.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';
import { Text } from '@/components/common';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { mobile, role } = useLocalSearchParams<{ mobile: string; role: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const refs = useRef<Array<any>>(Array(OTP_LENGTH).fill(null));

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      (refs.current[index + 1] as any)?.focus?.();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      (refs.current[index - 1] as any)?.focus?.();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    // Simulate verification — replace with real OTP check
    setTimeout(() => {
      setLoading(false);
      if (role === 'volunteer') {
        router.replace('/(volunteer)' as any);
      } else {
        router.replace('/(tabs)');
      }
    }, 1200);
  };

  const autoFillOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
  };

  const isComplete = otp.every((d) => d !== '');

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
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.brandTitle}>Aanandvan</Text>

          {/* ─── Card ─── */}
          <View style={styles.card}>
            {/* Phone Icon */}
            <View style={styles.iconWrap}>
              <View style={styles.iconCircle}>
                <Text style={styles.phoneIcon}>📱</Text>
              </View>
              <View style={styles.checkBadge}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Verify Mobile Number</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                {role === 'volunteer' ? '🌿 Volunteer Verification' : '👤 Citizen Verification'}
              </Text>
            </View>
            <Text style={styles.cardSub}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.mobileText}>{mobile || '+91 98765 43210'}</Text>.
            </Text>

            {/* Quick Mock OTP chip */}
            <TouchableOpacity onPress={autoFillOtp} style={styles.mockChip} activeOpacity={0.7}>
              <Text style={styles.mockChipText}>⚡ Fill Mock OTP: 123456</Text>
            </TouchableOpacity>

            {/* ─── OTP Boxes ─── */}
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el: any) => { refs.current[i] = el; }}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : undefined,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectionColor={Colors.brandPrimary}
                />
              ))}
            </View>

            {/* Verify CTA */}
            <TouchableOpacity
              style={[
                styles.verifyBtn,
                (!isComplete || loading) && { opacity: 0.55 },
              ]}
              onPress={handleVerify}
              disabled={!isComplete || loading}
              activeOpacity={0.85}
            >
              <Text style={styles.verifyBtnText}>
                {loading ? 'Verifying...' : `Verify & Open ${role === 'volunteer' ? 'Volunteer' : 'Citizen'} Dashboard →`}
              </Text>
            </TouchableOpacity>

            {/* Resend */}
            <View style={styles.resendRow}>
              <Text style={styles.resendHint}>Didn't receive the code?  </Text>
              <TouchableOpacity onPress={autoFillOtp}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer legal */}
          <Text style={styles.legal}>
            By proceeding, you agree to Aanandvan's{'\n'}
            Terms of Service and Privacy Policy.
          </Text>
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
    gap: Spacing[5],
    alignItems: 'center',
  },

  // Header
  backBtn: { padding: Spacing[2], alignSelf: 'flex-start' },
  backArrow: { fontSize: 22, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  brandTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
    alignSelf: 'center',
  },

  // Card
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[7],
    alignItems: 'center',
    gap: Spacing[5],
    ...Shadow.md,
  },

  // Phone icon
  iconWrap: { position: 'relative', width: 88, height: 88 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: { fontSize: 36 },
  checkBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { fontSize: 14, color: Colors.white, fontWeight: FontWeight.bold },

  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  roleTag: {
    backgroundColor: '#EBF5EE',
    paddingHorizontal: Spacing[3],
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandPrimary,
  },
  mockChip: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: -Spacing[1],
  },
  mockChipText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: '#B45309',
  },
  cardSub: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.55,
    marginTop: -Spacing[2],
  },
  mobileText: {
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },

  // OTP boxes
  otpRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginVertical: Spacing[2],
  },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  otpBoxFilled: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.brandLight,
  },

  // Verify button
  verifyBtn: {
    width: '100%',
    height: 54,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  verifyBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // Resend
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendHint: { fontSize: FontSize.sm, color: Colors.textSecondary },
  resendLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },

  // Legal
  legal: {
    fontSize: FontSize.xs,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.7,
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[3],
  },
});
