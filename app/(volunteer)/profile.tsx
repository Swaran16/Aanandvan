import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const formatMaskedPhone = (phone?: string) => {
  if (!phone) return '+91*******425';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '+91*******425';
  const lastThree = digits.slice(-3);
  return `+91*******${lastThree}`;
};

export default function VolunteerProfileScreen() {
  const { currentUser, requests, maintenanceItems, logout } = useApp();
  const [isAvailable, setIsAvailable] = useState(true);

  const completedCount = currentUser.treesCount ?? 25;
  const assignedCount = requests.filter(
    (r) => r.status === 'assigned' || r.status === 'scheduled' || r.status === 'in_progress'
  ).length;
  const careDueCount = maintenanceItems.filter(
    (m) => m.status === 'needs_water' || m.status === 'pruning_needed' || m.isUrgent
  ).length;

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();
      router.replace('/(auth)/login' as any);
      return;
    }

    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  const handleMenuPress = (label: string) => {
    if (Platform.OS === 'web') return;
    Alert.alert(label, `${label} settings will be available soon.`);
  };

  const menuRows: Array<{
    id: string;
    icon: IconName;
    label: string;
    rightValue?: string;
    onPress: () => void;
  }> = [
    {
      id: 'edit',
      icon: 'profile',
      label: 'Edit profile',
      onPress: () => handleMenuPress('Edit profile'),
    },
    {
      id: 'service',
      icon: 'map-pin',
      label: 'Service area',
      rightValue: 'Within 5 km',
      onPress: () => handleMenuPress('Service area'),
    },
    {
      id: 'certs',
      icon: 'bookmark',
      label: 'Certificates',
      onPress: () => handleMenuPress('Certificates'),
    },
    {
      id: 'notifs',
      icon: 'bell',
      label: 'Notifications',
      onPress: () => handleMenuPress('Notifications'),
    },
    {
      id: 'help',
      icon: 'help',
      label: 'Help Centre',
      onPress: () => handleMenuPress('Help Centre'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.userRow}>
          <Image
            source={{
              uri:
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name || 'Amit Kumar'}</Text>
            <Text style={styles.userPhone}>{formatMaskedPhone(currentUser.phone)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#DFE7EE' }]}>
            <Text style={styles.statValue}>{String(completedCount).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#D6E4D8' }]}>
            <Text style={styles.statValue}>{String(assignedCount).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#EEF5B2' }]}>
            <Text style={styles.statValue}>{String(careDueCount).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Care due</Text>
          </View>
        </View>

        <View style={styles.availabilityBox}>
          <Text style={styles.availabilityText}>Available for new requests</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#D1D5DB', true: '#0D4E2B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.menuList}>
          {menuRows.map((row) => (
            <TouchableOpacity
              key={row.id}
              style={styles.menuRow}
              onPress={row.onPress}
              activeOpacity={0.75}
            >
              <View style={styles.menuLeft}>
                <Icon name={row.icon} size={18} color="#2B3E33" />
                <Text style={styles.menuLabel}>{row.label}</Text>
              </View>

              <View style={styles.menuRight}>
                {row.rightValue ? (
                  <Text style={styles.menuRightValue}>{row.rightValue}</Text>
                ) : null}
                <Icon name="chevron-right" size={18} color="#5F6C64" />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogout}
            activeOpacity={0.75}
          >
            <Icon name="logout" size={18} color="#B91C1C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#0D4325',
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5EAE3',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#163020',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13.5,
    color: '#5F6C64',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3E22',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#4F5C54',
  },
  availabilityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  availabilityText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#163020',
  },
  menuList: {
    marginTop: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EC',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#163020',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuRightValue: {
    fontSize: 13,
    color: '#6E7B73',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B91C1C',
  },
});
