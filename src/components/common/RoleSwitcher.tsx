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
    userSample: 'Kartik Vichare',
    description: 'Request plantations, track trees, and view watering updates',
    icon: 'profile',
    badgeColor: '#163E2B',
    badgeBg: '#E8EFEA',
    route: '/(citizen)',
  },
  {
    role: 'volunteer',
    title: 'Volunteer',
    userSample: 'Vaibhav Shirke',
    description: 'Accept requests, schedule drives, and upload plantation photos',
    icon: 'plant',
    badgeColor: '#166534',
    badgeBg: '#F0FDF4',
    route: '/(volunteer)',
  },
  {
    role: 'admin',
    title: 'Admin',
    userSample: 'Suresh Patil (Admin)',
    description: 'Verify requests, review applications, and manage platform analytics',
    icon: 'shield',
    badgeColor: '#1E3A8A',
    badgeBg: '#EFF6FF',
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
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  triggerBtnLight: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  triggerBtnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  triggerTextLight: {
    color: '#111827',
  },
  triggerTextDark: {
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  handleBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
  },
  optionCardActive: {
    backgroundColor: '#F9FAFB',
    borderColor: '#163E2B',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  optionUserSample: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  optionDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#163E2B',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#163E2B',
  },
});

