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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
            <View style={styles.innerSeal}>
              <MaterialCommunityIcons name="sprout" size={56} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View style={[styles.brandWrap, { opacity: textOpacity }]}>
          <Text style={styles.brandTitle}>Aanandvan</Text>
          <View style={styles.estdBadge}>
            <Text style={styles.estdText}>ESTD. 2024</Text>
          </View>
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
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  innerSeal: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  brandWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FAFBF9',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 46,
    paddingHorizontal: 12,
  },
  estdBadge: {
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  estdText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D8F37E',
    letterSpacing: 2,
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
