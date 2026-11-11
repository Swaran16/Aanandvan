/**
 * Accept Request Bottom Sheet Modal — Aanandvan (Volunteer Page 3)
 * Matches Design 3:
 * - Dimmed backdrop
 * - Rounded white bottom sheet with handle bar
 * - "Accept this request?" + request title & location
 * - 3 numbered steps (1: Pick date & time, 2: Collect sapling from nursery, 3: Plant, upload photos & look after)
 * - Ownership disclaimer text
 * - "Accept & schedule" dark green pill CTA + "Not now" text link
 */

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';

interface AcceptRequestModalProps {
  visible: boolean;
  requestTitle: string;
  requestLocation: string;
  onAcceptAndSchedule: () => void;
  onClose: () => void;
}

const STEPS = [
  'Pick a date and time to plant.',
  'Collect a sample from partnered nursery.',
  'Plant, upload photos and then look after them.',
];

export const AcceptRequestModal: React.FC<AcceptRequestModalProps> = ({
  visible,
  requestTitle,
  requestLocation,
  onAcceptAndSchedule,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <SafeAreaView edges={['bottom']}>
                {/* Drag Handle */}
                <View style={styles.handle} />

                {/* Heading */}
                <Text style={styles.title}>Accept this request?</Text>
                <Text style={styles.subtitle}>
                  {requestTitle}, {requestLocation}
                </Text>

                {/* 3 Numbered Steps */}
                <View style={styles.stepsList}>
                  {STEPS.map((label, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepNum}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{label}</Text>
                    </View>
                  ))}
                </View>

                {/* Ownership Notice */}
                <Text style={styles.notice}>
                  Once accepted, the request is yours and other volunteers will no longer see it.
                </Text>

                {/* Accept & Schedule Button */}
                <TouchableOpacity
                  style={styles.acceptBtn}
                  activeOpacity={0.88}
                  onPress={onAcceptAndSchedule}
                >
                  <Text style={styles.acceptBtnText}>Accept & schedule</Text>
                </TouchableOpacity>

                {/* Not now Link */}
                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.75}
                  onPress={onClose}
                >
                  <Text style={styles.cancelBtnText}>Not now</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 38, 24, 0.38)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B3B24',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#374151',
    marginBottom: 20,
  },
  stepsList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    lineHeight: 19,
  },
  notice: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
    marginTop: 18,
    marginBottom: 18,
  },
  acceptBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A4D2E',
  },
});

