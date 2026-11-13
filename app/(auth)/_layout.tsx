/**
 * Auth Stack Layout
 * Wraps all authentication screens (Welcome, Login, Register, OTP).
 * No tab bar — clean stack navigation.
 */

import { Stack } from 'expo-router';
import { Colors } from '@/constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome"     options={{ animation: 'fade' }} />
      <Stack.Screen name="login"       options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="role-select" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="register"               options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="admin-login"            options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="otp"                    options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="volunteer-verification" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
