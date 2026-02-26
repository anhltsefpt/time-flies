import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { isSleepHour } from '@/utils/time';
import { glowShadow } from '@/utils/shadow';
import type { Settings } from '@/types';

interface DayHeatmapProps {
  currentHour: number;
  currentMinute: number;
  currentSecond?: number;
  settings: Settings;
}

const periods = [
  { label: 'Night', range: [0, 6], color: '#6366F1', icon: '🌙' },
  { label: 'Morning', range: [6, 12], color: '#F97316', icon: '🌅' },
  { label: 'Afternoon', range: [12, 18], color: '#22C55E', icon: '☀️' },
  { label: 'Evening', range: [18, 24], color: '#8B5CF6', icon: '🌆' },
];

const rows = [
  { hours: [0, 1, 2, 3, 4, 5], label: '🌙 12–5 AM' },
  { hours: [6, 7, 8, 9, 10, 11], label: '🌅 6–11 AM' },
  { hours: [12, 13, 14, 15, 16, 17], label: '☀️ 12–5 PM' },
  { hours: [18, 19, 20, 21, 22, 23], label: '🌆 6–11 PM' },
];

function PulsingHourCell({ children }: { children: React.ReactNode }) {
  const shadowOpacity = useSharedValue(0.4);

  useEffect(() => {
    shadowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    shadowColor: AppColors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10 + shadowOpacity.value * 10,
  }));

  return (
    <Animated.View style={[styles.pulsingCell, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export function DayHeatmap({ currentHour, currentMinute, currentSecond = 0, settings }: DayHeatmapProps) {
  const { sleepStart, sleepEnd } = settings;
  const currentPeriod = periods.find((p) => currentHour >= p.range[0] && currentHour < p.range[1]);

  const getHourColor = (h: number) => {
    if (h === currentHour) return AppColors.orange;
    const isSleep = isSleepHour(h, sleepStart, sleepEnd);
    if (isSleep && h < currentHour) return AppColors.indigoDark;
    if (isSleep) return 'rgba(99,102,241,0.12)';
    if (h < currentHour) {
      const period = periods.find((p) => h >= p.range[0] && h < p.range[1]);
      return period?.color || AppColors.green;
    }
    return AppColors.text10;
  };

  const getHourOpacity = (h: number) => {
    if (h === currentHour) return 1;
    const isSleep = isSleepHour(h, sleepStart, sleepEnd);
    if (isSleep) return h < currentHour ? 0.45 : 0.3;
    if (h < currentHour) return 0.4 + ((currentHour - (currentHour - h)) / 24) * 0.5;
    return 0.6;
  };

  const sleepHours = sleepStart > sleepEnd ? 24 - sleepStart + sleepEnd : sleepEnd - sleepStart;
  const awakeHours = 24 - sleepHours;

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionLabel}>TODAY'S 24 HOURS</Text>
          <View style={styles.periodBadge}>
            <Text style={styles.periodIcon}>{currentPeriod?.icon}</Text>
            <Text style={[styles.periodLabel, { color: currentPeriod?.color }]}>{currentPeriod?.label}</Text>
          </View>
        </View>

        {rows.map((row, ri) => (
          <View key={ri} style={ri < 3 ? styles.rowWithMargin : undefined}>
            <View style={styles.hourRow}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <View style={styles.hourCells}>
                {row.hours.map((h) => {
                  const isCurrent = h === currentHour;
                  const isSleep = isSleepHour(h, sleepStart, sleepEnd);
                  const isPast = h < currentHour;
                  const minuteFill = isCurrent
                    ? ((currentMinute * 60 + currentSecond) / 3600) * 100
                    : 0;

                  const cellContent = (
                    <View
                      style={[
                        styles.hourCell,
                        {
                          backgroundColor: isCurrent ? 'rgba(249,115,22,0.15)' : getHourColor(h),
                          opacity: getHourOpacity(h),
                        },
                        isCurrent && styles.currentCell,
                      ]}>
                      {isCurrent && (
                        <LinearGradient
                          colors={[AppColors.orange, AppColors.orangeLight]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.minuteFill, { width: `${minuteFill}%` as any }]}
                        />
                      )}
                      {isSleep && !isCurrent && (
                        <Text style={styles.sleepEmoji}>💤</Text>
                      )}
                      {!isSleep && (
                        <Text
                          style={[
                            styles.hourText,
                            isCurrent && styles.hourTextCurrent,
                            isPast && !isCurrent && styles.hourTextPast,
                          ]}>
                          {h > 12 ? h - 12 : h === 0 ? 12 : h}{h < 12 ? 'a' : 'p'}
                        </Text>
                      )}
                    </View>
                  );

                  if (isCurrent) {
                    return (
                      <View key={h} style={styles.cellWrapper}>
                        <PulsingHourCell>{cellContent}</PulsingHourCell>
                      </View>
                    );
                  }

                  return (
                    <View key={h} style={styles.cellWrapper}>
                      {cellContent}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ))}

        {/* Sleep info bar */}
        <View style={styles.sleepInfoBar}>
          <Text style={styles.sleepEmoji2}>😴</Text>
          <Text style={styles.sleepInfoText}>
            Sleep: {sleepStart > 12 ? sleepStart - 12 : sleepStart}:00 {sleepStart >= 12 ? 'PM' : 'AM'} – {sleepEnd > 12 ? sleepEnd - 12 : sleepEnd}:00 {sleepEnd >= 12 ? 'PM' : 'AM'}
          </Text>
          <Text style={styles.sleepHoursText}>{sleepHours}h sleep</Text>
        </View>
      </View>

      {/* Awake/Sleep summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(249,115,22,0.03)', borderColor: 'rgba(249,115,22,0.08)' }]}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>☀️</Text>
            <Text style={[styles.summaryLabel, { color: AppColors.orange }]}>Awake Time</Text>
          </View>
          <Text style={[styles.summaryValue, { color: AppColors.orange }]}>{awakeHours}h</Text>
          <Text style={styles.summaryUnit}> / day</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(99,102,241,0.03)', borderColor: 'rgba(99,102,241,0.08)' }]}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>🌙</Text>
            <Text style={[styles.summaryLabel, { color: AppColors.indigo }]}>Sleep Time</Text>
          </View>
          <Text style={[styles.summaryValue, { color: AppColors.indigo }]}>{sleepHours}h</Text>
          <Text style={styles.summaryUnit}> / day</Text>
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
    letterSpacing: 1.5,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  periodIcon: {
    fontSize: 12,
  },
  periodLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
  },
  rowWithMargin: {
    marginBottom: 6,
  },
  hourRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  rowLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text20,
    width: 52,
  },
  hourCells: {
    flexDirection: 'row',
    gap: 3,
    flex: 1,
  },
  cellWrapper: {
    flex: 1,
  },
  pulsingCell: {
    flex: 1,
    borderRadius: 4,
  },
  hourCell: {
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  currentCell: {
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.4)',
  },
  minuteFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  sleepEmoji: {
    fontSize: 8,
    opacity: 0.5,
  },
  hourText: {
    fontFamily: AppFonts.monoMedium,
    fontSize: 9,
    color: AppColors.text15,
    zIndex: 1,
  },
  hourTextCurrent: {
    fontFamily: AppFonts.monoBold,
    color: '#fff',
  },
  hourTextPast: {
    color: AppColors.text60,
  },
  sleepInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.1)',
  },
  sleepEmoji2: {
    fontSize: 12,
  },
  sleepInfoText: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: AppColors.text35,
    flex: 1,
  },
  sleepHoursText: {
    fontFamily: AppFonts.mono,
    fontSize: 10,
    color: 'rgba(99,102,241,0.8)',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryIcon: {
    fontSize: 14,
  },
  summaryLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
  },
  summaryValue: {
    fontFamily: AppFonts.monoBold,
    fontSize: 20,
  },
  summaryUnit: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text20,
  },
});
