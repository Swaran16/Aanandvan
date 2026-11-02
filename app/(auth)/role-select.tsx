/**
 * Role Selection Screen — Aanandvan
 *
 * "Create an Account" screen with two role cards:
 *   - I'm a Citizen
 *   - I'm a Volunteer (with "Verification Required" badge)
 *
 * After selecting a role, navigates to the registration form
 * with the chosen role as a query param.
 *
 * Matches Figma: back arrow, centered leaf-badge icon,
 * "Join the Green Movement" heading, bordered role cards,
 * "Already have an account? Login here" footer, and
 * privacy/terms footer text.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';
import { Text } from '@/components/common';

export default function RoleSelectScreen() {
  const handleSelect = (role: 'citizen' | 'volunteer') => {
    if (role === 'citizen') {
      router.replace('/(tabs)');
    } else {
      router.replace('/(volunteer)' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create an Account</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ─── Icon Badge ─── */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <LeafIcon />
          </View>
          <Text style={styles.movementTitle}>Join the Green Movement</Text>
          <Text style={styles.movementSub}>
            Choose how you want to contribute to{'\n'}Aanandvan's environmental mission.
          </Text>
        </View>

        {/* ─── Role Cards ─── */}
        <View style={styles.cardsSection}>
          {/* Citizen Card */}
          <TouchableOpacity
            style={styles.roleCard}
            activeOpacity={0.8}
            onPress={() => handleSelect('citizen')}
          >
            <View style={styles.roleIconCircle}>
              <Text style={styles.roleEmoji}>🌱</Text>
            </View>
            <View style={styles.roleTextWrap}>
              <Text style={styles.roleName}>I'm a Citizen</Text>
              <Text style={styles.roleDesc}>
                Report locations for potential plantations and track ecological growth in your neighborhood.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Volunteer Card */}
          <TouchableOpacity
            style={styles.roleCard}
            activeOpacity={0.8}
            onPress={() => handleSelect('volunteer')}
          >
            <View style={[styles.roleIconCircle, { backgroundColor: Colors.brandMint }]}>
              <Text style={styles.roleEmoji}>🌿</Text>
            </View>
            <View style={styles.roleTextWrap}>
              <Text style={styles.roleName}>I'm a Volunteer</Text>
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationText}>VERIFICATION REQUIRED</Text>
              </View>
              <Text style={styles.roleDesc}>
                Apply for plantation drives, lead local teams, and earn certifications for your environmental service.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Login Link ─── */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Already have an account?  </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Login here</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Footer ─── */}
        <View style={styles.footer}>
          <View style={styles.footerShield}>
            <Text style={styles.footerShieldIcon}>🛡</Text>
            <Text style={styles.footerText}>
              Your data is protected by Aanandvan Privacy Protocol
            </Text>
          </View>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
            <Text style={styles.footerDot}>  •  </Text>
            <Text style={styles.footerLinkText}>Help Center</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Inline Leaf Icon ─────────────────────────────────────────────────────────

const LeafIcon: React.FC = () => (
  <View style={leafStyles.wrap}>
    {/* Main leaf body */}
    <View style={leafStyles.leafBody} />
    {/* Leaf stem */}
    <View style={leafStyles.leafStem} />
  </View>
);

const leafStyles = StyleSheet.create({
  wrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafBody: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderTopLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.white,
    transform: [{ rotate: '45deg' }],
  },
  leafStem: {
    position: 'absolute',
    bottom: 3,
    left: 6,
    width: 2,
    height: 14,
    backgroundColor: Colors.white,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[6],
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // Icon section
  iconSection: {
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[7],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  movementTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  movementSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Role cards
  cardsSection: {
    gap: Spacing[4],
    marginBottom: Spacing[8],
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: Colors.brandAccent,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    gap: Spacing[4],
    backgroundColor: Colors.white,
  },
  roleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleEmoji: { fontSize: 22 },
  roleTextWrap: {
    flex: 1,
    gap: Spacing[2],
  },
  roleName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  roleDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  verificationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
    letterSpacing: 0.5,
  },

  // Login link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  loginHint: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.brandPrimary,
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: Spacing[2],
    marginTop: 'auto' as any,
  },
  footerShield: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  footerShieldIcon: { fontSize: 14, opacity: 0.5 },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  footerDot: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
