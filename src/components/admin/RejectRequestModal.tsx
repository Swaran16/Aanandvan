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

interface RejectRequestModalProps {
  visible: boolean;
  requestTitle: string;
  citizenName: string;
  onConfirmReject: (reason: string, message: string) => void;
  onClose: () => void;
}

const REASONS = [
  'Location could not be verified',
  'Area photos unclear / inadequate',
  'Private property / No planting permission',
  'Duplicate or overlapping request',
  'Other',
];

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
  visible,
  requestTitle,
  citizenName,
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

          <Text style={styles.title}>Reject this request?</Text>
          <Text style={styles.subtitle}>
            {citizenName || 'The citizen'} will see the reason you choose and can update their submission.
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

          <Text style={styles.fieldLabel}>Message to citizen (Optional)</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Explain why this request was rejected or what is needed..."
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
            <Text style={styles.rejectBtnText}>Reject request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B91C1C',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 19,
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
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  reasonPillActive: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  reasonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  reasonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#163020',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    fontSize: 13.5,
    color: '#111827',
    backgroundColor: '#FAFBF9',
    marginBottom: 18,
  },
  rejectBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  rejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D4E2B',
  },
});

