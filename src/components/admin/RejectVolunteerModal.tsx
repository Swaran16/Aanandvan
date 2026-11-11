import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

interface RejectVolunteerModalProps {
  visible: boolean;
  applicantName: string;
  onConfirmReject: (reason: string, message: string) => void;
  onClose: () => void;
}

const REASONS = [
  'Address could not be verified',
  'ID proof unclear',
  'Details incomplete',
  'Other',
];

export const RejectVolunteerModal: React.FC<RejectVolunteerModalProps> = ({
  visible,
  applicantName,
  onConfirmReject,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REASONS[0]);
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    onConfirmReject(selectedReason, message.trim());
    setMessage('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Reject this application?</Text>
          <Text style={styles.subtitle}>
            {applicantName} will see the reason you choose and can apply again.
          </Text>

          <View style={styles.reasonsWrap}>
            {REASONS.map((reason) => {
              const active = selectedReason === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  style={[styles.reasonPill, active && styles.reasonPillActive]}
                  onPress={() => setSelectedReason(reason)}
                  activeOpacity={0.8}
                >
                  {active && <Icon name="check" size={13} color="#FFFFFF" />}
                  <Text
                    style={[styles.reasonText, active && styles.reasonTextActive]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Message to applicant (Optional)</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Start typing here..."
            placeholderTextColor="#8B968F"
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.rejectBtnText}>Reject application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E5E2',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#37473D',
    marginBottom: 16,
  },
  reasonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6DDD4',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  reasonPillActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  reasonText: {
    fontSize: 13,
    color: '#37473D',
    fontWeight: '500',
  },
  reasonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#163020',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DCE2DA',
    borderRadius: 12,
    padding: 14,
    minHeight: 88,
    fontSize: 13.5,
    color: '#163020',
    marginBottom: 18,
  },
  rejectBtn: {
    height: 46,
    borderRadius: 999,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rejectBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelBtn: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

