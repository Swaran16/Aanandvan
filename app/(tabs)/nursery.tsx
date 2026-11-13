/**
 * Partner Nurseries Directory Screen — Aanandvan
 * Displays verified partner nurseries with sapling stocks, operating hours, and map directions.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';

interface NurseryItem {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  phone: string;
  saplingTypes: string[];
  totalStock: number;
  timing: string;
  rating: number;
  imageUrl: string;
}

const NURSERIES: NurseryItem[] = [
  {
    id: 'nurs-1',
    name: 'Hariyali Plant Nursery',
    area: 'Plot 4, Near West Station, Dadar West, Mumbai',
    distanceKm: 1.1,
    phone: '+91 98200 11223',
    saplingTypes: ['Neem', 'Peepal', 'Gulmohar', 'Amla'],
    totalStock: 350,
    timing: '8:00 AM – 6:30 PM (Daily)',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'nurs-2',
    name: 'Green Earth Eco Nursery',
    area: 'Shed 12, Behind Botanical Garden, Matunga East',
    distanceKm: 2.3,
    phone: '+91 98201 44556',
    saplingTypes: ['Banyan', 'Jamun', 'Bel', 'Kadamba'],
    totalStock: 480,
    timing: '7:30 AM – 7:00 PM (Mon–Sat)',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'nurs-3',
    name: 'Prakriti Tree Nursery',
    area: 'Gate 2, Sion Circle Greens, Sion, Mumbai',
    distanceKm: 3.4,
    phone: '+91 98110 99887',
    saplingTypes: ['White Oak', 'Mahogany', 'Ashoka', 'Karanj'],
    totalStock: 220,
    timing: '9:00 AM – 6:00 PM (Daily)',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'nurs-4',
    name: 'EcoBloom Forest Station',
    area: 'Sector 15, Powai Forest Fringe, Mumbai',
    distanceKm: 4.8,
    phone: '+91 99300 77665',
    saplingTypes: ['Fruit Trees', 'Herbal', 'Forest Canopy'],
    totalStock: 610,
    timing: '8:00 AM – 6:00 PM (Tue–Sun)',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&auto=format&fit=crop&q=80',
  },
];

export default function NurseryScreen() {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'nearest' | 'stock'>('all');

  const filtered = useMemo(() => {
    let list = NURSERIES;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.area.toLowerCase().includes(q) ||
          n.saplingTypes.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filterMode === 'nearest') {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (filterMode === 'stock') {
      list = [...list].sort((a, b) => b.totalStock - a.totalStock);
    }
    return list;
  }, [search, filterMode]);

  const handleDirections = (nursery: NurseryItem) => {
    const query = encodeURIComponent(`${nursery.name}, ${nursery.area}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(citizen)' as any))}
          style={styles.backBtn}
        >
          <Icon name="chevron-left" size={24} color="#0B3B24" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partner Nurseries</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Icon name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saplings, nursery name, area..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterMode === 'all' && styles.filterChipActive]}
          onPress={() => setFilterMode('all')}
        >
          <Text style={[styles.filterChipText, filterMode === 'all' && styles.filterChipTextActive]}>
            All ({NURSERIES.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterMode === 'nearest' && styles.filterChipActive]}
          onPress={() => setFilterMode('nearest')}
        >
          <Text style={[styles.filterChipText, filterMode === 'nearest' && styles.filterChipTextActive]}>
            Nearest first
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterMode === 'stock' && styles.filterChipActive]}
          onPress={() => setFilterMode('stock')}
        >
          <Text style={[styles.filterChipText, filterMode === 'stock' && styles.filterChipTextActive]}>
            Highest Stock
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.nurseryCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.nurseryName}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                </View>
              </View>

              <Text style={styles.areaText}>{item.area}</Text>

              <View style={styles.metaRow}>
                <View style={styles.distanceBadge}>
                  <Icon name="map-pin" size={12} color="#0D4E2B" />
                  <Text style={styles.distanceText}>{item.distanceKm} km away</Text>
                </View>
                <Text style={styles.stockText}>{item.totalStock} saplings in stock</Text>
              </View>

              <View style={styles.tagsRow}>
                {item.saplingTypes.map((type) => (
                  <View key={type} style={styles.saplingTag}>
                    <Text style={styles.saplingTagText}>{type}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.timingText}>🕒 {item.timing}</Text>

              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.directionsBtn}
                  activeOpacity={0.8}
                  onPress={() => handleDirections(item)}
                >
                  <Icon name="map-pin" size={14} color="#0B3B24" />
                  <Text style={styles.directionsBtnText}>Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callBtn}
                  activeOpacity={0.8}
                  onPress={() => handleCall(item.phone)}
                >
                  <Text style={styles.callBtnText}>Call Nursery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3B24',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#0B3B24',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },
  nurseryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nurseryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  areaText: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF5EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0B3B24',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  saplingTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saplingTagText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  timingText: {
    fontSize: 11.5,
    color: '#6B7280',
    marginBottom: 14,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: '#0B3B24',
    backgroundColor: '#FFFFFF',
  },
  directionsBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0B3B24',
  },
  callBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0B3B24',
  },
  callBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
