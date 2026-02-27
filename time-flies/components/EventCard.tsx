import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { CountdownBadge } from '@/components/CountdownBadge';
import { getDaysLeft, getEventProgress, formatDate, hexToRgba } from '@/utils/events';
import type { FiniteEvent } from '@/types';

interface EventCardProps {
  event: FiniteEvent;
  index: number;
  onPress: () => void;
}

export function EventCard({ event, index, onPress }: EventCardProps) {
  const days = getDaysLeft(event.due);
  const isPast = days < 0;
  const isUrgent = days >= 0 && days <= 3;
  const progress = getEventProgress(event.due);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: isPast ? 'rgba(255,255,255,0.02)' : hexToRgba(event.color, 0.024),
            borderColor: isPast
              ? 'rgba(255,255,255,0.04)'
              : isUrgent
                ? hexToRgba(event.color, 0.25)
                : hexToRgba(event.color, 0.08),
            opacity: isPast ? 0.65 : 1,
          },
        ]}
      >
        <CountdownBadge days={days} color={event.color} progress={progress} />

        <View style={styles.info}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: isPast ? AppColors.text25 : AppColors.text100,
                textDecorationLine: isPast ? 'line-through' : 'none',
              },
            ]}
          >
            {event.name}
          </Text>
          <Text style={[
            styles.date,
            { color: isPast ? 'rgba(255,255,255,0.35)' : AppColors.text25 },
          ]}>
            {formatDate(event.due)}
          </Text>
          {!isPast && (
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: event.color,
                  },
                ]}
              />
            </View>
          )}
        </View>

        <Text style={styles.editIcon}>✎</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 15,
    marginBottom: 4,
  },
  date: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    opacity: 0.5,
  },
  editIcon: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.30)',
  },
});
