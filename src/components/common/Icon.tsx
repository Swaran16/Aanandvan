/**
 * Unified Vector Icon Component — Feather Design System
 * Crisp, consistent stroke width (1.8-2px) across all icons with zero unicode emoji variation.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export type IconName =
  | 'home'
  | 'requests'
  | 'profile'
  | 'explore'
  | 'plant'
  | 'work'
  | 'overview'
  | 'volunteers'
  | 'bell'
  | 'search'
  | 'plus'
  | 'minus'
  | 'check'
  | 'check-circle'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'chevron-up'
  | 'arrow-right'
  | 'tree'
  | 'map-pin'
  | 'calendar'
  | 'clock'
  | 'water'
  | 'camera'
  | 'sun'
  | 'bookmark'
  | 'refresh'
  | 'upload'
  | 'share'
  | 'mail'
  | 'phone'
  | 'shield'
  | 'lock'
  | 'help'
  | 'logout'
  | 'settings'
  | 'filter'
  | 'navigation'
  | 'info'
  | 'alert'
  | 'alert-triangle'
  | 'document'
  | 'inbox'
  | 'users'
  | 'grid'
  | 'building'
  | 'message'
  | 'edit';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const FEATHER_MAP: Record<IconName, keyof typeof Feather.glyphMap> = {
  home: 'home',
  requests: 'clipboard',
  profile: 'user',
  explore: 'compass',
  plant: 'feather',
  work: 'calendar',
  overview: 'bar-chart-2',
  volunteers: 'users',
  bell: 'bell',
  search: 'search',
  plus: 'plus',
  minus: 'minus',
  check: 'check',
  'check-circle': 'check-circle',
  close: 'x',
  'chevron-right': 'chevron-right',
  'chevron-left': 'chevron-left',
  'chevron-down': 'chevron-down',
  'chevron-up': 'chevron-up',
  'arrow-right': 'arrow-right',
  tree: 'feather',
  'map-pin': 'map-pin',
  calendar: 'calendar',
  clock: 'clock',
  water: 'droplet',
  camera: 'camera',
  sun: 'sun',
  bookmark: 'bookmark',
  refresh: 'refresh-cw',
  upload: 'upload-cloud',
  share: 'share-2',
  mail: 'mail',
  phone: 'phone',
  shield: 'shield',
  lock: 'lock',
  help: 'help-circle',
  logout: 'log-out',
  settings: 'settings',
  filter: 'filter',
  navigation: 'navigation',
  info: 'info',
  alert: 'alert-triangle',
  'alert-triangle': 'alert-triangle',
  document: 'file-text',
  inbox: 'inbox',
  users: 'users',
  grid: 'grid',
  building: 'layers',
  message: 'message-square',
  edit: 'edit-2',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#163E2B',
  style,
}) => {
  const featherName = FEATHER_MAP[name] || 'circle';

  return (
    <View style={[styles.container, style]}>
      <Feather name={featherName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
