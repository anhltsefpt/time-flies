import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInDown,
  SlideOutDown,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { AppColors, AppFonts } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { usePurchases, type PlanId } from '@/contexts/PurchaseContext';

const features = [
  {
    icon: '\u{1F525}',
    title: 'Your Life, Mapped',
    desc: 'Every phase from childhood to golden years',
  },
  {
    icon: '\u23F3',
    title: 'Unlimited Countdowns',
    desc: 'Track every deadline and milestone',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Lifetime Stats',
    desc: 'Hours awake, days asleep — see yours',
  },
  {
    icon: '\u{1F9E9}',
    title: 'Home Widgets',
    desc: 'Your countdown on the home screen',
  },
];

// --- Shimmer Button (reused in both steps) ---

function ShimmerButton({ text, style }: { text: string; style?: object }) {
  const shimmerX = useSharedValue(-1);

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 200 }],
  }));

  return (
    <LinearGradient
      colors={['#F97316', '#EA580C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.ctaButton, style]}>
      <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.12)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Text style={styles.ctaText}>{text}</Text>
    </LinearGradient>
  );
}

// --- Main Paywall Screen ---

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { isProUser, products, isLoading, isPurchasing, purchase, restorePurchases } = usePurchases();
  const [showPricing, setShowPricing] = useState(false);
  const [selected, setSelected] = useState<PlanId>('yearly');

  // Auto-dismiss if already premium
  useEffect(() => {
    if (isProUser) {
      router.back();
    }
  }, [isProUser]);

  const plans = useMemo(() => [
    {
      id: 'yearly' as PlanId,
      label: 'Yearly',
      price: products.yearly?.priceString ?? '$7.99',
      unit: '/year',
      perMonth: products.yearly
        ? `${(products.yearly.price / 12).toLocaleString('en-US', { style: 'currency', currency: products.yearly.currencyCode })}\/mo`
        : '$0.67/mo',
      trial: '7 days free',
      badge: 'MOST POPULAR',
      save: 'Save 67%',
    },
    {
      id: 'monthly' as PlanId,
      label: 'Monthly',
      price: products.monthly?.priceString ?? '$1.99',
      unit: '/mo',
      perMonth: null,
      trial: '3 days free',
      badge: null,
      save: null,
    },
    {
      id: 'lifetime' as PlanId,
      label: 'Lifetime',
      price: products.lifetime?.priceString ?? '$9.99',
      unit: '',
      perMonth: 'Pay once, keep forever',
      trial: null,
      badge: null,
      save: null,
    },
  ], [products]);

  const ctaText = useMemo((): Record<PlanId, string> => ({
    yearly: 'Start 7-Day Free Trial',
    monthly: 'Start 3-Day Free Trial',
    lifetime: `Get Lifetime Access \u2014 ${products.lifetime?.priceString ?? '$9.99'}`,
  }), [products]);

  const subText = useMemo((): Record<PlanId, string> => ({
    yearly: `Then ${products.yearly?.priceString ?? '$7.99'}/year. Cancel anytime.`,
    monthly: `Then ${products.monthly?.priceString ?? '$1.99'}/month. Cancel anytime.`,
    lifetime: 'One-time payment. No subscription.',
  }), [products]);

  const handlePurchase = async () => {
    try {
      const success = await purchase(selected);
      if (success) router.back();
    } catch {
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert('Restored!', 'Your premium access has been restored.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Nothing to Restore', 'No previous purchases were found.');
    }
  };

  const daysLeft = useMemo(() => {
    const endDate = new Date(settings.birthYear + settings.lifeExpectancy, 0, 1);
    const today = new Date();
    return Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / 86400000));
  }, [settings.birthYear, settings.lifeExpectancy]);

  const progressPercent = useMemo(() => {
    const totalDays = settings.lifeExpectancy * 365;
    const lived = totalDays - daysLeft;
    return Math.min(100, Math.max(0, (lived / totalDays) * 100));
  }, [daysLeft, settings.lifeExpectancy]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== STEP 1: Emotional Screen ===== */}
      <View style={styles.step1}>
        {/* Close button — absolute top-right */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.closeButtonWrap}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
            activeOpacity={0.7}>
            <Text style={styles.closeIcon}>{'\u2715'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Centered content */}
        <View style={styles.step1Content}>
          <Animated.View entering={FadeInUp.duration(800).delay(150)} style={styles.heroSection}>
            {/* "YOU HAVE" label */}
            <Text style={styles.youHaveLabel}>YOU HAVE</Text>

            {/* Days number */}
            <Text style={styles.daysNumber}>{daysLeft.toLocaleString()}</Text>
            <Text style={styles.daysLabel}>days left to live</Text>

            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#F97316', '#EF4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                />
              </View>
            </View>

            {/* "X% gone" text */}
            <Text style={styles.goneText}>{progressPercent.toFixed(1)}% gone</Text>

            {/* Quote — 2 separate lines */}
            <Text style={styles.quoteLine1}>You're not buying an app.</Text>
            <Text style={styles.quoteLine2}>
              {"You're buying the clock\nthat reminds you to live."}
            </Text>
          </Animated.View>

          {/* Features Grid */}
          <Animated.View entering={FadeInUp.duration(600).delay(350)} style={styles.featuresGrid}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Continue button — pinned to bottom */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(500)}
          style={[styles.continueWrap, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setShowPricing(true)}>
            <ShimmerButton text="Continue" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ===== STEP 2: Pricing Bottom Sheet ===== */}
      {showPricing && (
        <>
          {/* Overlay */}
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowPricing(false)} />
          </Animated.View>

          {/* Bottom Sheet */}
          <Animated.View
            entering={SlideInDown.duration(350)}
            exiting={SlideOutDown.duration(300)}
            style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Sheet title */}
            <Text style={styles.sheetTitle}>Choose your plan</Text>
            <Text style={styles.sheetSubtitle}>Cancel anytime. No commitment.</Text>

            {/* Plan cards */}
            <View style={styles.plansSection}>
              {isLoading ? (
                <View style={styles.loadingPlans}>
                  <ActivityIndicator color={AppColors.orange} size="large" />
                </View>
              ) : plans.map((plan) => {
                const isSelected = selected === plan.id;
                const isYearly = plan.id === 'yearly';

                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelected(plan.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                    ]}>
                    {isYearly && (
                      <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{plan.badge}</Text>
                      </LinearGradient>
                    )}

                    {/* Radio */}
                    {isSelected ? (
                      <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.radioSelected}>
                        <Text style={styles.radioCheck}>{'\u2713'}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.radioUnselected} />
                    )}

                    {/* Label + detail */}
                    <View style={styles.planInfo}>
                      <View style={styles.planLabelRow}>
                        <Text style={[styles.planLabel, isSelected && styles.planLabelActive]}>
                          {plan.label}
                        </Text>
                        {plan.save && (
                          <View style={styles.saveBadge}>
                            <Text style={styles.saveBadgeText}>{plan.save}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.planDetailRow}>
                        {plan.perMonth && (
                          <Text style={[styles.planPerMonth, isSelected && styles.planPerMonthActive]}>
                            {plan.perMonth}
                          </Text>
                        )}
                        {plan.trial && (
                          <View style={styles.trialBadge}>
                            <Text style={styles.trialBadgeText}>{plan.trial}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Price */}
                    <View style={styles.planPriceSection}>
                      <Text style={[styles.planPrice, isSelected && styles.planPriceActive]}>
                        {plan.price}
                      </Text>
                      {plan.unit !== '' && (
                        <Text style={[styles.planUnit, isSelected && styles.planUnitActive]}>
                          {plan.unit}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* CTA */}
            <TouchableOpacity activeOpacity={0.85} onPress={handlePurchase} disabled={isPurchasing}>
              {isPurchasing ? (
                <LinearGradient
                  colors={['#F97316', '#EA580C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.ctaButton, styles.sheetCta]}>
                  <ActivityIndicator color="#fff" />
                </LinearGradient>
              ) : (
                <ShimmerButton text={ctaText[selected]} style={styles.sheetCta} />
              )}
            </TouchableOpacity>

            <Text style={styles.subText}>{subText[selected]}</Text>

            <TouchableOpacity style={styles.restoreButton} activeOpacity={0.6} onPress={handleRestore} disabled={isPurchasing}>
              <Text style={styles.restoreText}>Restore purchases</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
}

// --- Styles ---

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  // ========== Step 1 ==========
  step1: {
    flex: 1,
  },
  closeButtonWrap: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.text06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  step1Content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  youHaveLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 3,
    marginBottom: 8,
  },
  daysNumber: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 72,
    color: '#fff',
    lineHeight: 78,
    letterSpacing: -3,
  },
  daysLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 6,
    letterSpacing: 1,
  },
  progressBarContainer: {
    width: '55%',
    marginTop: 18,
  },
  progressBarBg: {
    height: 3,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 99,
  },
  goneText: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },

  // Quote
  quoteLine1: {
    fontFamily: AppFonts.outfitMedium,
    fontSize: 18,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 20,
  },
  quoteLine2: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 18,
    color: AppColors.orange,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 4,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 32,
    width: '100%',
  },
  featureCard: {
    width: '48%',
    padding: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  featureIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  featureTitle: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
  featureDesc: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 3,
    lineHeight: 15,
  },

  // Continue button
  continueWrap: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  // ========== Step 2: Bottom Sheet ==========
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111118',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    zIndex: 30,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },

  // Plans
  plansSection: {
    gap: 10,
    marginBottom: 20,
  },
  loadingPlans: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  planCardSelected: {
    borderColor: 'rgba(249,115,22,0.8)',
    borderWidth: 2,
    backgroundColor: 'rgba(249,115,22,0.06)',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  planBadgeText: {
    fontFamily: AppFonts.monoBold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Radio
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCheck: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    marginRight: 12,
  },

  // Plan info
  planInfo: {
    flex: 1,
  },
  planLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planLabel: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
  },
  planLabelActive: {
    color: '#fff',
  },
  saveBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontFamily: AppFonts.monoMedium,
    fontSize: 10,
    color: '#22C55E',
  },
  planDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  planPerMonth: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  planPerMonthActive: {
    color: 'rgba(255,255,255,0.5)',
  },
  trialBadge: {
    backgroundColor: 'rgba(249,115,22,0.08)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  trialBadgeText: {
    fontFamily: AppFonts.monoMedium,
    fontSize: 10,
    color: AppColors.orange,
  },

  // Plan price
  planPriceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 20,
    color: 'rgba(255,255,255,0.5)',
  },
  planPriceActive: {
    color: '#fff',
  },
  planUnit: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  planUnitActive: {
    color: 'rgba(255,255,255,0.5)',
  },

  // CTA
  ctaButton: {
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  sheetCta: {
    paddingVertical: 17,
    borderRadius: 14,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    left: '50%',
  },
  ctaText: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 16,
    color: '#fff',
  },
  subText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 16,
  },
  restoreButton: {
    alignItems: 'center',
    paddingTop: 10,
  },
  restoreText: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    textDecorationLine: 'underline',
  },
});
