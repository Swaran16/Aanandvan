/**
 * Onboarding Screen — Aanandvan
 * Responsive 4-slide horizontal onboarding flow
 * Fully adapts dynamically to any screen width/height
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';
import { Text } from '@/components/common';

// ─── Onboarding Data ──────────────────────────────────────────────────────────

interface StepItem {
  icon: string;
  title: string;
  description: string;
}

interface OnboardingSlide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  darkTheme?: boolean;
  steps?: StepItem[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../assets/images/onboarding1.png'),
    title: 'Every Tree Makes a Difference',
    description:
      'Millions of trees are lost every year. Together, we can change that by identifying spaces and planting trees in our own neighborhoods.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'Spot a Location, Report It Instantly',
    description:
      'Found an empty space perfect for a tree? Take photos, add the address, and submit a plantation request right from your phone in minutes.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'Volunteers Bring the Green to Life',
    description:
      'Verified volunteers accept plantation requests, collect saplings from partnered nurseries, plant trees, and continue caring for them until they thrive.',
    steps: [
      { icon: '✅', title: '1. Accept request', description: 'Review and claim local planting tasks' },
      { icon: '🌱', title: '2. Collect saplings', description: 'Pick up young trees from registered nurseries' },
      { icon: '🌳', title: '3. Plant at location', description: 'Follow eco-guidelines for successful planting' },
      { icon: '📸', title: '4. Maintain and upload', description: 'Regular watering and growth photo updates' },
    ],
  },
  {
    id: '4',
    image: require('../assets/images/onboarding4.png'),
    title: 'Join the Green Movement',
    description:
      'Report locations, volunteer to plant, and watch your community grow greener — one tree at a time.',
    darkTheme: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
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

  const handleGetStarted = useCallback(() => {
    router.replace('/(auth)/login');
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      if (idx >= 0 && idx < SLIDES.length) {
        setActiveIndex(idx);
      }
    },
    [width]
  );

  const currentSlide = SLIDES[activeIndex] || SLIDES[0];

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentSlide.darkTheme ? 'light-content' : 'dark-content'} />

      <Animated.FlatList
        ref={flatListRef as any}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) =>
          item.darkTheme ? (
            <DarkSlide
              slide={item}
              width={width}
              height={height}
              onGetStarted={handleGetStarted}
              onLogin={handleGetStarted}
              scrollX={scrollX}
            />
          ) : (
            <LightSlide
              slide={item}
              width={width}
              height={height}
              slideIndex={index}
              onNext={goToNext}
              onSkip={goToLast}
              scrollX={scrollX}
            />
          )
        }
      />
    </View>
  );
}

// ─── Dot Indicator ────────────────────────────────────────────────────────────

const DotIndicator: React.FC<{
  scrollX: Animated.Value;
  width: number;
  dark?: boolean;
}> = ({ scrollX, width, dark = false }) => (
  <View style={dotStyles.row}>
    {SLIDES.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 24, 8],
        extrapolate: 'clamp',
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View
          key={i}
          style={[
            dotStyles.dot,
            {
              width: dotWidth,
              opacity,
              backgroundColor: dark ? '#FFFFFF' : '#1B4332',
            },
          ]}
        />
      );
    })}
  </View>
);

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

// ─── Light Slide (slides 1-3) ─────────────────────────────────────────────────

const LightSlide: React.FC<{
  slide: OnboardingSlide;
  width: number;
  height: number;
  slideIndex: number;
  onNext: () => void;
  onSkip: () => void;
  scrollX: Animated.Value;
}> = ({ slide, width, height, slideIndex, onNext, onSkip, scrollX }) => {
  const imageHeight = Math.min(Math.max(height * 0.4, 240), 380);

  return (
    <View style={[lightStyles.slide, { width }]}>
      {/* Illustration */}
      <View style={[lightStyles.imageContainer, { width, height: imageHeight }]}>
        <Image source={slide.image} style={lightStyles.image} resizeMode="cover" />
      </View>

      {/* White rounded bottom card */}
      <View style={lightStyles.card}>
        <ScrollView
          contentContainerStyle={lightStyles.cardScroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Dots */}
          <DotIndicator scrollX={scrollX} width={width} />

          {/* Title */}
          <Text style={lightStyles.title}>{slide.title}</Text>

          {/* Description */}
          <Text style={lightStyles.description}>{slide.description}</Text>

          {/* Steps (slide 3 only) */}
          {slide.steps && (
            <View style={lightStyles.stepsContainer}>
              {slide.steps.map((step, idx) => (
                <View key={idx} style={lightStyles.stepRow}>
                  <View style={lightStyles.stepIconBadge}>
                    <Text style={lightStyles.stepIcon}>{step.icon}</Text>
                  </View>
                  <View style={lightStyles.stepText}>
                    <Text style={lightStyles.stepTitle}>{step.title}</Text>
                    <Text style={lightStyles.stepDesc}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Next Button */}
          <TouchableOpacity style={lightStyles.nextBtn} onPress={onNext} activeOpacity={0.85}>
            <Text style={lightStyles.nextBtnText}>Next  →</Text>
          </TouchableOpacity>

          {/* Skip */}
          {slideIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={onSkip} style={lightStyles.skipBtn} activeOpacity={0.7}>
              <Text style={lightStyles.skipText}>
                {slideIndex === 2 ? 'Skip for now' : 'Skip'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const lightStyles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: '#E8F5EE',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardScroll: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B3B24',
    textAlign: 'center',
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: '#4B6E5A',
    lineHeight: 21,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 10,
    marginTop: 6,
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F7FAF8',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F5EE',
  },
  stepIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8EFE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: 16,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  stepDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  nextBtn: {
    backgroundColor: '#0B3B24',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    alignSelf: 'stretch',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    color: '#2D6A4F',
    fontWeight: '600',
  },
});

// ─── Dark Slide (slide 4) ─────────────────────────────────────────────────────

const DarkSlide: React.FC<{
  slide: OnboardingSlide;
  width: number;
  height: number;
  onGetStarted: () => void;
  onLogin: () => void;
  scrollX: Animated.Value;
}> = ({ slide, width, height, onGetStarted, onLogin, scrollX }) => {
  const imageHeight = Math.min(Math.max(height * 0.42, 240), 380);

  return (
    <SafeAreaView style={[darkStyles.slide, { width }]} edges={['bottom']}>
      {/* Illustration */}
      <View style={[darkStyles.imageContainer, { width, height: imageHeight }]}>
        <Image source={slide.image} style={darkStyles.image} resizeMode="cover" />
      </View>

      {/* Bottom content */}
      <View style={darkStyles.content}>
        <ScrollView
          contentContainerStyle={darkStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <DotIndicator scrollX={scrollX} width={width} dark />

          <Text style={darkStyles.title}>{slide.title}</Text>
          <Text style={darkStyles.description}>{slide.description}</Text>

          <TouchableOpacity
            style={darkStyles.getStartedBtn}
            onPress={onGetStarted}
            activeOpacity={0.85}
          >
            <Text style={darkStyles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={darkStyles.loginBtn}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Text style={darkStyles.loginText}>Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const darkStyles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#0B3B24',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
  },
  description: {
    fontSize: 14,
    color: '#C8E6C9',
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.9,
  },
  getStartedBtn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  getStartedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3B24',
  },
  loginBtn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B3B24',
  },
});
