/**
 * Volunteer Tab Navigator Layout
 * Matches new Volunteer Design 4 bottom navigation:
 * - Home (`index`)
 * - Requests (`available`)
 * - Center Circular `+` CTA (Upload Activity / Update)
 * - Alerts (`work`)
 * - Profile (`profile`)
 */

import React from 'react';
import { Tabs, router, usePathname } from 'expo-router';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';

const VISIBLE_TABS: Array<{ name: string; label: string; icon: IconName }> = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'available', label: 'Requests', icon: 'plant' },
  { name: 'work', label: 'Alerts', icon: 'bell' },
  { name: 'profile', label: 'Profile', icon: 'profile' },
];

function VolunteerTabBar(props: any) {
  const pathname = usePathname();
  const state = props?.state;
  const activeRouteName =
    state?.routes?.[state?.index]?.name ||
    (pathname.includes('/available')
      ? 'available'
      : pathname.includes('/work')
      ? 'work'
      : pathname.includes('/profile')
      ? 'profile'
      : 'index');

  const renderTab = (tab: { name: string; label: string; icon: IconName }) => {
    const isFocused = activeRouteName === tab.name;
    const color = isFocused ? '#0A4D2E' : '#4B5563';

    const onPress = () => {
      if (tab.name === 'index') {
        router.replace('/(volunteer)' as any);
      } else {
        router.replace(`/(volunteer)/${tab.name}` as any);
      }
    };

    return (
      <TouchableOpacity
        key={tab.name}
        style={styles.tabItem}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <Icon name={tab.icon} size={20} color={color} />
        <Text style={[styles.tabLabel, { color, fontWeight: isFocused ? '700' : '500' }]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.tabBarSafe}>
      <View style={styles.tabBarRow}>
        {renderTab(VISIBLE_TABS[0])}
        {renderTab(VISIBLE_TABS[1])}

        {/* Center Floating + Action Button */}
        <View style={styles.centerSlot}>
          <TouchableOpacity
            style={styles.centerFab}
            activeOpacity={0.85}
            onPress={() => router.push('/pages/select-update-request' as any)}
          >
            <Icon name="plus" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {renderTab(VISIBLE_TABS[2])}
        {renderTab(VISIBLE_TABS[3])}
      </View>
    </SafeAreaView>
  );
}

export default function VolunteerLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <VolunteerTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="available" options={{ title: 'Requests' }} />
      <Tabs.Screen name="work" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFE9',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 58 : 62,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
  centerSlot: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#0A4D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
