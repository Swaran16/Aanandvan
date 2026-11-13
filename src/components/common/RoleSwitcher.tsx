/**
 * RoleSwitcher Component — Aanandvan
 * 
 * Provides a compact header/navbar button that opens a modal
 * allowing instant switching between Citizen, Volunteer, and Admin roles.
 */

import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon, IconName } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

interface RoleOption {
  role: UserRole;
  title: string;
  userSample: string;
  description: string;
  icon: IconName;
  badgeColor: string;
  badgeBg: string;
  route: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'citizen',
    title: 'Citizen',
    userSample: 'Rahul Sharma',
    description: 'Request plantations, track trees, and view watering updates',
    icon: 'profile',
    badgeColor: '#0B3B24',
    badgeBg: '#D1FAE5',
    route: '/(citizen)',
  },
  {
    role: 'volunteer',
    title: 'Volunteer',
    userSample: 'Amit Kumar',
    description: 'Accept requests, schedule drives, and upload plantation photos',
    icon: 'plant',
    badgeColor: '#166534',
    badgeBg: '#DCFCE7',
    route: '/(volunteer)',
  },
  {
    role: 'admin',
    title: 'Admin',
    userSample: 'Aanandvan Admin',
    description: 'Verify requests, review applications, and manage platform analytics',
    icon: 'shield',
    badgeColor: '#1E3A8A',
    badgeBg: '#DBEAFE',
    route: '/(admin)',
  },
];

interface RoleSwitcherProps {
  theme?: 'light' | 'dark';
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ theme = 'light' }) => {
  const { currentRole, loginAs } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const currentOption =
    ROLE_OPTIONS.find((opt) => opt.role === currentRole) ?? ROLE_OPTIONS[0];

  const handleSelectRole = (option: RoleOption) => {
    setModalVisible(false);
    if (option.role !== currentRole) {
      loginAs(option.role);
      router.replace(option.route as any);
    }
  };

  const isDarkNavbar = theme === 'dark';

  return (
    <>
      {/* Small Compact Button on Navbar */}
      <TouchableOpacity
        style={[
          styles.triggerBtn,
          isDarkNavbar ? styles.triggerBtnDark : styles.triggerBtnLight,
        ]}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Icon
          name="refresh"
          size={12}
          color={isDarkNavbar ? '#FFFFFF' : '#0B3B24'}
        />
        <Text
          style={[
            styles.triggerText,
            isDarkNavbar ? styles.triggerTextDark : styles.triggerTextLight,
          ]}
        >
          {currentOption.title}
        </Text>
        <Icon
          name="chevron-down"
          size={11}
          color={isDarkNavbar ? 'rgba(255,255,255,0.7)' : '#6B7280'}
        />
      </TouchableOpacity>

      {/* Role Selection Modal Sheet */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                <SafeAreaView edges={['bottom']}>
                  {/* Sheet Handle */}
                  <View style={styles.handleBar} />

                  {/* Header Row */}
                  <View style={styles.sheetHeader}>
                    <View>
                      <Text style={styles.sheetTitle}>Switch Role</Text>
                      <Text style={styles.sheetSubtitle}>
                        Switch instantly to experience different app views
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => setModalVisible(false)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon name="close" size={16} color="#4B5563" />
                    </TouchableOpacity>
                  </View>

                  {/* Options List */}
                  <View style={styles.optionsList}>
                    {ROLE_OPTIONS.map((option) => {
                      const isActive = option.role === currentRole;

                      return (
                        <TouchableOpacity
                          key={option.role}
                          style={[
                            styles.optionCard,
                            isActive && styles.optionCardActive,
                          ]}
                          activeOpacity={0.85}
                          onPress={() => handleSelectRole(option)}
                        >
                          <View
                            style={[
                              styles.iconBox,
                              { backgroundColor: option.badgeBg },
                            ]}
                          >
                            <Icon
                              name={option.icon}
                              size={20}
                              color={option.badgeColor}
                            />
                          </View>

                          <View style={styles.optionDetails}>
                            <View style={styles.optionTopRow}>
                              <Text style={styles.optionTitle}>
                                {option.title}
                              </Text>
                              <Text style={styles.optionUserSample}>
                                ({option.userSample})
                              </Text>
                            </View>
                            <Text style={styles.optionDesc} numberOfLines={2}>
                              {option.description}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.radioCircle,
                              isActive && styles.radioCircleActive,
                            ]}
                          >
                            {isActive && <View style={styles.radioDot} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: 16,
  },
  triggerBtnLight: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  triggerBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  triggerTextLight: {
    color: '#0B3B24',
  },
  triggerTextDark: {
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 12,
  },
  optionCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDetails: {
    flex: 1,
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  optionUserSample: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#16A34A',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },
});

