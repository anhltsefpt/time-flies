import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AppColors, AppFonts } from '@/constants/theme';
import { CountdownBadge } from '@/components/CountdownBadge';
import {
  getDaysLeft,
  getDaysSince,
  formatDate,
  getUrgencyTier,
  getEventProgress,
  hexToRgba,
} from '@/utils/events';
import { glowShadow } from '@/utils/shadow';
import type { FiniteEvent } from '@/types';

interface EventCardProps {
  event: FiniteEvent;
  index: number;
  onPress: () => void;
  onDelete?: (id: number) => void;
}

function renderRightActions() {
  return (
    <View style={styles.swipeDelete}>
      <Text style={styles.swipeDeleteText}>Delete</Text>
    </View>
  );
}

export function EventCard({ event, index, onPress, onDelete }: EventCardProps) {
  const days = getDaysLeft(event.due);
  const isPast = days < 0;
  const tier = getUrgencyTier(event.due);
  const progress = getEventProgress(event.due, event.created);
  const swipeableRef = useRef<Swipeable>(null);

  const handleSwipeOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swipeableRef.current?.close();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  const tierStyles = getTierStyles(tier, event.color);

  const cardContent = (
    <Pressable
      onPress={onPress}
      style={[styles.card, tierStyles.card]}
    >
      <CountdownBadge
        days={days}
        color={event.color}
        pulse={tier === 'critical'}
      />

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
        <Text style={[styles.date, { color: isPast ? 'rgba(255,255,255,0.35)' : AppColors.text20 }]}>
          {formatDate(event.due)}
        </Text>
        {!isPast && event.created && (() => {
          const daysSince = getDaysSince(event.created);
          const totalSpan = daysSince + Math.max(days, 0);
          return (
            <View style={styles.progressBlock}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.max(2, progress)}%`, backgroundColor: event.color, opacity: 0.6 }]} />
              </View>
              <Text style={styles.progressLabel}>
                {daysSince}/{totalSpan}d
              </Text>
            </View>
          );
        })()}
      </View>

      <Text style={styles.chevron}>&rsaquo;</Text>
    </Pressable>
  );

  if (isPast || !onDelete) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(500).springify()}>
        {cardContent}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(500).springify()}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeOpen}
        rightThreshold={80}
        overshootRight={false}
      >
        {cardContent}
      </Swipeable>
    </Animated.View>
  );
}

function getTierStyles(tier: string, color: string) {
  switch (tier) {
    case 'critical':
      return {
        card: {
          borderColor: hexToRgba(color, 0.3),
          ...glowShadow(color, 12),
        } as const,
        bg: [hexToRgba(color, 0.12), hexToRgba(color, 0.04)] as const,
      };
    case 'soon':
      return {
        card: {
          borderColor: hexToRgba(color, 0.15),
          ...glowShadow(color, 6),
        } as const,
        bg: [hexToRgba(color, 0.06), 'transparent'] as const,
      };
    case 'normal':
      return {
        card: {
          backgroundColor: hexToRgba(color, 0.024),
          borderColor: hexToRgba(color, 0.08),
        } as const,
        bg: null,
      };
    case 'distant':
      return {
        card: {
          backgroundColor: AppColors.text04,
          borderColor: AppColors.text06,
        } as const,
        bg: null,
      };
    case 'past':
      return {
        card: {
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.04)',
          opacity: 0.65,
        } as const,
        bg: null,
      };
    default:
      return { card: {} as const, bg: null };
  }
}

// Wrapper that uses LinearGradient for critical/soon tiers
export function EventCardWithGradient(props: EventCardProps) {
  const tier = getUrgencyTier(props.event.due);
  const tierStyle = getTierStyles(tier, props.event.color);

  if (tierStyle.bg) {
    return (
      <View>
        <EventCard {...props} />
        {/* Gradient is applied via bg overlay - for now using flat colors */}
      </View>
    );
  }

  return <EventCard {...props} />;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    backgroundColor: AppColors.background,
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
  progressBlock: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  chevron: {
    fontSize: 20,
    color: AppColors.text15,
    fontWeight: '300',
  },
  swipeDelete: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    borderRadius: 16,
    marginLeft: 8,
  },
  swipeDeleteText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 13,
    color: '#fff',
  },
});
