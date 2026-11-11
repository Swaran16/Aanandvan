/**
 * Root Layout — Aanandvan Platform
 * Sets up SafeAreaProvider, AppProvider, and navigation Stack
 */

import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#F5FAF6' },
          }}
        >
          {/* Splash */}
          <Stack.Screen name="splash" options={{ headerShown: false }} />

          {/* Onboarding */}
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />

          {/* Auth */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Role Bottom Tabs Groups */}
          <Stack.Screen name="(citizen)" options={{ headerShown: false }} />
          <Stack.Screen name="(volunteer)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Standalone Sub-Pages & Modal Screens */}
          <Stack.Screen
            name="pages/request-details"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/create-request"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="pages/request-submitted"
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="pages/notifications"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/schedule-plantation"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/collect-saplings"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/upload-activity"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/update-submitted"
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="pages/volunteer-details"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/admin-review-request"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/verify-publish"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/maintenance-thread"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="pages/my-assigned-work"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/admin-reports"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/admin-events"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="pages/admin-settings"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />

          {/* 404 */}
          <Stack.Screen name="+not-found" options={{ title: 'Not Found', headerShown: true }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
