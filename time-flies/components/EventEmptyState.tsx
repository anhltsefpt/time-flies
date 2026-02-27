import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors, AppFonts } from '@/constants/theme';
import { CircularRing } from '@/components/CircularRing';

interface EventEmptyStateProps {
  onAdd: () => void;
}

const PILLS = [
  { emoji: '🎂', label: 'Birthday' },
  { emoji: '✈️', label: 'Trip' },
  { emoji: '📦', label: 'Deadline' },
];

export function EventEmptyState({ onAdd }: EventEmptyStateProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} style={[styles.ringWrap, pulseStyle]}>
        <CircularRing
          progress={0}
          size={100}
          strokeWidth={4}
          color={AppColors.orange}
          glowColor={AppColors.orange}
        >
          <Text style={styles.questionMark}>?</Text>
        </CircularRing>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(800)}>
        <Text style={styles.title}>What are you counting down to?</Text>
        <Text style={styles.subtitle}>Track deadlines, birthdays, trips, and more</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <Pressable onPress={onAdd} style={styles.ctaWrapper}>
          <LinearGradient
            colors={[AppColors.orange, AppColors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>+ Create your first event</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.pillRow}>
        {PILLS.map((pill) => (
          <View key={pill.label} style={styles.pill}>
            <Text style={styles.pillText}>{pill.emoji} {pill.label}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
  },
  ringWrap: {
    marginBottom: 24,
  },
  questionMark: {
    fontFamily: AppFonts.monoBold,
    fontSize: 32,
    color: AppColors.orange,
    fontWeight: '800',
  },
  title: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 18,
    color: AppColors.text85,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: AppFonts.outfit,
    fontSize: 14,
    color: AppColors.text35,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: AppColors.text04,
  },
  pillText: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
  },
});
