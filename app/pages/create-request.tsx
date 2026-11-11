import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

const SAMPLE_AREA_PHOTOS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=500&auto=format&fit=crop&q=80',
];

const SAMPLE_LANDMARK_PHOTOS = [
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=80',
];

export default function CreateRequestScreen() {
  const { createRequest } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Photos
  const [areaPhotos, setAreaPhotos] = useState<string[]>([]);
  const [landmarkPhotos, setLandmarkPhotos] = useState<string[]>([]);

  // Step 2: Location
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Step 3: Details
  const [title, setTitle] = useState('');
  const [species, setSpecies] = useState('');
  const [saplingsCount, setSaplingsCount] = useState(1);
  const [description, setDescription] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    } else {
      router.back();
    }
  };

  const addAreaPhoto = () => {
    const nextPhoto = SAMPLE_AREA_PHOTOS[areaPhotos.length % SAMPLE_AREA_PHOTOS.length];
    setAreaPhotos((prev) => [...prev, nextPhoto]);
  };

  const removeAreaPhoto = (index: number) => {
    setAreaPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addLandmarkPhoto = () => {
    const nextPhoto =
      SAMPLE_LANDMARK_PHOTOS[landmarkPhotos.length % SAMPLE_LANDMARK_PHOTOS.length];
    setLandmarkPhotos((prev) => [...prev, nextPhoto]);
  };

  const removeLandmarkPhoto = (index: number) => {
    setLandmarkPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUseCurrentLocation = () => {
    setAddress('Adi Shankaracharya Marg, Powai Vihar Complex');
    setLandmark('Near Damji Shamji Corporate Square');
    setCity('Mumbai');
    setPincode('400076');
  };

  const handleStep1Next = () => {
    if (areaPhotos.length < 2) return;
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!address.trim() || !city.trim()) {
      if (Platform.OS === 'web') {
        handleUseCurrentLocation();
      } else {
        Alert.alert(
          'Location Needed',
          'Please enter an address and city, or tap "Use my current location".'
        );
      }
      return;
    }
    setStep(3);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      if (Platform.OS !== 'web') {
        Alert.alert('Request Title Required', 'Please enter a title for your request.');
      }
      return;
    }
    if (!hasPermission) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Confirmation Required',
          'Please confirm that this is a public space or you have permission to plant here.'
        );
      }
      return;
    }

    const fullAddress = [address.trim(), city.trim(), pincode.trim()]
      .filter(Boolean)
      .join(', ');

    const created = createRequest({
      title: title.trim(),
      manualAddress: fullAddress || 'Mumbai, Maharashtra',
      location: address.split(',')[0]?.trim() || city.trim() || 'Mumbai',
      landmark: landmark.trim() || 'Near community park',
      coordinates: '19.1176° N, 72.9060° E',
      description:
        description.trim() ||
        `Requesting plantation of ${saplingsCount} sapling${saplingsCount > 1 ? 's' : ''}${species.trim() ? ` (${species.trim()})` : ''}.`,
      areaPhotos: areaPhotos.length >= 2 ? areaPhotos : SAMPLE_AREA_PHOTOS.slice(0, 2),
      landmarkPhotos:
        landmarkPhotos.length > 0 ? landmarkPhotos : SAMPLE_LANDMARK_PHOTOS.slice(0, 1),
    });

    router.replace({
      pathname: '/pages/request-submitted',
      params: { id: created.id, city: city.trim() || 'Mumbai' },
    } as any);
  };

  const renderPhotoSlots = (
    photos: string[],
    onAdd: () => void,
    onRemove: (idx: number) => void
  ) => {
    return (
      <View style={styles.slotsRow}>
        {[0, 1].map((slotIdx) => {
          const uri = photos[slotIdx];
          if (uri) {
            return (
              <View key={`slot-${slotIdx}`} style={styles.filledSlot}>
                <Image source={{ uri }} style={styles.slotImg} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeBadge}
                  onPress={() => onRemove(slotIdx)}
                  activeOpacity={0.8}
                >
                  <Icon name="close" size={11} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={`slot-${slotIdx}`}
              style={styles.dashedSlot}
              onPress={onAdd}
              activeOpacity={0.75}
            >
              <Icon name="camera" size={24} color="#1B4332" />
            </TouchableOpacity>
          );
        })}

        {photos[2] ? (
          <View style={styles.filledSlot}>
            <Image source={{ uri: photos[2] }} style={styles.slotImg} resizeMode="cover" />
            <TouchableOpacity
              style={styles.removeBadge}
              onPress={() => onRemove(2)}
              activeOpacity={0.8}
            >
              <Icon name="close" size={11} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.dashedSlot}
            onPress={onAdd}
            activeOpacity={0.75}
          >
            <Icon name="plus" size={20} color="#1B4332" />
            <Text style={styles.addMoreText}>Add more photos</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={22} color="#163020" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New plantation request</Text>
      </View>

      {step === 1 && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Area photographs</Text>
            <Text style={styles.sectionSub}>
              Add at least 2 clear photos of the empty space.
            </Text>
            {renderPhotoSlots(areaPhotos, addAreaPhoto, removeAreaPhoto)}

            <Text style={[styles.sectionTitle, { marginTop: 22 }]}>
              Landmark photographs
            </Text>
            <Text style={styles.sectionSub}>
              Add 1-2 clear photos of a nearby landmark so volunteers can find the spot.
            </Text>
            {renderPhotoSlots(landmarkPhotos, addLandmarkPhoto, removeLandmarkPhoto)}

            <View style={styles.tipBox}>
              <Icon name="info" size={17} color="#0D4E2B" />
              <Text style={styles.tipText}>
                Ensure your photos are clear and well-lit. "Before" photos should show the
                empty patch, while "After" photos should clearly show the saplings in their
                new home.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.helperCaption}>
              {areaPhotos.length < 2
                ? `Add ${2 - areaPhotos.length} more area photo${2 - areaPhotos.length > 1 ? 's' : ''} to continue`
                : `${areaPhotos.length} area photos added — ready to continue`}
            </Text>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                areaPhotos.length < 2 && styles.primaryBtnDisabled,
              ]}
              disabled={areaPhotos.length < 2}
              onPress={handleStep1Next}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mapCard}>
              <View style={styles.mapRoadHorizontal} />
              <View style={styles.mapRoadVertical} />
              <View style={styles.mapRoadDiagonal} />

              <View style={[styles.mapBlock, { top: 24, left: 26, width: 64, height: 42 }]} />
              <View style={[styles.mapBlock, { top: 34, right: 32, width: 78, height: 50 }]} />
              <View style={[styles.mapBlock, { bottom: 54, left: 42, width: 72, height: 44 }]} />
              <View style={[styles.mapBlock, { bottom: 48, right: 36, width: 68, height: 48 }]} />

              <View style={styles.mapPinTag}>
                <View style={styles.mapBlueDotOuter}>
                  <View style={styles.mapBlueDotInner} />
                </View>
                <Text style={styles.mapLabelText}>
                  {city.trim() ? `${city}, ${pincode || '400076'}` : 'Selected location'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.useLocationPill}
                onPress={handleUseCurrentLocation}
                activeOpacity={0.85}
              >
                <Icon name="navigation" size={14} color="#0D4E2B" />
                <Text style={styles.useLocationText}>Use my current location</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Street, locality, etc."
              placeholderTextColor="#8B968F"
              value={address}
              onChangeText={setAddress}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>Nearby landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Near the old water tower"
              placeholderTextColor="#8B968F"
              value={landmark}
              onChangeText={setLandmark}
            />

            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Mumbai"
              placeholderTextColor="#8B968F"
              value={city}
              onChangeText={setCity}
            />

            <Text style={styles.fieldLabel}>Pin code</Text>
            <TextInput
              style={styles.input}
              placeholder="400076"
              placeholderTextColor="#8B968F"
              keyboardType="number-pad"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleStep2Next}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.fieldLabel}>Request title</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Bare patch near Shivaji Park"
              placeholderTextColor="#8B968F"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.fieldLabel}>Preferred tree species (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Neem, Banyan, Peepal"
              placeholderTextColor="#8B968F"
              value={species}
              onChangeText={setSpecies}
            />

            <Text style={styles.fieldLabel}>No. of saplings planted</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperSideBtn}
                onPress={() => setSaplingsCount((c) => Math.max(1, c - 1))}
                activeOpacity={0.75}
              >
                <Icon name="minus" size={18} color="#163020" />
              </TouchableOpacity>

              <View style={styles.stepperCenter}>
                <Text style={styles.stepperText}>
                  {String(saplingsCount).padStart(2, '0')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.stepperSideBtn}
                onPress={() => setSaplingsCount((c) => Math.min(99, c + 1))}
                activeOpacity={0.75}
              >
                <Icon name="plus" size={18} color="#163020" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textArea, { minHeight: 112 }]}
              multiline
              placeholder="Start typing to share any specific details about the soil quality, weather conditions, or volunteer highlights..."
              placeholderTextColor="#8B968F"
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.permissionRow}
              onPress={() => setHasPermission((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, hasPermission && styles.checkboxChecked]}>
                {hasPermission && <Icon name="check" size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.permissionText}>
                I confirm this is a public space, or I have permission to plant here.
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Submit request</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D4325',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D4E2B',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12.5,
    color: '#4F5C54',
    lineHeight: 18,
    marginBottom: 12,
  },
  slotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dashedSlot: {
    flex: 1,
    aspectRatio: 0.9,
    borderRadius: 12,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#C5CEC2',
    backgroundColor: '#FAFBF9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 6,
  },
  filledSlot: {
    flex: 1,
    aspectRatio: 0.9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5EAE3',
  },
  slotImg: {
    width: '100%',
    height: '100%',
  },
  removeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(11, 62, 34, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreText: {
    fontSize: 11,
    color: '#4F5C54',
    textAlign: 'center',
    lineHeight: 15,
  },
  tipBox: {
    marginTop: 20,
    backgroundColor: '#D6F5E3',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1B4332',
  },
  mapCard: {
    height: 215,
    borderRadius: 12,
    backgroundColor: '#EAEFE7',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapRoadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 96,
    height: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-8deg' }],
  },
  mapRoadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '48%',
    width: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '12deg' }],
  },
  mapRoadDiagonal: {
    position: 'absolute',
    left: -20,
    right: -20,
    bottom: 42,
    height: 7,
    backgroundColor: '#F9FAF8',
    transform: [{ rotate: '15deg' }],
  },
  mapBlock: {
    position: 'absolute',
    backgroundColor: '#DCE3DA',
    borderRadius: 6,
  },
  mapPinTag: {
    alignItems: 'center',
    gap: 6,
  },
  mapBlueDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBlueDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  useLocationPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  useLocationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0D4E2B',
  },
  fieldLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#163020',
    marginBottom: 8,
  },
  input: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#163020',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 88,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#163020',
    marginBottom: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6DDD4',
    borderRadius: 10,
    height: 46,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  stepperSideBtn: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCenter: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D6DDD4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#163020',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#8B968F',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0D4E2B',
    borderColor: '#0D4E2B',
  },
  permissionText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#5F6C64',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  helperCaption: {
    fontSize: 12.5,
    color: '#0D4E2B',
    textAlign: 'center',
    marginBottom: 10,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#0D4E2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: '#D6DAD5',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
