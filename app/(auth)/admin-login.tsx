/**
 * Admin Login Screen — Aanandvan
 * Dedicated authentication page for platform administrators.
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

export default function AdminLoginScreen() {
  const { loginAs } = useApp();
  const [adminId, setAdminId] = useState('admin@aanandvan.in');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (targetRoute: '/(admin)' | '/(admin)/volunteers' = '/(admin)') => {
    if (!adminId.trim()) {
      setErrorMsg('Please enter your admin ID or email.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      loginAs('admin');
      router.replace(targetRoute as any);
    }, 400);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/login' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* ─── Top Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={26} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Portal</Text>
        <View style={styles.headerRightPlaceholder} />
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
          {/* ─── Shield Icon & Titles ─── */}
          <View style={styles.iconCircle}>
            <Icon name="settings" size={32} color="#0A4D2E" />
          </View>

          <Text style={styles.title}>Admin Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your administrative credentials to manage plantation drives, review volunteer applications, and oversee operations.
          </Text>

          {/* ─── Form Card ─── */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Admin Email / ID</Text>
              <View style={styles.inputWrap}>
                <Icon name="document" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="admin@aanandvan.in"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={adminId}
                  onChangeText={(val) => {
                    setAdminId(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Security PIN / Password</Text>
              <View style={styles.inputWrap}>
                <Icon name="settings" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit PIN"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                />
              </View>
            </View>

            {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.88}
              onPress={() => handleLogin('/(admin)')}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In to Admin Console</Text>
              )}
            </TouchableOpacity>

            {/* Direct Jump to Volunteer Management */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={() => handleLogin('/(admin)/volunteers')}
            >
              <Text style={styles.secondaryBtnText}>
                Open Volunteer Management →
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Security Badge */}
          <View style={styles.footer}>
            <Icon name="check-circle" size={15} color="#059669" />
            <Text style={styles.footerText}>
              Aanandvan Secure Portal • 256-Bit Encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3B24',
  },
  headerRightPlaceholder: {
    width: 36,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D1E8DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3B24',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 18,
  },
  inputGroup: {
    gap: 7,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderWidth: 1.2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  errorText: {
    fontSize: 12.5,
    color: '#DC2626',
    fontWeight: '500',
  },
  primaryBtn: {
    height: 50,
    backgroundColor: '#0A4D2E',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#0A4D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#0A4D2E',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0A4D2E',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 36,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

