/**
 * Tab Navigator Layout — Aanandvan
 *
 * Defines the bottom tab bar with Aanandvan brand colors.
 * Add or remove tabs here as the app grows.
 *
 * Screens:
 *   index.tsx   → 🏠 Home
 *   explore.tsx → 🔍 Explore
 *   profile.tsx → 👤 Profile
 */

import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, FontSize } from '@/constants';

// ─── Inline Tab Icons (replace with @expo/vector-icons once added) ─────────────

const HomeIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={[tabIconStyles.base, { borderColor: color }]}>
    <View style={[tabIconStyles.roofLeft, { borderBottomColor: color }]} />
    <View style={[tabIconStyles.roofRight, { borderBottomColor: color }]} />
    <View style={[tabIconStyles.door, { backgroundColor: color }]} />
  </View>
);

const ExploreIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={tabIconStyles.circle}>
    <View style={[tabIconStyles.circleOuter, { borderColor: color }]}>
      <View style={[tabIconStyles.circleInner, { borderColor: color }]} />
    </View>
  </View>
);

const ProfileIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={tabIconStyles.profileWrap}>
    <View style={[tabIconStyles.profileHead, { borderColor: color, backgroundColor: color + '22' }]} />
    <View style={[tabIconStyles.profileBody, { borderColor: color }]} />
  </View>
);

import React from 'react';

const tabIconStyles = StyleSheet.create({
  base: { width: 24, height: 20, position: 'relative', alignItems: 'center' },
  roofLeft: {
    position: 'absolute', top: 0, left: 0,
    width: 0, height: 0,
    borderLeftWidth: 12, borderRightWidth: 0,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  roofRight: {
    position: 'absolute', top: 0, right: 0,
    width: 0, height: 0,
    borderRightWidth: 12, borderLeftWidth: 0,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  door: { position: 'absolute', bottom: 0, width: 8, height: 9, borderRadius: 1 },
  circle: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  circleOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  circleInner: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  profileWrap: { width: 24, height: 24, alignItems: 'center', gap: 2 },
  profileHead: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  profileBody: { width: 20, height: 10, borderRadius: 10, borderWidth: 1.5 },
});

// ─── Tab Layout ───────────────────────────────────────────────────────────────

const RequestsIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18 }}>🪴</Text>
  </View>
);

const NurseriesIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18 }}>⛲</Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F3821',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? '#A7F3D0' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: 'Requests',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? '#A7F3D0' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RequestsIcon color="" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="nursery"
        options={{
          title: 'Nurseries',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? '#A7F3D0' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NurseriesIcon color="" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 48,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? '#A7F3D0' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>👤</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
