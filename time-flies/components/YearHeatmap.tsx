import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';
import { glowShadow } from '@/utils/shadow';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DayCell {
  dayOfYear: number;
  isPast: boolean;
  isToday: boolean;
}

interface MonthRow {
  month: number;
  days: DayCell[];
}

export function YearHeatmap() {
  const { width: screenWidth } = useWindowDimensions();
  const now = new Date();
  const year = now.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const { months, daysPassed, totalDays } = useMemo(() => {
    const yearEnd = new Date(year, 11, 31);
    const total = Math.round((yearEnd.getTime() - yearStart.getTime()) / 86400000) + 1;
    const passed = Math.round((today.getTime() - yearStart.getTime()) / 86400000) + 1;

    const monthRows: MonthRow[] = [];
    let runningDay = 1;
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const days: DayCell[] = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, m, d);
        days.push({
          dayOfYear: runningDay,
          isPast: date <= today,
          isToday: date.getTime() === today.getTime(),
        });
        runningDay++;
      }
      monthRows.push({ month: m, days });
    }

    return { months: monthRows, daysPassed: passed, totalDays: total };
  }, [year]);

  // Dynamic cell size: fit 31 dots in available width
  const scrollPadding = 40;   // 20×2 from parent ScrollView
  const cardPadding = 28;     // 14×2
  const labelWidth = 30;
  const labelGap = 6;
  const dotGap = 2;
  const available = screenWidth - scrollPadding - cardPadding - labelWidth - labelGap;
  const cellSize = Math.max(Math.floor((available - dotGap * 30) / 31), 5);

  const getColor = (cell: DayCell) => {
    if (cell.isToday) return AppColors.orange;
    if (!cell.isPast) return AppColors.text10;
    return AppColors.green;
  };

  return (
    <View>
      {/* Stats header */}
      <View style={styles.statsHeader}>
        <Text style={styles.yearLabel}>YEAR {year}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.daysPassedText}>{daysPassed}</Text>
          <Text style={styles.totalDaysText}>/ {totalDays} days</Text>
        </View>
      </View>

      {/* Heatmap grid — month rows */}
      <View style={styles.card}>
        {months.map((mr) => (
          <View key={mr.month} style={styles.monthRow}>
            <Text style={styles.monthLabel}>{monthNames[mr.month]}</Text>
            <View style={styles.dotsRow}>
              {mr.days.map((cell, di) => (
                <View
                  key={di}
                  style={[
                    {
                      width: cellSize,
                      height: cellSize,
                      borderRadius: cellSize / 2,
                      backgroundColor: getColor(cell),
                    },
                    cell.isToday && glowShadow(AppColors.orange, 6),
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Monthly grid */}
      <View style={styles.monthlySection}>
        <Text style={styles.monthlyLabel}>BY MONTH</Text>
        <View style={styles.monthlyGrid}>
          {Array.from({ length: 12 }, (_, m) => {
            const mStart = new Date(year, m, 1);
            const mEnd = new Date(year, m + 1, 1);
            const totalD = Math.round((mEnd.getTime() - mStart.getTime()) / 86400000);
            const passedD = mStart > today ? 0 : Math.min(Math.round((today.getTime() - mStart.getTime()) / 86400000) + 1, totalD);
            const pct = (passedD / totalD) * 100;
            const isCurrent = now.getMonth() === m;
            const isPast = m < now.getMonth();

            return (
              <View
                key={m}
                style={[
                  styles.monthCard,
                  isCurrent && styles.monthCardCurrent,
                  !isCurrent && styles.monthCardDefault,
                ]}>
                <Text style={[styles.monthName, isCurrent && { color: AppColors.orange }, isPast && { color: AppColors.text60 }]}>
                  {monthNames[m]}
                </Text>
                <View style={styles.monthTrack}>
                  <View
                    style={[
                      styles.monthFill,
                      {
                        width: `${pct}%` as any,
                        backgroundColor: isCurrent ? AppColors.orange : isPast ? AppColors.green : 'transparent',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.monthPct, isCurrent && { color: AppColors.orange }]}>
                  {pct.toFixed(0)}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsHeader: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 20,
  },
  yearLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  daysPassedText: {
    fontFamily: AppFonts.monoBold,
    fontSize: 40,
    color: AppColors.green,
  },
  totalDaysText: {
    fontFamily: AppFonts.mono,
    fontSize: 16,
    color: AppColors.text25,
  },
  card: {
    backgroundColor: AppColors.surfaceBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    overflow: 'hidden',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthLabel: {
    width: 30,
    marginRight: 6,
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: AppColors.text25,
  },
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    flex: 1,
  },
  monthlySection: {
    marginTop: 20,
  },
  monthlyLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text25,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  monthlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCard: {
    width: '23%',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  monthCardCurrent: {
    backgroundColor: 'rgba(249,115,22,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.2)',
  },
  monthCardDefault: {
    backgroundColor: AppColors.surfaceBg,
    borderWidth: 1,
    borderColor: AppColors.text04,
  },
  monthName: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 14,
    color: AppColors.text20,
  },
  monthTrack: {
    width: '100%',
    height: 3,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    marginTop: 6,
    overflow: 'hidden',
  },
  monthFill: {
    height: '100%',
    borderRadius: 99,
  },
  monthPct: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
    color: AppColors.text25,
    marginTop: 4,
  },
});
