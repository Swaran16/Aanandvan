/**
 * Onboarding Screen — Aanandvan
 *
 * A 4-slide horizontal swipeable onboarding flow.
 *
 * Slide 1 — "Every Tree Makes a Difference"
 * Slide 2 — "Spot a Location, Report It Instantly"
 * Slide 3 — "Volunteers Bring the Green to Life"
 * Slide 4 — "Join the Green Movement" (dark green, final CTA)
 *
 * Behaviour:
 *  - Swipeable via FlatList (paginated)
 *  - Dot indicators show active slide
 *  - Next button advances slides
 *  - Skip button jumps to last slide (or exits onboarding)
 *  - Final slide: "Get Started" → /(tabs), "Log In" → /(tabs)
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants';
import { Text } from '@/components/common';

const { width, height } = Dimensions.get('window');

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
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  }, [activeIndex]);

  const goToLast = useCallback(() => {
    flatListRef.current?.scrollToIndex({ index: SLIDES.length - 1, animated: true });
  }, []);

  const handleGetStarted = useCallback(() => {
    router.replace('/(auth)/welcome');
  }, []);

  const handleLogin = useCallback(() => {
    router.replace('/(auth)/login');
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(idx);
    },
    [width]
  );

  const isLastSlide = activeIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[activeIndex];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentSlide.darkTheme ? 'light-content' : 'dark-content'}
      />

      <Animated.FlatList
        ref={flatListRef as any}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) =>
          item.darkTheme ? (
            <DarkSlide
              slide={item}
              onGetStarted={handleGetStarted}
              onLogin={handleGetStarted}
              scrollX={scrollX}
              index={SLIDES.indexOf(item)}
              activeIndex={activeIndex}
            />
          ) : (
            <LightSlide
              slide={item}
              activeIndex={activeIndex}
              slideIndex={SLIDES.indexOf(item)}
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
  dark?: boolean;
}> = ({ scrollX, dark = false }) => (
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
              backgroundColor: dark ? Colors.white : Colors.brandPrimary,
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
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

// ─── Light Slide (slides 1-3) ─────────────────────────────────────────────────

const LightSlide: React.FC<{
  slide: OnboardingSlide;
  activeIndex: number;
  slideIndex: number;
  onNext: () => void;
  onSkip: () => void;
  scrollX: Animated.Value;
}> = ({ slide, slideIndex, onNext, onSkip, scrollX }) => (
  <View style={lightStyles.slide}>
    {/* Illustration fills top */}
    <View style={lightStyles.imageContainer}>
      <Image
        source={slide.image}
        style={lightStyles.image}
        resizeMode="cover"
      />
    </View>

    {/* White rounded bottom card */}
    <View style={lightStyles.card}>
      {/* Dots */}
      <DotIndicator scrollX={scrollX} />

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
    </View>
  </View>
);

const lightStyles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    width,
    height: height * 0.48,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -BorderRadius['2xl'],
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
    gap: Spacing[4],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: FontSize['2xl'] * 1.25,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.65,
    textAlign: 'center',
  },
  // Steps
  stepsContainer: {
    gap: Spacing[3],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
  stepIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brandMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: 18,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: FontSize.xs * 1.5,
  },
  // Buttons
  nextBtn: {
    backgroundColor: Colors.brandPrimary,
    height: 56,
    borderRadius: BorderRadius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  nextBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  skipText: {
    fontSize: FontSize.base,
    color: Colors.brandAccent,
    fontWeight: FontWeight.medium,
  },
});

// ─── Dark Slide (slide 4) ─────────────────────────────────────────────────────

const DarkSlide: React.FC<{
  slide: OnboardingSlide;
  onGetStarted: () => void;
  onLogin: () => void;
  scrollX: Animated.Value;
  index: number;
  activeIndex: number;
}> = ({ slide, onGetStarted, onLogin, scrollX }) => (
  <SafeAreaView style={darkStyles.slide} edges={['bottom']}>
    <StatusBar barStyle="light-content" />

    {/* Illustration fills top */}
    <View style={darkStyles.imageContainer}>
      <Image
        source={slide.image}
        style={darkStyles.image}
        resizeMode="cover"
      />
    </View>

    {/* Bottom content */}
    <View style={darkStyles.content}>
      {/* Dots */}
      <DotIndicator scrollX={scrollX} dark />

      {/* Title */}
      <Text style={darkStyles.title}>{slide.title}</Text>

      {/* Description */}
      <Text style={darkStyles.description}>{slide.description}</Text>

      {/* Get Started Button */}
      <TouchableOpacity style={darkStyles.getStartedBtn} onPress={onGetStarted} activeOpacity={0.85}>
        <Text style={darkStyles.getStartedText}>Get Started</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <TouchableOpacity style={darkStyles.loginBtn} onPress={onLogin} activeOpacity={0.8}>
        <Text style={darkStyles.loginText}>Log In</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const darkStyles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    backgroundColor: Colors.brandDark,
  },
  imageContainer: {
    width,
    height: height * 0.46,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[6],
    gap: Spacing[4],
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: FontSize['3xl'] * 1.2,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.brandCream,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
    opacity: 0.9,
  },
  getStartedBtn: {
    width: width - Spacing[6] * 2,
    height: 56,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  getStartedText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.brandDark,
  },
  loginBtn: {
    width: width - Spacing[6] * 2,
    height: 56,
    borderRadius: BorderRadius['3xl'],
    borderWidth: 1.5,
    borderColor: Colors.brandCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.brandDark,
  },
});
