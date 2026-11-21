/**
 * Splash Screen — Aanandvan
 *
 * Shown on app launch for ~2.5 seconds with a fade-in animation.
 * Automatically navigates to the Onboarding flow after the delay.
 *
 * Design:
 *  - Deep organic forest green full-screen background (#163E2B)
 *  - Circular tree emblem seal centered with crisp contrast
 *  - "Aanandvan" brand name with comfortable line height and no text clipping
 *  - Urban forestry subtitle & community tagline
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/common';

export default function SplashScreen() {
  // ─── Animations ────────────────────────────────────────────────────────────
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo scale + fade in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
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

    // Navigate after 2.6 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative leaf motifs */}
      <View style={[styles.leafDecor, styles.leafTopLeft]}>
        <LeafIcon size={52} opacity={0.15} />
      </View>
      <View style={[styles.leafDecor, styles.leafBottomRight]}>
        <LeafIcon size={64} opacity={0.12} />
      </View>

      {/* ─── Center Emblem & Brand Name ─── */}
      <View style={styles.centerContainer}>
        {/* Emblem Seal */}
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.sealCircle}>
            <TreeIcon size={68} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View style={[styles.brandWrap, { opacity: textOpacity }]}>
          <Text style={styles.brandTitle}>Aanandvan</Text>
          <Text style={styles.brandSubtitle}>MUMBAI URBAN FORESTRY INITIATIVE</Text>
        </Animated.View>
      </View>

      {/* ─── Bottom Tagline ─── */}
      <Animated.View style={[styles.taglineWrap, { opacity: taglineOpacity }]}>
        <View style={styles.divider} />
        <Text style={styles.tagline}>
          Restoring native green canopies, one sapling at a time.
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
        height: size * 0.38,
        backgroundColor: color,
        borderRadius: 4,
        opacity: 0.95,
      }}
    />
    {/* Foliage main central dome */}
    <View
      style={{
        position: 'absolute',
        top: 0,
        width: size * 0.72,
        height: size * 0.58,
        borderRadius: size * 0.36,
        backgroundColor: color,
      }}
    />
    {/* Foliage left cloud */}
    <View
      style={{
        position: 'absolute',
        top: size * 0.16,
        left: 0,
        width: size * 0.46,
        height: size * 0.46,
        borderRadius: size * 0.23,
        backgroundColor: color,
        opacity: 0.9,
      }}
    />
    {/* Foliage right cloud */}
    <View
      style={{
        position: 'absolute',
        top: size * 0.16,
        right: 0,
        width: size * 0.46,
        height: size * 0.46,
        borderRadius: size * 0.23,
        backgroundColor: color,
        opacity: 0.9,
      }}
    />
  </View>
);

// ─── Inline Leaf Motif ────────────────────────────────────────────────────────

const LeafIcon: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => (
  <View
    style={{
      width: size,
      height: size,
      borderTopRightRadius: size,
      borderBottomLeftRadius: size * 0.3,
      backgroundColor: '#FFFFFF',
      opacity,
      transform: [{ rotate: '-30deg' }],
    }}
  />
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#163E2B',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  leafDecor: {
    position: 'absolute',
  },
  leafTopLeft: {
    top: '8%',
    left: 20,
  },
  leafBottomRight: {
    bottom: '12%',
    right: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoWrap: {
    marginBottom: 20,
  },
  sealCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2.5,
    borderColor: '#C7EED8',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  brandWrap: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FAFBF9',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 42,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A7D4B6',
    letterSpacing: 1.5,
    marginTop: 6,
    textAlign: 'center',
  },
  taglineWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    width: 44,
    height: 2,
    backgroundColor: 'rgba(199, 238, 216, 0.35)',
    borderRadius: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    color: '#D1EAE0',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
