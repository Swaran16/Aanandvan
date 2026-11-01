/**
 * Volunteer Tab Navigator Layout — Aanandvan
 *
 * Bottom tabs for verified volunteers:
 *   Explore  — Browse available requests
 *   Plant    — Start/manage planting tasks
 *   Events   — View & join events
 *   Profile  — Volunteer profile & stats
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants';

// ─── Tab Icons (inline) ──────────────────────────────────────────────────────

const ExploreIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={iconStyles.wrap}>
    <View style={[iconStyles.compassOuter, { borderColor: color }]}>
      <View style={[iconStyles.compassInner, { borderColor: color }]} />
    </View>
  </View>
);

const PlantIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={iconStyles.wrap}>
    <View style={[iconStyles.plusCircle, { borderColor: color }]}>
      <View style={[iconStyles.plusH, { backgroundColor: color }]} />
      <View style={[iconStyles.plusV, { backgroundColor: color }]} />
    </View>
  </View>
);

const EventsIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={iconStyles.wrap}>
    <View style={[iconStyles.calBox, { borderColor: color }]}>
      <View style={[iconStyles.calLine, { backgroundColor: color }]} />
    </View>
  </View>
);

const ProfileIcon: React.FC<{ color: string }> = ({ color }) => (
  <View style={iconStyles.profileWrap}>
    <View style={[iconStyles.profileHead, { borderColor: color, backgroundColor: color + '22' }]} />
    <View style={[iconStyles.profileBody, { borderColor: color }]} />
  </View>
);

const iconStyles = StyleSheet.create({
  wrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  compassOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  compassInner: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  plusCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  plusH: { position: 'absolute', width: 10, height: 2, borderRadius: 1 },
  plusV: { position: 'absolute', width: 2, height: 10, borderRadius: 1 },
  calBox: { width: 18, height: 18, borderWidth: 2, borderRadius: 3, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 3 },
  calLine: { width: 10, height: 2, borderRadius: 1 },
  profileWrap: { width: 24, height: 24, alignItems: 'center', gap: 2 },
  profileHead: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },
  profileBody: { width: 20, height: 10, borderRadius: 10, borderWidth: 1.5 },
});

// ─── Tab Layout ──────────────────────────────────────────────────────────────

export default function VolunteerTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandPrimary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <ExploreIcon color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="plant"
        options={{
          title: 'Plant',
          tabBarIcon: ({ color }) => <PlantIcon color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <EventsIcon color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color as string} />,
        }}
      />
    </Tabs>
  );
}
