/**
 * Root Layout — Expo Router Entry Point
 *
 * Wraps all screens. Defines the Stack navigator with:
 *  - splash      → first screen (auto-navigates to onboarding)
 *  - onboarding  → 4-slide onboarding flow
 *  - (auth)      → role selection, register, login, OTP
 *  - (tabs)      → citizen tab navigator (home)
 *  - (volunteer) → volunteer tab navigator (dashboard)
 *
 * Flow: splash → onboarding → role-select → (tabs) or (volunteer)
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

        {/* Auth flow — role selection, register, login, OTP */}
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />

        {/* Main app — citizen tab navigator */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, animation: 'fade', gestureEnabled: false }}
        />

        {/* Volunteer app — volunteer tab navigator */}
        <Stack.Screen
          name="(volunteer)"
          options={{ headerShown: false, animation: 'fade', gestureEnabled: false }}
        />

        {/* Volunteer detail screens — standalone stack screens */}
        <Stack.Screen
          name="available-requests"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="assignment-details"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="upload-update"
          options={{ headerShown: false, animation: 'slide_from_right' }}
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
