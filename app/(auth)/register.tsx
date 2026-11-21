/**
 * Registration Screen — Aanandvan
 *
 * Accepts `role` param ('citizen' | 'volunteer'):
 * - Citizen: Full name, Email ID, Phone, Address (Dadar/Mumbai), Pin code
 * - Volunteer: Full name, Email ID, Phone, Pin code, Address, Description / Bio (replaces ID proof)
 *
 * Submits to OTP Verification (`/(auth)/otp`) with `source: 'register'`.
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
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

type Role = 'citizen' | 'volunteer';

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const userRole: Role = role === 'volunteer' ? 'volunteer' : 'citizen';
  const isVolunteer = userRole === 'volunteer';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(isVolunteer ? '' : 'Mumbai');
  const [pinCode, setPinCode] = useState('');
  const [bio, setBio] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseCurrentLocation = () => {
    setAddress('14, Ranade Road, near Shivaji Park, Dadar West, Mumbai, Maharashtra');
    setCity('Mumbai');
    setPinCode('400028');
    if (errorMsg) setErrorMsg('');
  };

  const handleSendOtp = () => {
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address for OTP verification.');
      return;
    }
    if (isVolunteer && !bio.trim()) {
      setErrorMsg('Please provide a short description about yourself and your interest in volunteering.');
      return;
    }
    if (!agreed) {
      setErrorMsg("Please agree to Aanandvan's Terms of Service and Community Code.");
      return;
    }

    router.push({
      pathname: '/(auth)/otp',
      params: {
        email: cleanEmail,
        mobile: mobile ? `+91 ${mobile}` : '+91 98123 45678',
        name: fullName.trim(),
        role: userRole,
        bio: bio.trim(),
        address: address.trim() || '14, Ranade Road, Dadar West, Mumbai',
        source: 'register',
      },
    } as any);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/role-select' as any);
    }
  };

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
        <Text style={styles.headerTitle}>Welcome to Aanandvan</Text>
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
          {/* ─── Heading ─── */}
          <Text style={styles.title}>
            {isVolunteer ? 'Volunteer registration' : 'Citizen registration'}
          </Text>
          <Text style={styles.subtitle}>
            {isVolunteer
              ? 'Tell us about yourself. Our administration team verifies volunteer applications to coordinate local Dadar & Mumbai tree drives.'
              : 'Join fellow citizens across Dadar and Mumbai in turning open concrete spaces into green canopies.'}
          </Text>

          {/* ─── Full Name ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder={isVolunteer ? 'e.g. Vaibhav Shirke' : 'e.g. Kartik Vichare'}
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errorMsg) setErrorMsg('');
              }}
              autoCapitalize="words"
            />
          </View>

          {/* ─── Email ID (Primary for login & OTP) ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email ID (for login & OTP)</Text>
            <View style={styles.iconInputWrap}>
              <View style={styles.leftIcon}>
                <Icon name="mail" size={16} color="#0B3B24" />
              </View>
              <TextInput
                style={styles.iconTextInput}
                placeholder="e.g. yourname@domain.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </View>
          </View>

          {/* ─── Mobile Number ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile number (optional)</Text>
            <View style={styles.phoneInputWrap}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={11}
                value={mobile}
                onChangeText={(text) => setMobile(text.replace(/[^0-9\s]/g, ''))}
              />
            </View>
          </View>

          {/* ─── Address & Location ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Residential Address</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. 14, Ranade Road, near Shivaji Park, Dadar West"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity
            style={styles.locationBtn}
            activeOpacity={0.75}
            onPress={handleUseCurrentLocation}
          >
            <Icon name="map-pin" size={18} color="#0B3B24" />
            <Text style={styles.locationBtnText}>Auto-detect Dadar / Mumbai location</Text>
          </TouchableOpacity>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pin code</Text>
            <TextInput
              style={styles.input}
              placeholder="400028"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={pinCode}
              onChangeText={setPinCode}
            />
          </View>

          {/* ─── Volunteer Bio / Description ─── */}
          {isVolunteer && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>About You / Description</Text>
              <TextInput
                style={[styles.textArea, { minHeight: 96 }]}
                placeholder="Tell us about yourself, your availability in Dadar/Mumbai, and your motivation to volunteer for tree plantation & maintenance..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={bio}
                onChangeText={(text) => {
                  setBio(text);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </View>
          )}

          {/* Error Message */}
          {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {/* ─── Terms & Conditions Checkbox ─── */}
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.8}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Icon name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text> of Aanandvan.
            </Text>
          </TouchableOpacity>

          {/* ─── Primary CTA ─── */}
          <TouchableOpacity
            style={styles.sendOtpBtn}
            activeOpacity={0.88}
            onPress={handleSendOtp}
          >
            <Text style={styles.sendOtpText}>Send Verification Code</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B3B24',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  countryCodeBox: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  iconTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
  },
  locationBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B24',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0B3B24',
    borderColor: '#0B3B24',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  termsLink: {
    color: '#0B3B24',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  sendOtpBtn: {
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
  },
  sendOtpText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
