import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { AppFonts } from '@/constants/theme';
import { hexToRgba } from '@/utils/events';
import { glowShadow } from '@/utils/shadow';

interface CountdownBadgeProps {
  days: number;
  color: string;
  pulse?: boolean;
}

export function CountdownBadge({ days, color, pulse }: CountdownBadgeProps) {
  const isPast = days < 0;
  const isToday = days === 0;
  const isUrgent = days >= 0 && days <= 3;

  const scale = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = 1;
    }
  }, [pulse]);

  const animatedNumberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const displayNum = isPast ? Math.abs(days) : days;
  const size = 56;
  const r = 24;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: isPast ? 'rgba(255,255,255,0.03)' : undefined,
      },
      isUrgent && !isPast ? glowShadow(color, pulse ? 12 : 8) : undefined,
    ]}>
      {!isPast && (
        <Svg width={size} height={size} style={styles.ring}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill={color}
          />
        </Svg>
      )}
      <Animated.Text style={[
        styles.number,
        {
          fontSize: isToday ? 13 : displayNum > 99 ? 15 : 20,
          color: isPast ? 'rgba(255,255,255,0.40)' : '#ffffff',
        },
        pulse ? animatedNumberStyle : undefined,
      ]}>
        {isToday ? '!' : displayNum}
      </Animated.Text>
      <Text style={[
        styles.label,
        { color: isPast ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.7)' },
      ]}>
        {isToday ? 'TODAY' : isPast ? 'AGO' : 'DAYS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  number: {
    fontFamily: AppFonts.outfitBold,
    fontWeight: '800',
    lineHeight: 22,
  },
  label: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
  },
});
