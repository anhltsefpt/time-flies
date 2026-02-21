import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors, AppFonts } from '@/constants/theme';
import { glowShadow } from '@/utils/shadow';
import type { TimeData } from '@/types';

interface WeekHeatmapProps {
  data: TimeData;
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeekHeatmap({ data }: WeekHeatmapProps) {
  const now = new Date();
  const currentDayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>THIS WEEK</Text>
        <Text style={styles.percentText}>{data.week.progress.toFixed(1)}%</Text>
      </View>

      <View style={styles.daysRow}>
        {dayNames.map((day, i) => {
          const isPast = i < currentDayOfWeek;
          const isCurrent = i === currentDayOfWeek;
          const dayProgress = isCurrent ? ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100 : 0;
          const opacity = isPast ? 0.4 + (i / Math.max(currentDayOfWeek, 1)) * 0.5 : !isCurrent ? 0.6 : 1;

          return (
            <View key={i} style={styles.dayCol}>
              <View
                style={[
                  styles.dayBar,
                  {
                    backgroundColor: isPast ? AppColors.blue : isCurrent ? 'rgba(59,130,246,0.15)' : AppColors.text04,
                    opacity,
                  },
                  isCurrent && styles.currentBar,
                  isCurrent && glowShadow(AppColors.blue, 10),
                ]}>
                {isCurrent && (
                  <LinearGradient
                    colors={[AppColors.blue, AppColors.blueLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.dayFill, { width: `${dayProgress}%` as any }]}
                  />
                )}
                {isPast && <Text style={styles.checkMark}>✓</Text>}
                {isCurrent && (
                  <Text style={styles.dayPercent}>{dayProgress.toFixed(0)}%</Text>
                )}
              </View>
              <Text
                style={[
                  styles.dayName,
                  isCurrent && styles.dayNameCurrent,
                  isPast && styles.dayNamePast,
                ]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.infoLabel}>📍 {fullDayNames[currentDayOfWeek]}</Text>
        <Text style={styles.infoValue}>{currentDayOfWeek} of 7 days gone</Text>
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
  percentText: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.blue,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  dayBar: {
    width: '100%',
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  currentBar: {
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.4)',
  },
  dayFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 6,
  },
  checkMark: {
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  dayPercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 9,
    color: '#fff',
    zIndex: 1,
  },
  dayName: {
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: AppColors.text15,
  },
  dayNameCurrent: {
    fontFamily: AppFonts.monoBold,
    color: AppColors.blue,
  },
  dayNamePast: {
    color: AppColors.text35,
  },
  infoBar: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.blue,
  },
  infoValue: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
  },
});
