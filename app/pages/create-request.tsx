/**
 * Citizen Create Plantation Request Screen
 * Photo upload slots, location, coordinates, and description
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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

export default function CreateRequestScreen() {
  const { createRequest } = useApp();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [coordinates, setCoordinates] = useState('28.6139° N, 77.2090° E');
  const [description, setDescription] = useState('');
  const [areaPhotos, setAreaPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&auto=format&fit=crop&q=80',
  ]);
  const [landmarkPhotos, setLandmarkPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80',
  ]);

  const handleSubmit = () => {
    if (!title.trim() || !address.trim()) {
      Alert.alert('Required Fields', 'Please enter a title and location for the request.');
      return;
    }

    createRequest({
      title,
      manualAddress: address,
      location: address.split(',')[0] || address,
      landmark,
      coordinates,
      description: description || 'Community requested green canopy plantation.',
      areaPhotos,
      landmarkPhotos,
    });

    Alert.alert(
      'Request Submitted 🎉',
      'Your plantation request is now pending admin verification. Once verified, local volunteers will be able to accept and schedule it!',
      [
        {
          text: 'View Requests',
          onPress: () => router.replace('/(citizen)/requests' as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>New Plantation Request</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Plantation Initiative Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Neem Plantation Drive"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Area Photographs */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="camera" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Area Photographs</Text>
          </View>
          <Text style={styles.helperText}>
            Upload photos of the ground or vacant area intended for planting.
          </Text>

          <View style={styles.photosGrid}>
            {areaPhotos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.photoThumb} />
            ))}
            <TouchableOpacity
              style={styles.addPhotoSlot}
              onPress={() => alert('Photo picker opened')}
            >
              <Icon name="camera" size={22} color="#0B3B24" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Landmark Photographs */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="building" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Landmark Photographs</Text>
          </View>
          <Text style={styles.helperText}>
            Visible nearby road sign, community gate, or water tower.
          </Text>

          <View style={styles.photosGrid}>
            {landmarkPhotos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.photoThumb} />
            ))}
            <TouchableOpacity
              style={styles.addPhotoSlot}
              onPress={() => alert('Landmark photo picker')}
            >
              <Icon name="plus" size={22} color="#0B3B24" />
              <Text style={styles.addPhotoText}>Add Landmark</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location & Address */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="map-pin" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Location & Address</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address *</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              multiline
              placeholder="House/Plot No, Street, Sector, City"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nearby Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Near the Old Water Tower"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>

          <View style={styles.coordsCard}>
            <Icon name="navigation" size={16} color="#0B3B24" />
            <Text style={styles.coordsText}>GPS Tag: {coordinates}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="document" size={16} color="#0B3B24" />
            <Text style={styles.sectionTitle}>Description & Soil Info</Text>
          </View>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            placeholder="Describe the area, soil type, sapling preferences, or special access instructions..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Submit Plantation Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 6,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3B24',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1E8DA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B3B24',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  addPhotoSlot: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0B3B24',
    borderStyle: 'dashed',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0B3B24',
  },
  coordsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EE',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginTop: 4,
  },
  coordsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B3B24',
  },
  submitBtn: {
    backgroundColor: '#0B3B24',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0B3B24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

