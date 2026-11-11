/**
 * Role Selection / Create an Account Screen — Aanandvan (Design 5)
 * Matches Design 5:
 * - Header: Back arrow + "Create an Account"
 * - Left-aligned "Join the Green Movement" + mission subtitle
 * - Radio list options: "I'm a citizen" & "I'm a volunteer" ("Verification required" pill)
 * - Bottom CTA: "Continue", "Already have an account? Login here", Privacy Protocol & Terms/Help links
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

export default function RoleSelectScreen() {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'volunteer'>('citizen');

  const handleContinue = () => {
    router.push({
      pathname: '/(auth)/register',
      params: { role: selectedRole },
    } as any);
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
        <Text style={styles.headerTitle}>Create an Account</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Top Content ─── */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Join the Green Movement</Text>
          <Text style={styles.subtitle}>
            Choose how you want to contribute to Aanandvan's environmental mission.
          </Text>

          {/* Radio Options List */}
          <View style={styles.radioList}>
            {/* Option 1: Citizen */}
            <TouchableOpacity
              style={styles.radioItem}
              activeOpacity={0.75}
              onPress={() => setSelectedRole('citizen')}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedRole === 'citizen' && styles.radioOuterSelected,
                ]}
              >
                {selectedRole === 'citizen' && <View style={styles.radioInner} />}
              </View>

              <View style={styles.radioBody}>
                <Text style={styles.radioTitle}>I'm a citizen</Text>
                <Text style={styles.radioDesc}>
                  Report locations for potential plantations and track ecological growth in your neighborhood.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Volunteer */}
            <TouchableOpacity
              style={styles.radioItem}
              activeOpacity={0.75}
              onPress={() => setSelectedRole('volunteer')}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedRole === 'volunteer' && styles.radioOuterSelected,
                ]}
              >
                {selectedRole === 'volunteer' && <View style={styles.radioInner} />}
              </View>

              <View style={styles.radioBody}>
                <View style={styles.volunteerTitleRow}>
                  <Text style={styles.radioTitle}>I'm a volunteer</Text>
                  <View style={styles.verificationBadge}>
                    <Text style={styles.verificationText}>Verification required</Text>
                  </View>
                </View>
                <Text style={styles.radioDesc}>
                  Apply for plantation drives, lead local teams, and earn certifications for your environmental service.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Bottom CTA & Footer ─── */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.88}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login' as any)}
              activeOpacity={0.75}
            >
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.shieldRow}>
              <View style={styles.shieldBadge}>
                <Icon name="shield" size={12} color="#9CA3AF" />
              </View>
              <Text style={styles.footerText}>
                Your data is protected by Aanandvan Privacy Protocol
              </Text>
            </View>

            <View style={styles.linksRow}>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerPipe}>|</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.footerLink}>Help Center</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  topSection: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#7B8782',
    lineHeight: 19,
    marginBottom: 24,
  },
  radioList: {
    gap: 22,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: '#0B3B24',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0B3B24',
  },
  radioBody: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3B24',
  },
  volunteerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  verificationBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  radioDesc: {
    fontSize: 13,
    color: '#7B8782',
    lineHeight: 18,
    marginTop: 4,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 32,
  },
  continueBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  loginLink: {
    fontSize: 14,
    color: '#0B3B24',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shieldBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 11.5,
    color: '#9CA3AF',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 11.5,
    color: '#9CA3AF',
  },
  footerPipe: {
    fontSize: 11.5,
    color: '#D1D5DB',
  },
});
