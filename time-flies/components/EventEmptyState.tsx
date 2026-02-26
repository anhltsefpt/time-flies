import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';

interface EventEmptyStateProps {
  onAdd: () => void;
}

export function EventEmptyState({ onAdd }: EventEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📅</Text>
      <Text style={styles.title}>Chưa có sự kiện nào</Text>
      <Text style={styles.subtitle}>Tạo sự kiện để đếm ngược đến ngày quan trọng</Text>
      <Pressable onPress={onAdd} style={styles.button}>
        <Text style={styles.buttonText}>+ Tạo sự kiện đầu tiên</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
    opacity: 0.35,
  },
  title: {
    fontFamily: AppFonts.outfit,
    fontSize: 17,
    color: AppColors.text35,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text15,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
    backgroundColor: 'rgba(249,115,22,0.08)',
  },
  buttonText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 14,
    color: AppColors.orange,
  },
});
