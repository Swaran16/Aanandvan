/**
 * Login Screen — Aanandvan
 * Role-based authentication supporting Citizen, Volunteer, and Admin
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
import { Colors } from '@/constants';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const { loginAs } = useApp();
  const [role, setRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('citizen@aanandvan.in');
  const [password, setPassword] = useState('citizen123');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'citizen') {
      setEmail('citizen@aanandvan.in');
      setPassword('citizen123');
    } else if (selectedRole === 'volunteer') {
      setEmail('volunteer@aanandvan.in');
      setPassword('volunteer123');
    } else {
      setEmail('admin@aanandvan.in');
      setPassword('admin123');
    }
  };

  const handleLogin = (targetRole?: UserRole) => {
    const roleToLogin = targetRole || role;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginAs(roleToLogin, email);
      if (roleToLogin === 'admin') {
        router.replace('/(admin)' as any);
      } else if (roleToLogin === 'volunteer') {
        router.replace('/(volunteer)' as any);
      } else {
        router.replace('/(citizen)' as any);
      }
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3B24" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Banner */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoBadge}>
                <Icon name="tree" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.headerTitle}>Aanandvan</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Empowering communities to plant, protect, and preserve green canopies.
            </Text>
          </View>

          <View style={styles.body}>
            {/* Role Select Tabs */}
            <Text style={styles.sectionLabel}>SELECT ROLE</Text>
            <View style={styles.roleTabsContainer}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'citizen' && styles.roleTabActive]}
                onPress={() => handleRoleSelect('citizen')}
              >
                <Icon
                  name="profile"
                  size={16}
                  color={role === 'citizen' ? '#0B3B24' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'citizen' && styles.roleTabTextActive,
                  ]}
                >
                  Citizen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'volunteer' && styles.roleTabActive]}
                onPress={() => handleRoleSelect('volunteer')}
              >
                <Icon
                  name="plant"
                  size={16}
                  color={role === 'volunteer' ? '#0B3B24' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'volunteer' && styles.roleTabTextActive,
                  ]}
                >
                  Volunteer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'admin' && styles.roleTabActive]}
                onPress={() => handleRoleSelect('admin')}
              >
                <Icon
                  name="overview"
                  size={16}
                  color={role === 'admin' ? '#0B3B24' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'admin' && styles.roleTabTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Demo Access Bar */}
            <View style={styles.quickAccessCard}>
              <Text style={styles.quickAccessTitle}>⚡ Instant Demo Access</Text>
              <Text style={styles.quickAccessSub}>
                Tap any role to immediately test without typing credentials:
              </Text>
              <View style={styles.demoButtonsRow}>
                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => handleLogin('citizen')}
                >
                  <Text style={styles.demoBtnText}>Citizen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnVolunteer]}
                  onPress={() => handleLogin('volunteer')}
                >
                  <Text style={styles.demoBtnText}>Volunteer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoBtn, styles.demoBtnAdmin]}
                  onPress={() => handleLogin('admin')}
                >
                  <Text style={styles.demoBtnText}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Inputs */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email / Mobile Number</Text>
              <View style={styles.inputBox}>
                <Icon name="mail" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email or mobile"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputBox}>
                <Icon name="lock" size={18} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter password"
                />
              </View>
            </View>

            {/* Login Action */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleLogin()}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>
                  Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              )}
            </TouchableOpacity>

            {/* Role Helper Info */}
            <View style={styles.infoBox}>
              <Icon name="info" size={16} color="#0B3B24" />
              <Text style={styles.infoBoxText}>
                {role === 'citizen' &&
                  'Citizens can submit plantation requests, monitor live admin verification, and track assigned volunteers.'}
                {role === 'volunteer' &&
                  'Volunteers can discover available community drives, accept requests, schedule planting, and post before/after updates.'}
                {role === 'admin' &&
                  'Admins can verify citizen requests, approve volunteer applications, review schedules, and track platform metrics.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#0B3B24',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#C8E6C9',
    marginTop: 10,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B6E5A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  roleTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5EFEA',
    borderRadius: 14,
    padding: 4,
    gap: 6,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleTabTextActive: {
    color: '#0B3B24',
    fontWeight: '700',
  },
  quickAccessCard: {
    backgroundColor: '#E8F5EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C7EED8',
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 4,
  },
  quickAccessSub: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 16,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#1B4332',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  demoBtnVolunteer: {
    backgroundColor: '#2D6A4F',
  },
  demoBtnAdmin: {
    backgroundColor: '#0F3E2E',
  },
  demoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  primaryBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },
});
