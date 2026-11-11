import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
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
  return `+91*******${digits.slice(-3)}`;
};

export default function CitizenProfileScreen() {
  const { currentUser, logout } = useApp();

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

  const handleInfoAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') return;
    Alert.alert(title, msg);
  };

  const menuRows: Array<{
    id: string;
    icon: IconName;
    label: string;
    rightValue?: string;
    onPress: () => void;
  }> = [
    {
      id: 'addresses',
      icon: 'map-pin',
      label: 'Saved addresses',
      onPress: () =>
        handleInfoAlert('Saved Addresses', `${currentUser.city || 'New Delhi'}, India`),
    },
    {
      id: 'notifications',
      icon: 'bell',
      label: 'Notifications',
      onPress: () => router.push('/pages/notifications' as any),
    },
    {
      id: 'language',
      icon: 'grid',
      label: 'Language',
      rightValue: 'English',
      onPress: () => handleInfoAlert('Language', 'English is currently selected.'),
    },
    {
      id: 'help',
      icon: 'help',
      label: 'Help Center',
      onPress: () => handleInfoAlert('Help Center', 'Contact support@aanandvan.in'),
    },
    {
      id: 'terms',
      icon: 'document',
      label: 'Terms & Privacy',
      onPress: () =>
        handleInfoAlert('Terms & Privacy', 'Protected under Aanandvan Privacy Protocol.'),
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
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name || 'Rahul Sharma'}</Text>
            <Text style={styles.userPhone}>{formatMaskedPhone(currentUser.phone)}</Text>
          </View>
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
    paddingBottom: 40,
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
    marginBottom: 24,
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
  menuList: {
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EC',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B91C1C',
  },
});
