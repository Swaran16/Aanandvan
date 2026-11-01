/**
 * Registration Screen — Aanandvan
 *
 * Accepts a `role` query param ("citizen" | "volunteer").
 * Shows "Citizen Registration" or "Volunteer Registration" accordingly.
 *
 * Form fields: Full Name, Mobile Number, Email, Address.
 * "Register →" button navigates to OTP verification (passing role + mobile).
 *
 * Matches Figma: light sage background, "Namaste, Aanandvan" top header,
 * white rounded card, icon-prefix inputs, bold labels, dark green CTA.
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
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';
import { Text } from '@/components/common';

type Role = 'citizen' | 'volunteer';

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const userRole: Role = role === 'volunteer' ? 'volunteer' : 'citizen';

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
  });

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleRegister = () => {
    // Navigate to OTP with mobile number and role
    router.push({
      pathname: '/(auth)/otp',
      params: { mobile: form.mobile, role: userRole },
    });
  };

  const titleText = userRole === 'volunteer' ? 'Volunteer Registration' : 'Citizen Registration';
  const subText =
    userRole === 'volunteer'
      ? 'Fill in your details to apply as a volunteer.'
      : 'Fill in your details to start your journey with us.';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
          {/* ─── Top Header ─── */}
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.namaste}>Namaste, Aanandvan</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          </View>

          {/* ─── Registration Card ─── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{titleText}</Text>
              <Text style={styles.cardSub}>{subText}</Text>
            </View>

            {/* Full Name */}
            <FieldInput
              label="Full Name"
              icon="👤"
              placeholder="Aanand Kumar"
              value={form.name}
              onChangeText={update('name')}
              autoCapitalize="words"
            />

            {/* Mobile Number */}
            <FieldInput
              label="Mobile Number"
              icon="📱"
              placeholder="+91 98765 43210"
              value={form.mobile}
              onChangeText={update('mobile')}
              keyboardType="phone-pad"
            />

            {/* Email */}
            <FieldInput
              label="Email Address"
              icon="✉️"
              placeholder="aanand@example.com"
              value={form.email}
              onChangeText={update('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Address */}
            <FieldInput
              label="Address"
              icon="📍"
              placeholder="Apartment, Street, Area, City"
              value={form.address}
              onChangeText={update('address')}
              multiline
              inputHeight={80}
            />

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.registerBtnText}>Register  →</Text>
            </TouchableOpacity>

            {/* Login link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginHint}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Reusable Field Input ─────────────────────────────────────────────────────

interface FieldInputProps {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  multiline?: boolean;
  inputHeight?: number;
  secureTextEntry?: boolean;
}

const FieldInput: React.FC<FieldInputProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  inputHeight = 52,
  secureTextEntry = false,
}) => (
  <View style={fieldStyles.group}>
    <Text style={fieldStyles.label}>{label}</Text>
    <View
      style={[
        fieldStyles.wrap,
        multiline ? { height: inputHeight, alignItems: 'flex-start' as const, paddingTop: 14 } : {},
      ]}
    >
      <Text style={fieldStyles.icon}>{icon}</Text>
      <TextInput
        style={[fieldStyles.input, multiline ? { textAlignVertical: 'top' as const } : {}]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
      />
    </View>
  </View>
);

const fieldStyles = StyleSheet.create({
  group: { gap: Spacing[2] },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
    backgroundColor: Colors.white,
  },
  icon: { fontSize: 16, opacity: 0.55 },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[10],
    gap: Spacing[5],
  },

  // Top header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[2],
  },
  namaste: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 20 },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    gap: Spacing[5],
    ...Shadow.md,
  },
  cardHeader: { gap: Spacing[1] },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.55,
  },

  // Register button
  registerBtn: {
    height: 54,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
    ...Shadow.sm,
  },
  registerBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // Login link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginHint: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },
});
