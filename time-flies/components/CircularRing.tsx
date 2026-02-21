import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  glowColor: string;
  children?: React.ReactNode;
}

export function CircularRing({ progress, size, strokeWidth, color, glowColor, children }: CircularRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;

  const glowStyle: ViewStyle = Platform.OS === 'ios'
    ? { shadowColor: glowColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 8 }
    : { elevation: 6 };

  return (
    <View style={[{ width: size, height: size }, glowStyle]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.childrenOverlay}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childrenOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
