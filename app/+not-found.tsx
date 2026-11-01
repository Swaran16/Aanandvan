/**
 * 404 - Not Found Screen
 * Shown when navigating to a non-existent route.
 */

import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { Colors, Spacing } from '@/constants';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant="h1">404</Text>
        <Text variant="h3">Page Not Found</Text>
        <Text variant="body1" color={Colors.textSecondary} align="center">
          The screen you're looking for doesn't exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text variant="label" color={Colors.brandPrimary}>
            ← Go back home
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.background,
  },
  link: {
    marginTop: Spacing[4],
  },
});
