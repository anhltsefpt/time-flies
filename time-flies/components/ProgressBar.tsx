import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';

interface ProgressBarProps {
  label: string;
  progress: number;
  left: number;
  unit: string;
  color: string;
  glowColor: string;
  delay?: number;
  icon: string;
}

export function ProgressBar({ label, progress, left, unit, color, glowColor, delay = 0, icon }: ProgressBarProps) {
  const leftText =
    left < 1 && unit === 'hrs'
      ? `${Math.round(left * 60)} min left`
      : `${left.toFixed(1)} ${unit} left`;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(700).springify()} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.leftText}>{leftText}</Text>
      </View>
      <View style={styles.trackOuter}>
        <LinearGradient
          colors={[color, glowColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.trackFill, { width: `${Math.min(progress, 100)}%` as any }]}
        />
      </View>
      <View style={styles.percentRow}>
        <Text style={[styles.percentValue, { color }]}>{progress.toFixed(2)}</Text>
        <Text style={styles.percentSign}>%</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontFamily: AppFonts.outfitMedium,
    fontSize: 14,
    color: AppColors.text70,
    letterSpacing: 0.5,
  },
  leftText: {
    fontFamily: AppFonts.mono,
    fontSize: 13,
    color: AppColors.text35,
  },
  trackOuter: {
    width: '100%',
    height: 8,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 99,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 6,
  },
  percentValue: {
    fontFamily: AppFonts.monoBold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  percentSign: {
    fontFamily: AppFonts.mono,
    fontSize: 13,
    color: AppColors.text25,
  },
});
