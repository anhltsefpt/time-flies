import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';
import { glowShadow } from '@/utils/shadow';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface WeekCell {
  date: Date;
  dayOfYear: number;
  isPast: boolean;
  isToday: boolean;
  month: number;
}

export function YearHeatmap() {
  const { width: screenWidth } = useWindowDimensions();
  const now = new Date();
  const year = now.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const { weeks, monthLabels, daysPassed, totalDays } = useMemo(() => {
    const yearEnd = new Date(year, 11, 31);
    const total = Math.round((yearEnd.getTime() - yearStart.getTime()) / 86400000) + 1;
    const startDay = yearStart.getDay() === 0 ? 6 : yearStart.getDay() - 1;
    const passed = Math.round((today.getTime() - yearStart.getTime()) / 86400000) + 1;
    const allWeeks: (WeekCell | null)[][] = [];
    let currentWeek: (WeekCell | null)[] = new Array(startDay).fill(null);
    const mLabels: { month: number; weekIdx: number }[] = [];
    let lastMonth = -1;

    for (let d = 0; d < total; d++) {
      const date = new Date(year, 0, 1 + d);
      const m = date.getMonth();
      if (m !== lastMonth) {
        mLabels.push({ month: m, weekIdx: allWeeks.length });
        lastMonth = m;
      }
      currentWeek.push({
        date,
        dayOfYear: d + 1,
        isPast: date <= today,
        isToday: date.getTime() === today.getTime(),
        month: m,
      });
      if (currentWeek.length === 7) {
        allWeeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      allWeeks.push(currentWeek);
    }
    return { weeks: allWeeks, monthLabels: mLabels, daysPassed: passed, totalDays: total };
  }, [year]);

  // Dynamic cell size based on screen width
  const padding = 16 * 2 + 20; // card padding + day labels width
  const gap = 1.5;
  const cellSize = Math.max(Math.floor((screenWidth - padding - 32) / weeks.length - gap), 3);

  const getColor = (cell: WeekCell | null) => {
    if (!cell) return 'transparent';
    if (cell.isToday) return AppColors.orange;
    if (!cell.isPast) return AppColors.text04;
    const ratio = cell.dayOfYear / daysPassed;
    if (ratio > 0.85) return AppColors.green;
    if (ratio > 0.6) return AppColors.greenBright;
    if (ratio > 0.35) return AppColors.greenMid;
    return AppColors.greenDark;
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

      {/* Heatmap grid */}
      <View style={styles.card}>
        {/* Month labels */}
        <View style={styles.monthLabelsRow}>
          <View style={{ width: 20 }} />
          <View style={[styles.monthLabelsContainer, { gap }]}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.weekIdx === wi);
              return (
                <View key={wi} style={{ width: cellSize, alignItems: 'flex-start' }}>
                  {ml ? (
                    <Text style={styles.monthLabelText}>{monthNames[ml.month]}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.gridContainer}>
          {/* Day labels */}
          <View style={styles.dayLabels}>
            {['M', '', 'W', '', 'F', '', 'S'].map((dl, i) => (
              <View key={i} style={[styles.dayLabelCell, { height: cellSize }]}>
                <Text style={styles.dayLabelText}>{dl}</Text>
              </View>
            ))}
          </View>

          {/* Week columns */}
          <View style={[styles.weeksContainer, { gap }]}>
            {weeks.map((week, wi) => (
              <View key={wi} style={[styles.weekCol, { gap }]}>
                {week.map((cell, di) => (
                  <View
                    key={di}
                    style={[
                      {
                        width: cellSize,
                        height: cellSize,
                        borderRadius: Math.max(cellSize * 0.23, 1),
                        backgroundColor: getColor(cell),
                      },
                      cell?.isToday && glowShadow(AppColors.orange, 6),
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendText}>Future</Text>
          {[AppColors.text04, AppColors.greenDark, AppColors.greenMid, AppColors.greenBright, AppColors.green].map((c, i) => (
            <View key={i} style={[styles.legendDot, { backgroundColor: c }]} />
          ))}
          <Text style={styles.legendText}>Recent</Text>
          <View style={[styles.legendDot, { backgroundColor: AppColors.orange }, glowShadow(AppColors.orange, 4)]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
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
  monthLabelsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  monthLabelsContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    flex: 1,
  },
  monthLabelText: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text25,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: 4,
    gap: 1.5,
  },
  dayLabelCell: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 2,
    width: 16,
  },
  dayLabelText: {
    fontFamily: AppFonts.mono,
    fontSize: 7,
    color: AppColors.text20,
  },
  weeksContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    flex: 1,
  },
  weekCol: {
    flexDirection: 'column',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 10,
  },
  legendText: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text25,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
  monthlySection: {
    marginTop: 20,
  },
  monthlyLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
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
    fontSize: 11,
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
    fontSize: 10,
    color: AppColors.text25,
    marginTop: 4,
  },
});
