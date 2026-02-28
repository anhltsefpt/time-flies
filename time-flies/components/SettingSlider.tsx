import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { AppColors, AppFonts } from '@/constants/theme';

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onComplete?: (value: number) => void;
  format?: (value: number) => string;
  icon: string;
  color?: string;
}

export function SettingSlider({ label, value, min, max, step = 1, onChange, onComplete, format, icon, color = AppColors.orange }: SettingSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, { color }]}>
          {format ? format(value) : String(value)}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        onSlidingComplete={onComplete}
        minimumTrackTintColor={color}
        maximumTrackTintColor={AppColors.text08}
        thumbTintColor="#fff"
      />
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{format ? format(min) : String(min)}</Text>
        <Text style={styles.rangeText}>{format ? format(max) : String(max)}</Text>
      </View>
    </View>
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
    fontFamily: AppFonts.outfit,
    fontSize: 14,
    color: AppColors.text70,
  },
  value: {
    fontFamily: AppFonts.mono,
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 32,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rangeText: {
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: AppColors.text20,
  },
});
