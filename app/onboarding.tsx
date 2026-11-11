/**
 * Onboarding Screen — Aanandvan
 * Redesigned 3-slide full-bleed atmospheric onboarding flow:
 * - Slide 1: Every Tree Makes a Difference (with centered Aanandvan logo badge)
 * - Slide 2: Found an empty space perfect for a tree?
 * - Slide 3: Join the green movement ("Log in" & "Create account")
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface OnboardingSlide {
  id: string;
  imageUri: string;
  fallbackColor: string;
  showLogo?: boolean;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  isLast?: boolean;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    imageUri:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop&q=80',
    fallbackColor: '#132419',
    showLogo: true,
    title: 'Every Tree Makes a\nDifference',
    description:
      'Millions of trees are lost every year.\nTogether, we can change that by\nidentifying spaces and planting trees in\nour own neighborhoods.',
    primaryLabel: 'Next',
    secondaryLabel: 'Skip',
  },
  {
    id: '2',
    imageUri:
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1200&auto=format&fit=crop&q=80',
    fallbackColor: '#1A2418',
    title: 'Found an empty space perfect\nfor a tree?',
    description:
      'Take photos, add the address, and submit a\nplantation request right from your phone.',
    primaryLabel: 'Next',
    secondaryLabel: 'Skip',
  },
  {
    id: '3',
    imageUri:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
    fallbackColor: '#0E2014',
    title: 'Join the green movement',
    description:
      'Report locations, volunteer to plant,\nand watch your community grow\ngreener — one tree at a time.',
    primaryLabel: 'Log in',
    secondaryLabel: 'Create account',
    isLast: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  }, [activeIndex]);

  const goToLast = useCallback(() => {
    flatListRef.current?.scrollToIndex({
      index: SLIDES.length - 1,
      animated: true,
    });
  }, []);

  const handleLogin = useCallback(() => {
    router.push('/(auth)/login' as any);
  }, []);

  const handleRegister = useCallback(() => {
    router.push('/(auth)/role-select' as any);
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width <= 0) return;
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      if (idx >= 0 && idx < SLIDES.length) {
        setActiveIndex(idx);
      }
    },
    [width]
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { width, height, backgroundColor: item.fallbackColor }]}>
            <ImageBackground
              source={{ uri: item.imageUri }}
              style={styles.bgImage}
              resizeMode="cover"
            >
              {/* Atmospheric dark scrim for high text contrast */}
              <View style={styles.topScrim} />
              <View style={styles.bottomScrim} />

              <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Middle area: Dummy Aanandvan Logo on Screen 1 */}
                <View style={styles.middleZone}>
                  {item.showLogo && (
                    <View style={styles.logoBadge}>
                      <TreeLogoIcon size={54} color="#FFFFFF" />
                      <Text style={styles.logoLabel}>Aanandvan</Text>
                    </View>
                  )}
                </View>

                {/* Bottom Content Block */}
                <View style={styles.bottomContent}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>

                  {/* Pagination Indicators on Slides 1 & 2 */}
                  {!item.isLast && (
                    <View style={styles.dotsRow}>
                      {SLIDES.map((s, dotIdx) => {
                        const isActive = dotIdx === index;
                        return (
                          <View
                            key={s.id}
                            style={[
                              styles.dot,
                              isActive ? styles.dotActive : styles.dotInactive,
                            ]}
                          />
                        );
                      })}
                    </View>
                  )}

                  {/* Primary Yellow Pill CTA */}
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      item.isLast && { marginTop: 22 },
                    ]}
                    activeOpacity={0.88}
                    onPress={item.isLast ? handleLogin : goToNext}
                  >
                    <Text style={styles.primaryBtnText}>{item.primaryLabel}</Text>
                  </TouchableOpacity>

                  {/* Secondary Action ("Skip" or "Create account") */}
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    activeOpacity={0.75}
                    onPress={item.isLast ? handleRegister : goToLast}
                  >
                    <Text style={styles.secondaryBtnText}>{item.secondaryLabel}</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
}

// ─── Dummy Tree Logo (matching Splash / Welcome badge) ───────────────────────

const TreeLogoIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E2014',
  },
  slide: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 18, 12, 0.48)',
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: 'rgba(6, 14, 9, 0.52)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  middleZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  logoBadge: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(11, 59, 36, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 35,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    fontWeight: '400',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 20,
    marginBottom: 18,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#FFD600',
  },
  dotInactive: {
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  secondaryBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F9D68',
  },
});
