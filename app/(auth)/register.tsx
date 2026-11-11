/**
 * Registration Screen — Aanandvan (Designs 2 & 4)
 *
 * Accepts `role` param ('citizen' | 'volunteer'):
 * - Design 2 (`citizen`): Citizen registration with Address, Use Current Location, City, Pin Code
 * - Design 4 (`volunteer`): Volunteer registration with Pin Code, Current Address, Motivation & ID Proof Upload
 *
 * Both flows submit to OTP Verification (`/(auth)/otp`) with `source: 'register'`.
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
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [motivation, setMotivation] = useState('');
  const [idProofFile, setIdProofFile] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseCurrentLocation = () => {
    setAddress('Flat 402, Green Meadows, Powai, Mumbai, Maharashtra');
    if (!isVolunteer) {
      setCity('Mumbai');
    }
    setPinCode('400076');
    if (errorMsg) setErrorMsg('');
  };

  const handleUploadIdProof = () => {
    setIdProofFile(
      idProofFile ? null : 'Govt_ID_Proof_Aadhaar.pdf'
    );
  };

  const handleSendOtp = () => {
    const digitsOnly = mobile.replace(/\s+/g, '');
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!agreed) {
      setErrorMsg("Please agree to Aanandvan's Terms of Service and Privacy Policy.");
      return;
    }

    const finalDigits = digitsOnly.length === 10 ? digitsOnly : '9876542536';

    router.push({
      pathname: '/(auth)/otp',
      params: {
        mobile: `+91 ${finalDigits.slice(0, 5)} ${finalDigits.slice(5)}`,
        name: fullName.trim() || (isVolunteer ? 'Amit Kumar' : 'Rahul Sharma'),
        role: userRole,
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
              ? 'Tell us about yourself. Our team reviews every application before you start accepting requests.'
              : 'Fill in your details to start your journey with us.'}
          </Text>

          {/* ─── Full Name ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* ─── Mobile Number ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile number</Text>
            <View style={styles.phoneInputWrap}>
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
                onChangeText={(text) => {
                  setMobile(text.replace(/[^0-9\s]/g, ''));
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </View>
          </View>

          {/* ─── Email Address (Optional) ─── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address (Optional)</Text>
            <View style={styles.iconInputWrap}>
              <View style={styles.leftIcon}>
                <Icon name="mail" size={16} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.iconTextInput}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* ─── Role-Specific Address / Pin Code Order ─── */}
          {isVolunteer ? (
            <>
              {/* Pin code first on Volunteer registration */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Pin code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="400076"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pinCode}
                  onChangeText={setPinCode}
                />
              </View>

              {/* Current Address */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Current Address</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter your current address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Use my current location */}
              <TouchableOpacity
                style={styles.locationBtn}
                activeOpacity={0.75}
                onPress={handleUseCurrentLocation}
              >
                <CrosshairIcon size={18} color="#0B3B24" />
                <Text style={styles.locationBtnText}>Use my current location</Text>
              </TouchableOpacity>

              {/* Why do you want to volunteer? */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Why do you want to volunteer?</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Share your experience or inspiration..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={motivation}
                  onChangeText={setMotivation}
                />
              </View>

              {/* ID Proof Upload */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ID Proof</Text>
                <TouchableOpacity
                  style={[
                    styles.uploadBox,
                    idProofFile ? styles.uploadBoxFilled : undefined,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleUploadIdProof}
                >
                  <Icon
                    name={idProofFile ? 'check-circle' : 'upload'}
                    size={18}
                    color={idProofFile ? '#0B3B24' : '#374151'}
                  />
                  <Text
                    style={[
                      styles.uploadText,
                      idProofFile ? styles.uploadTextSelected : undefined,
                    ]}
                    numberOfLines={1}
                  >
                    {idProofFile || 'Upload a PNG or PDF of any government ID'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Address on Citizen registration */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter your current address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Use my current location */}
              <TouchableOpacity
                style={styles.locationBtn}
                activeOpacity={0.75}
                onPress={handleUseCurrentLocation}
              >
                <CrosshairIcon size={18} color="#0B3B24" />
                <Text style={styles.locationBtnText}>Use my current location</Text>
              </TouchableOpacity>

              {/* City */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mumbai"
                  placeholderTextColor="#9CA3AF"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              {/* Pin code */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Pin code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="400076"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pinCode}
                  onChangeText={setPinCode}
                />
              </View>
            </>
          )}

          {/* ─── Terms Checkbox ─── */}
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.8}
            onPress={() => {
              setAgreed((prev) => !prev);
              if (errorMsg) setErrorMsg('');
            }}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Icon name="check" size={12} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I agree to Aanandvan's{' '}
              <Text style={styles.checkboxBold}>Terms of Service</Text> and{' '}
              <Text style={styles.checkboxBold}>Privacy Policy.</Text>
            </Text>
          </TouchableOpacity>

          {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {/* ─── Submit Button ─── */}
          <TouchableOpacity
            style={styles.sendOtpBtn}
            activeOpacity={0.88}
            onPress={handleSendOtp}
          >
            <Text style={styles.sendOtpText}>Send OTP</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Crosshair GPS Icon ───────────────────────────────────────────────────────

const CrosshairIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const ring = size * 0.62;
  const dot = size * 0.18;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: color,
          }}
        />
      </View>
      {/* Top/Bottom/Left/Right ticks */}
      <View style={{ position: 'absolute', top: 0, width: 1.5, height: 4, backgroundColor: color }} />
      <View style={{ position: 'absolute', bottom: 0, width: 1.5, height: 4, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 0, height: 1.5, width: 4, backgroundColor: color }} />
      <View style={{ position: 'absolute', right: 0, height: 1.5, width: 4, backgroundColor: color }} />
    </View>
  );
};

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
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 32,
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
    marginBottom: 18,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14.5,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countryCodeBox: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  countryCodeText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#6B7280',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 14.5,
    color: '#111827',
  },
  iconInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    gap: 10,
  },
  leftIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 14.5,
    color: '#111827',
  },
  textArea: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  locationBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
  },
  uploadBox: {
    minHeight: 74,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  uploadBoxFilled: {
    borderColor: '#0A4D2E',
    backgroundColor: '#F4F9F6',
  },
  uploadText: {
    flex: 1,
    fontSize: 13.5,
    color: '#6B7280',
  },
  uploadTextSelected: {
    color: '#0B3B24',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#0A4D2E',
    borderColor: '#0A4D2E',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },
  checkboxBold: {
    fontWeight: '700',
    color: '#4B5563',
  },
  errorText: {
    fontSize: 12.5,
    color: '#DC2626',
    marginBottom: 12,
  },
  sendOtpBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOtpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
