import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return <Text style={styles.label}>{text.toUpperCase()}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
    letterSpacing: 1.5,
  },
});
