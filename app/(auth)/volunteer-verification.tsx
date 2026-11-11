/**
 * Volunteer Verification Status Screen — Aanandvan (Designs 1 & 2)
 *
 * Displays two states:
 * 1. Pending (`status === 'pending'`):
 *    - Amber clock circle, "Application submitted", "Verification pending" badge
 *    - Timeline card: Application submitted (✓), Under review (●), Decision (○)
 *    - "Explore the app" CTA
 * 2. Rejected / Not Approved (`status === 'rejected'`):
 *    - Red alert circle, "Application not approved"
 *    - Reason card: "Reason from the team"
 *    - "Update & resubmit" + "Contact support" CTAs
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common';
import { Icon } from '@/components/common/Icon';
import { useApp } from '@/context/AppContext';

type VerificationState = 'pending' | 'rejected';

export default function VolunteerVerificationScreen() {
  const { status: paramStatus, reason } = useLocalSearchParams<{
    status?: string;
    reason?: string;
  }>();
  const { loginAs } = useApp();

  const [viewState, setViewState] = useState<VerificationState>(
    paramStatus === 'rejected' ? 'rejected' : 'pending'
  );

  const handleExploreApp = () => {
    loginAs('volunteer');
    router.replace('/(volunteer)' as any);
  };

  const handleResubmit = () => {
    router.replace({
      pathname: '/(auth)/register',
      params: { role: 'volunteer' },
    } as any);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Aanandvan Support',
      'You can reach our volunteer verification team at support@aanandvan.in or +91 1800-123-4567.'
    );
  };

  const isPending = viewState === 'pending';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Subtle top preview toggle for inspecting Pending vs Not Approved states */}
      <View style={styles.topPreviewBar}>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-left" size={24} color="#0B3B24" />
        </TouchableOpacity>

        <View style={styles.stateToggle}>
          <TouchableOpacity
            style={[styles.toggleChip, isPending && styles.toggleChipActive]}
            onPress={() => setViewState('pending')}
          >
            <Text style={[styles.toggleText, isPending && styles.toggleTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleChip, !isPending && styles.toggleChipActive]}
            onPress={() => setViewState('rejected')}
          >
            <Text style={[styles.toggleText, !isPending && styles.toggleTextActive]}>
              Not Approved
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isPending ? (
          /* ─── STATE 1: APPLICATION SUBMITTED / PENDING ─── */
          <View style={styles.centerWrapper}>
            <View style={styles.heroBlock}>
              {/* Amber Clock Icon Circle */}
              <View style={styles.pendingIconCircle}>
                <ClockVectorIcon size={34} color="#854D0E" />
              </View>

              <Text style={styles.mainTitle}>Application submitted</Text>

              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Verification pending</Text>
              </View>

              <Text style={styles.description}>
                The Aanandvan team is reviewing your details. We will notify you as soon as there is a decision.
              </Text>

              {/* Timeline White Card */}
              <View style={styles.timelineCard}>
                {/* Step 1: Completed */}
                <View style={styles.stepRow}>
                  <View style={styles.stepDoneCircle}>
                    <Icon name="check" size={13} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Application submitted</Text>
                    <Text style={styles.stepSub}>4 Nov 2026</Text>
                  </View>
                </View>

                {/* Step 2: Active / Under review */}
                <View style={styles.stepRow}>
                  <View style={styles.stepActiveRing}>
                    <View style={styles.stepActiveInner} />
                  </View>
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Under review</Text>
                    <Text style={styles.stepSub}>In progress</Text>
                  </View>
                </View>

                {/* Step 3: Upcoming / Decision */}
                <View style={styles.stepRow}>
                  <View style={styles.stepUpcomingCircle} />
                  <View style={styles.stepTextCol}>
                    <Text style={styles.stepTitle}>Decision</Text>
                    <Text style={styles.stepSub}>You will be notified</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Explore Action */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={styles.exploreLinkBtn}
                activeOpacity={0.75}
                onPress={handleExploreApp}
              >
                <Text style={styles.exploreLinkText}>Explore the app</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ─── STATE 2: APPLICATION NOT APPROVED ─── */
          <View style={styles.centerWrapper}>
            <View style={styles.heroBlock}>
              {/* Red Exclamation Circle */}
              <View style={styles.rejectedIconCircle}>
                <AlertVectorIcon size={34} color="#DC2626" />
              </View>

              <Text style={styles.mainTitle}>Application not approved</Text>

              <Text style={[styles.description, { marginTop: 6 }]}>
                We could not approve your application this time. You can fix the details below and apply again.
              </Text>

              {/* Reason Card */}
              <View style={styles.reasonCard}>
                <Text style={styles.reasonTitle}>Reason from the team</Text>
                <Text style={styles.reasonBody}>
                  {reason ||
                    'Address could not be verified. Please upload a clear photo of a valid ID.'}
                </Text>
              </View>
            </View>

            {/* Bottom Action Buttons */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={styles.resubmitBtn}
                activeOpacity={0.88}
                onPress={handleResubmit}
              >
                <Text style={styles.resubmitBtnText}>Update & resubmit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportBtn}
                activeOpacity={0.8}
                onPress={handleContactSupport}
              >
                <Text style={styles.supportBtnText}>Contact support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Vector Icons ─────────────────────────────────────────────────────────────

const ClockVectorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2.5,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: size * 0.2,
        width: 2.5,
        height: size * 0.28,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: size * 0.44,
        left: size * 0.46,
        width: size * 0.24,
        height: 2.5,
        backgroundColor: color,
        borderRadius: 2,
        transform: [{ rotate: '35deg' }],
      }}
    />
  </View>
);

const AlertVectorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2.5,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 2.8,
        height: size * 0.34,
        backgroundColor: color,
        borderRadius: 2,
        marginBottom: 3,
      }}
    />
    <View
      style={{
        width: 3.2,
        height: 3.2,
        borderRadius: 1.6,
        backgroundColor: color,
      }}
    />
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  topPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  stateToggle: {
    flexDirection: 'row',
    backgroundColor: '#EAECE7',
    borderRadius: 18,
    padding: 3,
    gap: 4,
  },
  toggleChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  toggleChipActive: {
    backgroundColor: '#0A4D2E',
  },
  toggleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroBlock: {
    alignItems: 'center',
    paddingTop: 28,
  },
  pendingIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rejectedIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3B24',
    textAlign: 'center',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  pendingBadgeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#92400E',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  timelineCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepDoneCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepActiveRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#92400E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepActiveInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#92400E',
  },
  stepUpcomingCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#374151',
    marginTop: 2,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B3B24',
  },
  stepSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  reasonCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B3B24',
    marginBottom: 6,
  },
  reasonBody: {
    fontSize: 13.5,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomActions: {
    width: '100%',
    paddingTop: 24,
    gap: 12,
  },
  exploreLinkBtn: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  exploreLinkText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0B3B24',
  },
  resubmitBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A4D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resubmitBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#0A4D2E',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0A4D2E',
  },
});

