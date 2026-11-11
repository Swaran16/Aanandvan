import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

const NEXT_STEPS = [
  'Our team verifies your photos and location',
  'A verified volunteer accepts and plants the saplings.',
  'You get photo updates as the trees are cared for.',
];

export default function RequestSubmittedScreen() {
  const { id, city } = useLocalSearchParams<{ id?: string; city?: string }>();
  const resolvedId = id || 'REQ-2024-0042';
  const formattedId = `#${resolvedId.toUpperCase()}`;
  const resolvedCity = city || 'Mumbai';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.topCenter}>
          <View style={styles.checkCircle}>
            <Icon name="check" size={24} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>Request submitted</Text>

          <View style={styles.idPill}>
            <Text style={styles.idPillText}>{formattedId}</Text>
          </View>

          <Text style={styles.subtitle}>
            Thank you for helping {resolvedCity} get greener.
          </Text>
        </View>

        <View style={styles.stepsSection}>
          <Text style={styles.stepsHeading}>What happens next</Text>

          <View style={styles.stepsList}>
            {NEXT_STEPS.map((stepText, index) => (
              <View key={`step-${index}`} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{stepText}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() =>
            router.push({
              pathname: '/pages/request-details',
              params: { id: resolvedId },
            } as any)
          }
          activeOpacity={0.85}
        >
          <Text style={styles.trackBtnText}>Track request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(citizen)' as any)}
          activeOpacity={0.75}
        >
          <Text style={styles.homeBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  topCenter: {
    alignItems: 'center',
    marginBottom: 30,
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D4E2B',
    marginBottom: 10,
  },
  idPill: {
    backgroundColor: '#CCF2DB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  idPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  subtitle: {
    fontSize: 13,
    color: '#5F6C64',
    textAlign: 'center',
  },
  stepsSection: {
    width: '100%',
  },
  stepsHeading: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0D4E2B',
    marginBottom: 16,
  },
  stepsList: {
    gap: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#163020',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  trackBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

