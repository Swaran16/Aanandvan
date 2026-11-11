import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function UpdateSubmittedScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { currentUser, requests } = useApp();

  const resolvedId = id || requests[0]?.id || 'REQ-2024-0042';
  const formattedId = `#${resolvedId.toUpperCase()}`;
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Volunteer';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <View style={styles.iconInnerRing}>
            <Icon name="check" size={18} color="#0D4E2B" />
          </View>
        </View>

        <Text style={styles.title}>Update submitted</Text>

        <View style={styles.reqPill}>
          <Text style={styles.reqPillText}>{formattedId}</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Pending review</Text>
        </View>

        <Text style={styles.subtitle}>
          Thank you {firstName}. The team will review your photos. Once approved, the request is
          marked completed and the citizen is notified.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push({
              pathname: '/pages/request-details',
              params: { id: resolvedId },
            } as any)
          }
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>View request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(volunteer)' as any)}
          activeOpacity={0.75}
        >
          <Text style={styles.secondaryBtnText}>Back to home</Text>
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#CCF2DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconInnerRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D4E2B',
    marginBottom: 12,
  },
  reqPill: {
    backgroundColor: '#CCF2DB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  reqPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  statusPill: {
    backgroundColor: '#FBF0C4',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  statusPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#92580A',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5F6C64',
    textAlign: 'center',
    maxWidth: 310,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

