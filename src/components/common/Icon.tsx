import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

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
  | 'document'
  | 'inbox'
  | 'users'
  | 'grid'
  | 'building'
  | 'message';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const GLYPHS: Record<IconName, string> = {
  home: '⌂',
  requests: '📋',
  profile: '👤',
  explore: '🌲',
  plant: '🌱',
  work: '📅',
  overview: '📊',
  volunteers: '👥',
  bell: '🔔',
  search: '🔍',
  plus: '+',
  minus: '−',
  check: '✓',
  'check-circle': '✔',
  close: '✕',
  'chevron-right': '›',
  'chevron-left': '‹',
  'chevron-down': '⌄',
  'chevron-up': '⌃',
  'arrow-right': '→',
  tree: '🌲',
  'map-pin': '📍',
  calendar: '📅',
  clock: '⏱',
  water: '💧',
  camera: '📷',
  sun: '☀',
  bookmark: '🔖',
  refresh: '↻',
  upload: '☁',
  share: '↗',
  mail: '✉',
  phone: '📞',
  shield: '🛡',
  lock: '🔒',
  help: '❓',
  logout: '↳',
  settings: '⚙',
  filter: '⑂',
  navigation: '⤹',
  info: 'ℹ',
  alert: '⚠',
  document: '📄',
  inbox: '📥',
  users: '👥',
  grid: '⊞',
  building: '🏛',
  message: '💬',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#1B4332',
  style,
}) => {
  const glyph = GLYPHS[name] || '•';

  return (
    <View
      style={[
        styles.container,
        { width: size + 4, height: size + 4 },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            color,
            lineHeight: size + 2,
          },
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

