/**
 * Root Index — Initial Route Handler
 *
 * Expo Router requires a file at app/index.tsx for the root path.
 * This redirects immediately to the splash screen on every cold launch.
 *
 * In a real app, check AsyncStorage here:
 *   - First launch → /splash → /onboarding
 *   - Returning user → /(tabs) directly
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/splash" />;
}
