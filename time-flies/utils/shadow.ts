import { Platform, ViewStyle } from 'react-native';

export function glowShadow(color: string, radius: number = 8): ViewStyle {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: radius,
    };
  }
  return {
    elevation: Math.min(radius, 24),
  };
}

export function cardShadow(): ViewStyle {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    };
  }
  return {
    elevation: 4,
  };
}
