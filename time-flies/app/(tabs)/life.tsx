import { LifeGrid } from '@/components/LifeGrid';
import { AppColors, AppFonts } from '@/constants/theme';
import { usePurchases } from '@/contexts/PurchaseContext';
import { useSettings } from '@/contexts/SettingsContext';
import { track } from '@/utils/analytics';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LifeScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  let { isProUser } = usePurchases();
  isProUser = true;
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isProUser}>
        <LifeGrid settings={settings} />
      </ScrollView>

      {!isProUser && (
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFillObject}>
          <View style={styles.overlay}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>

            <Text style={styles.heading}>See your life, mapped out</Text>

            <Text style={styles.subtext}>Every phase. Every year.</Text>
            <Text style={styles.subtext}>From childhood to golden years.</Text>

            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={() => { track('premium_gate_cta_pressed', { source: 'life_tab' }); router.push('/paywall'); }}>
              <Text style={styles.ctaText}>Unlock with Premium</Text>
            </TouchableOpacity>

            <Text style={styles.trialText}>Start with 7 days free</Text>
          </View>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 28,
  },
  heading: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 24,
    color: AppColors.text100,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontFamily: AppFonts.outfit,
    fontSize: 16,
    color: AppColors.text35,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: 32,
    backgroundColor: AppColors.orange,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  ctaText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 17,
    color: '#ffffff',
  },
  trialText: {
    fontFamily: AppFonts.outfit,
    fontSize: 14,
    color: AppColors.text25,
    marginTop: 14,
  },
});
