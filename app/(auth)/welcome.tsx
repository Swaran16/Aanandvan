/**
 * Welcome Screen — Aanandvan
 *
 * Entry point for auth. Forest background image at top,
 * white card below with Logo, Login and Register CTAs.
 *
 * Design:
 *  - Top ~45%: Dense forest canopy photo
 *  - Overlaid dark green logo badge (circular)
 *  - "Aanandvan" bold white title on dark overlay
 *  - White bottom card: welcome text, Login btn, Register btn, Guest link
 *  - Footer: CO2 Neutral | Secure Portal badges
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '@/constants';
import { Text } from '@/components/common';

export default function WelcomeScreen() {
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(Math.max(height * 0.42, 220), 380);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ─── Forest Background Hero ─── */}
      <View style={[styles.hero, { height: heroHeight, overflow: 'hidden' }]}>
        <Image
          source={require('../../assets/images/welcome_bg.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Dark overlay for legibility */}
        <View style={styles.heroOverlay} />

        {/* Logo Badge */}
        <View style={styles.logoBadge}>
          <TreeLogoIcon />
          <Text style={styles.logoText}>Aanandvan</Text>
        </View>

        {/* Brand name on the dark overlay */}
        <Text style={styles.heroTitle}>Aanandvan</Text>
      </View>

      {/* ─── White Bottom Card ─── */}
      <SafeAreaView style={styles.card} edges={['bottom']}>
        <View style={styles.cardInner}>
          {/* Heading */}
          <Text style={styles.heading}>Welcome to Aanandvan</Text>
          <Text style={styles.subheading}>
            Join our global mission to restore nature and build a sustainable future, one sapling at a time.
          </Text>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login  →</Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/role-select')}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>Register  👤</Text>
          </TouchableOpacity>

          {/* Guest Link */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            style={styles.guestBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Trust Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🛡</Text>
              <Text style={styles.badgeText}>CO2 Neutral</Text>
            </View>
            <View style={styles.badgeDivider} />
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🔒</Text>
              <Text style={styles.badgeText}>Secure Portal</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Inline Tree Logo ─────────────────────────────────────────────────────────

const TreeLogoIcon: React.FC = () => (
  <View style={logoStyles.wrap}>
    {/* Trunk */}
    <View style={logoStyles.trunk} />
    {/* Left root */}
    <View style={logoStyles.rootLeft} />
    {/* Right root */}
    <View style={logoStyles.rootRight} />
    {/* Canopy bottom */}
    <View style={logoStyles.canopyBot} />
    {/* Canopy top */}
    <View style={logoStyles.canopyTop} />
  </View>
);

const logoStyles = StyleSheet.create({
  wrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  trunk: {
    position: 'absolute', bottom: 0,
    width: 5, height: 16,
    backgroundColor: Colors.white, borderRadius: 2, opacity: 0.9,
  },
  rootLeft: {
    position: 'absolute', bottom: 1, left: 7,
    width: 8, height: 5,
    borderBottomLeftRadius: 8, borderLeftWidth: 2, borderBottomWidth: 2,
    borderColor: Colors.white, opacity: 0.7,
  },
  rootRight: {
    position: 'absolute', bottom: 1, right: 7,
    width: 8, height: 5,
    borderBottomRightRadius: 8, borderRightWidth: 2, borderBottomWidth: 2,
    borderColor: Colors.white, opacity: 0.7,
  },
  canopyBot: {
    position: 'absolute', bottom: 13,
    width: 36, height: 18,
    borderRadius: 18, backgroundColor: Colors.white, opacity: 0.85,
  },
  canopyTop: {
    position: 'absolute', top: 0,
    width: 26, height: 24,
    borderRadius: 13, backgroundColor: Colors.white, opacity: 0.9,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.brandDark,
  },

  // Hero / forest bg
  hero: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing[6],
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.brandDark,
    opacity: 0.55,
  },
  logoBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.brandPrimary,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    marginBottom: Spacing[3],
    ...Shadow.lg,
  },
  logoText: {
    fontSize: 11,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: FontWeight.extraBold,
    color: Colors.white,
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  // White card
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -Spacing[6],
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[7],
    gap: Spacing[4],
  },
  heading: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.6,
  },

  // Buttons
  loginBtn: {
    height: 54,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
    ...Shadow.sm,
  },
  loginBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  registerBtn: {
    height: 54,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  registerBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandPrimary,
    letterSpacing: 0.3,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: Spacing[1],
  },
  guestText: {
    fontSize: FontSize.sm,
    color: Colors.gray400,
    fontWeight: FontWeight.medium,
  },

  // Trust badges
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[4],
    marginTop: Spacing[2],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  badgeIcon: { fontSize: 14, opacity: 0.6 },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.gray400,
    fontWeight: FontWeight.medium,
  },
  badgeDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
  },
});
