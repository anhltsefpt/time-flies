import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { quotes } from '@/data/quotes';
import { track } from '@/utils/analytics';

export default function QuotesScreen() {
  const [idx, setIdx] = useState(Math.floor(Math.random() * quotes.length));
  const q = quotes[idx];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.quoteSymbol}>"</Text>
        <Animated.View entering={FadeInUp.duration(800)} key={idx}>
          <Text style={styles.quoteText}>{q.text}</Text>
          <Text style={styles.quoteAuthor}>— {q.author}</Text>
        </Animated.View>
        <Pressable
          onPress={() => {
            const nextIdx = (idx + 1) % quotes.length;
            setIdx(nextIdx);
            track('quote_next', { quote_index: nextIdx });
          }}
          style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}>
          <Text style={styles.nextButtonText}>Next quote →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteSymbol: {
    fontSize: 48,
    opacity: 0.30,
    color: AppColors.text100,
    fontFamily: 'Georgia',
    marginBottom: 32,
  },
  quoteText: {
    fontFamily: AppFonts.outfitLight,
    fontSize: 20,
    color: AppColors.text85,
    lineHeight: 34,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text25,
    marginTop: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: AppColors.text06,
    borderWidth: 1,
    borderColor: AppColors.text10,
    borderRadius: 99,
  },
  nextButtonPressed: {
    backgroundColor: AppColors.text10,
  },
  nextButtonText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text50,
  },
});
