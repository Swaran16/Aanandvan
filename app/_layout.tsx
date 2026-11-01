/**
 * Root Layout — Expo Router Entry Point
 *
 * Wraps all screens. Defines the Stack navigator with:
 *  - splash     → first screen (auto-navigates to onboarding)
 *  - onboarding → 4-slide onboarding flow
 *  - (tabs)     → main app tab navigator
 *
 * Providers (SafeAreaProvider) are set up here so every
 * child screen has access to safe area insets.
 */

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        {/* Splash — shown on cold launch */}
        <Stack.Screen
          name="splash"
          options={{ headerShown: false, animation: 'none' }}
        />

        {/* Onboarding — 4-slide introduction */}
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, animation: 'fade', gestureEnabled: false }}
        />

        {/* Main app — tab navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: 'fade', gestureEnabled: false }}
        />

        {/* 404 fallback */}
        <Stack.Screen
          name="+not-found"
          options={{ title: 'Not Found', headerShown: true }}
        />

      </Stack>
    </SafeAreaProvider>
  );
}
