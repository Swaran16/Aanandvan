/**
 * Splash Screen — Aanandvan
 *
 * Shown on app launch for ~2.5 seconds with a fade-in animation.
 * Automatically navigates to the Onboarding flow after the delay.
 *
 * Design:
 *  - Deep forest green full-screen background (#163421)
 *  - Circular tree logo badge centered
 *  - "Aanandvan" brand name in bold white
 *  - "ESTD. 2024" uppercase letter-spaced subtitle
 *  - Decorative leaf elements (top-left, bottom-right)
 *  - Tagline in italic at bottom
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing } from '@/constants';
import { Text } from '@/components/common';

export default function SplashScreen() {
  const { height } = useWindowDimensions();

  // ─── Animations ────────────────────────────────────────────────────────────
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: logo pops in → text fades → tagline fades → navigate
    Animated.sequence([
      // 1. Logo scale + fade in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 2. Brand text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // 3. Tagline fade in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 2.8 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ─── Decorative leaf — top left ─── */}
      <View style={[styles.leafDecor, styles.leafTopLeft]}>
        <LeafIcon size={48} opacity={0.25} />
      </View>

      {/* ─── Decorative leaf — bottom right ─── */}
      <View style={[styles.leafDecor, styles.leafBottomRight]}>
        <LeafIcon size={56} opacity={0.2} />
      </View>

      {/* ─── Logo Badge ─── */}
      <Animated.View
        style={[
          styles.logoArea,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoBadge}>
          <View style={styles.logoInner}>
            {/* Tree SVG-like icon using nested views */}
            <TreeIcon size={72} color={Colors.white} />
          </View>
          <View style={styles.logoLabelWrap}>
            <Text style={styles.logoLabel}>Aanandvan</Text>
          </View>
        </View>
      </Animated.View>

      {/* ─── Brand Text ─── */}
      <Animated.View style={[styles.brandArea, { opacity: textOpacity }]}>
        <Text style={styles.brandName}>Aanandvan</Text>
        <Text style={styles.estd}>ESTD. 2024</Text>
      </Animated.View>

      {/* ─── Tagline ─── */}
      <Animated.View style={[styles.taglineArea, { opacity: taglineOpacity }]}>
        <View style={styles.divider} />
        <Text style={styles.tagline}>
          Nurturing nature, one sapling at a time.
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Inline Tree Icon ─────────────────────────────────────────────────────────

const TreeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {/* Trunk */}
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: size * 0.12,
        height: size * 0.35,
        backgroundColor: color,
        borderRadius: 4,
        opacity: 0.9,
      }}
    />
    {/* Roots left */}
    <View
      style={{
        position: 'absolute',
        bottom: 2,
        left: size * 0.2,
        width: size * 0.18,
        height: size * 0.12,
        borderBottomLeftRadius: 20,
        borderLeftWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: color,
        opacity: 0.7,
      }}
    />
    {/* Roots right */}
    <View
      style={{
        position: 'absolute',
        bottom: 2,
        right: size * 0.2,
        width: size * 0.18,
        height: size * 0.12,
        borderBottomRightRadius: 20,
        borderRightWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: color,
        opacity: 0.7,
      }}
    />
    {/* Canopy bottom */}
    <View
      style={{
        position: 'absolute',
        bottom: size * 0.28,
        width: size * 0.82,
        height: size * 0.42,
        borderRadius: size * 0.5,
        backgroundColor: color,
        opacity: 0.85,
      }}
    />
    {/* Canopy top */}
    <View
      style={{
        position: 'absolute',
        top: 0,
        width: size * 0.6,
        height: size * 0.52,
        borderRadius: size * 0.5,
        backgroundColor: color,
        opacity: 0.9,
      }}
    />
  </View>
);

// ─── Inline Leaf Icon ─────────────────────────────────────────────────────────

const LeafIcon: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => (
  <View
    style={{
      width: size,
      height: size,
      borderTopRightRadius: size,
      borderBottomLeftRadius: size * 0.3,
      backgroundColor: Colors.white,
      opacity,
      transform: [{ rotate: '-30deg' }],
    }}
  />
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Decorative leaves
  leafDecor: {
    position: 'absolute',
  },
  leafTopLeft: {
    top: '10%',
    left: Spacing[5],
  },
  leafBottomRight: {
    bottom: '22%',
    right: Spacing[5],
  },

  // Logo badge (circular octagon border)
  logoArea: {
    marginBottom: Spacing[10],
  },
  logoBadge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  logoLabelWrap: {
    marginTop: Spacing[1],
  },
  logoLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  // Brand name
  brandArea: {
    alignItems: 'center',
    gap: Spacing[2],
  },
  brandName: {
    fontSize: 48,
    fontWeight: FontWeight.extraBold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  estd: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandCream,
    letterSpacing: 4,
  },

  // Tagline
  taglineArea: {
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    paddingHorizontal: Spacing[10],
    gap: Spacing[4],
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: Colors.brandMuted,
  },
  tagline: {
    fontSize: FontSize.base,
    fontStyle: 'italic',
    color: Colors.brandCream,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
    opacity: 0.85,
  },
});
