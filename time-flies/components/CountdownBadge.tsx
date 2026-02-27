import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppFonts } from '@/constants/theme';
import { hexToRgba } from '@/utils/events';
import { glowShadow } from '@/utils/shadow';

interface CountdownBadgeProps {
  days: number;
  color: string;
  progress: number;
}

export function CountdownBadge({ days, color, progress }: CountdownBadgeProps) {
  const isPast = days < 0;
  const isToday = days === 0;
  const isUrgent = days >= 0 && days <= 3;

  const size = 60;
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: isPast ? 'rgba(255,255,255,0.03)' : hexToRgba(color, 0.07),
      },
      isUrgent && !isPast ? glowShadow(color, 8) : undefined,
    ]}>
      {!isPast && (
        <Svg width={size} height={size} style={styles.ring}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeDasharray={`${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            opacity={0.2}
          />
        </Svg>
      )}
      <Text style={[
        styles.number,
        {
          fontSize: isToday ? 13 : 24,
          color: isPast ? 'rgba(255,255,255,0.40)' : color,
        },
      ]}>
        {isToday ? 'TO' : isPast ? Math.abs(days) : days}
      </Text>
      <Text style={[
        styles.unit,
        { color: isPast ? 'rgba(255,255,255,0.35)' : hexToRgba(color, 0.47) },
      ]}>
        {isToday ? 'DAY' : 'days'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  number: {
    fontFamily: AppFonts.monoBold,
    fontWeight: '800',
    lineHeight: 28,
  },
  unit: {
    fontFamily: AppFonts.monoBold,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
});
