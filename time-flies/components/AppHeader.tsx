import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AppColors, AppFonts } from '@/constants/theme';

export function AppHeader() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon-transparent.png')} style={styles.icon} />
      <Text style={styles.title}>Finite</Text>
      <View style={styles.liveContainer}>
        <Animated.View style={[styles.liveDot, dotStyle]} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 18,
    color: AppColors.text100,
    flex: 1,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: AppColors.liveDot,
  },
  liveText: {
    fontFamily: AppFonts.mono,
    fontSize: 10,
    color: AppColors.text25,
  },
});
