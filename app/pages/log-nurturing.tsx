/**
 * Log Nurturing Update Screen — Aanandvan
 *
 * Dedicated screen for volunteers to upload recurring nurturing logs:
 * - Request banner showing location & trees planted
 * - Photos upload (watering, growth, guard inspection)
 * - Quick action tags: [Watered], [Weeding Done], [Tree Guard Checked], [Compost Added]
 * - Nurturing description / care notes
 * - Appends to continuous one-way thread for Citizen & Admin
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const ACTION_OPTIONS = [
  'Deep Watering (15-20L)',
  'Weeding & Soil Loosened',
  'Tree Guard Inspected & Secured',
  'Organic Mulch Added',
  'Pest Check OK',
];

const SAMPLE_NURTURING_PHOTOS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
];

export default function LogNurturingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { requests, addNurturingUpdate, currentUser } = useApp();

  const req = (id ? requests.find(r => r.id === id) : null) || requests.find(r => r.status === 'completed') || requests[0];

  const [notes, setNotes] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([ACTION_OPTIONS[0]]);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  ]);

  const toggleAction = (act: string) => {
    setSelectedActions(prev =>
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  const handleAddPhoto = () => {
    const next = SAMPLE_NURTURING_PHOTOS[photos.length % SAMPLE_NURTURING_PHOTOS.length];
    setPhotos(prev => [...prev, next]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!req) {
      Alert.alert('No Request', 'Please select a request first.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Photo Needed', 'Please take or upload at least one photo showing the tree and care taken.');
      return;
    }

    const todayDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    addNurturingUpdate(req.id, {
      date: `Today (${todayDate})`,
      photos,
      notes: notes.trim() || 'Tree inspected, watered thoroughly, and tree guard verified in stable condition.',
      volunteerName: currentUser.name || 'Vaibhav Shirke',
      volunteerId: currentUser.id || 'VOL-DAD-0104',
      actionsTaken: selectedActions,
    });

    router.replace({
      pathname: '/pages/request-details',
      params: { id: req.id },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Log Nurturing Update</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Request Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryReqId}>#{req?.id?.toUpperCase()}</Text>
          <Text style={styles.summaryTitle}>{req?.title}</Text>
          <View style={styles.locationRow}>
            <Icon name="map-pin" size={13} color="#0B3B24" />
            <Text style={styles.locationText}>{req?.location}</Text>
          </View>
        </View>

        {/* Nurturing Care Photos */}
        <Text style={styles.sectionTitle}>Nurturing & Care Photos</Text>
        <Text style={styles.sectionSubtitle}>
          Upload photos of watering, weeding, or sapling health check.
        </Text>

        <View style={styles.photoSlotsContainer}>
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoWrap}>
              <Image source={{ uri }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={() => handleRemovePhoto(idx)}
              >
                <Icon name="close" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 3 && (
            <TouchableOpacity style={styles.dashedSlot} onPress={handleAddPhoto}>
              <Icon name="camera" size={22} color="#0B3B24" />
              <Text style={styles.dashedSlotLabel}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Action Chips */}
        <Text style={styles.sectionTitle}>Actions Completed Today</Text>
        <View style={styles.chipsRow}>
          {ACTION_OPTIONS.map(action => {
            const isSelected = selectedActions.includes(action);
            return (
              <TouchableOpacity
                key={action}
                style={[styles.chip, isSelected && styles.chipActive]}
                activeOpacity={0.8}
                onPress={() => toggleAction(action)}
              >
                <Icon
                  name={isSelected ? 'check-circle' : 'plus'}
                  size={14}
                  color={isSelected ? '#FFFFFF' : '#0B3B24'}
                />
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {action}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notes Textarea */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Care Notes & Observation</Text>
        <TextInput
          style={styles.notesTextarea}
          value={notes}
          onChangeText={setNotes}
          placeholder="E.g. Sapling shows fresh green foliage. Watered thoroughly with 20 liters. Guard is firm..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Visibility Info */}
        <View style={styles.infoBox}>
          <Icon name="info" size={16} color="#0B3B24" />
          <Text style={styles.infoText}>
            This update will be posted to the continuous timeline. Kartik Vichare (Citizen) and Aanandvan Admin will receive an instant notification.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.88}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Post Nurturing Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFBF9',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 48,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  summaryReqId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  photoSlotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  photoWrap: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedSlot: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedSlotLabel: {
    fontSize: 10,
    color: '#163E2B',
    fontWeight: '600',
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#163E2B',
    borderColor: '#163E2B',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  notesTextarea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    minHeight: 80,
    marginTop: 8,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },
  submitBtn: {
    height: 44,
    backgroundColor: '#163E2B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
