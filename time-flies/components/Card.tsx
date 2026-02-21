import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  backgroundColor?: string;
}

export function Card({ children, style, borderColor, backgroundColor }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        borderColor ? { borderColor } : undefined,
        backgroundColor ? { backgroundColor } : undefined,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surfaceBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
});
