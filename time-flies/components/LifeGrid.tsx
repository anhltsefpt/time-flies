import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';
import { getLifePhases } from '@/data/life-phases';
import { glowShadow } from '@/utils/shadow';
import type { Settings } from '@/types';

interface LifeGridProps {
  settings: Settings;
}

export function LifeGrid({ settings }: LifeGridProps) {
  const { birthYear, lifeExpectancy } = settings;
  const now = new Date();
  const currentAge = now.getFullYear() - birthYear + (now.getMonth() >= 6 ? 0.5 : 0);
  const livedYears = Math.floor(currentAge);
  const currentYearProgress = currentAge - livedYears;
  const phases = getLifePhases(lifeExpectancy);
  const getPhase = (yr: number) => phases.find((p) => yr >= p.range[0] && yr < p.range[1]);
  const currentPhase = getPhase(livedYears);

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>YOUR LIFE</Text>
        <View style={styles.ageRow}>
          <Text style={styles.ageValue}>{livedYears}</Text>
          <Text style={styles.ageTotal}>/ {lifeExpectancy} years</Text>
        </View>
        {currentPhase && (
          <View style={[styles.phaseBadge, { backgroundColor: `${currentPhase.color}15`, borderColor: `${currentPhase.color}30` }]}>
            <View style={[styles.phaseDot, { backgroundColor: currentPhase.color }]} />
            <Text style={[styles.phaseLabel, { color: currentPhase.color }]}>{currentPhase.label}</Text>
          </View>
        )}
      </View>

      {/* Life grid */}
      <View style={styles.card}>
        <View style={styles.gridContainer}>
          {Array.from({ length: lifeExpectancy }, (_, yr) => {
            const phase = getPhase(yr);
            const isLived = yr < livedYears;
            const isCurrent = yr === livedYears;
            const color = phase?.color || '#666';

            return (
              <View
                key={yr}
                style={[
                  styles.gridCell,
                  {
                    backgroundColor: isLived ? color : isCurrent ? `${color}88` : AppColors.text04,
                    opacity: isLived ? 0.85 : isCurrent ? 1 : 0.6,
                  },
                  isCurrent && glowShadow(color, 8),
                ]}>
                {isCurrent && (
                  <View
                    style={[
                      styles.currentFill,
                      {
                        height: `${currentYearProgress * 100}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Age scale */}
        <View style={styles.ageScale}>
          {Array.from({ length: Math.ceil(lifeExpectancy / 10) + 1 }, (_, i) => i * 10)
            .filter((d) => d <= lifeExpectancy)
            .map((d) => (
              <Text key={d} style={styles.ageScaleText}>{d}</Text>
            ))}
        </View>

        {/* Phase legend */}
        <View style={styles.legendRow}>
          {phases.map((p, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: p.color }]} />
              <Text style={styles.legendLabel}>{p.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Phase progress bars */}
      <View style={styles.phaseBars}>
        {phases.map((p, i) => {
          const duration = p.range[1] - p.range[0];
          const lived = Math.max(0, Math.min(livedYears - p.range[0], duration));
          const pct = (lived / duration) * 100;
          const isActive = livedYears >= p.range[0] && livedYears < p.range[1];

          return (
            <View key={i} style={styles.phaseBarContainer}>
              <View style={styles.phaseBarHeader}>
                <View style={styles.phaseBarLeft}>
                  <View
                    style={[
                      styles.phaseBarDot,
                      {
                        backgroundColor: p.color,
                        opacity: isActive ? 1 : 0.5,
                      },
                      isActive && glowShadow(p.color, 6),
                    ]}
                  />
                  <Text style={[styles.phaseBarLabel, isActive && { color: p.color, fontFamily: AppFonts.outfitSemiBold }]}>
                    {p.label}
                  </Text>
                  <Text style={styles.phaseBarRange}>{p.range[0]}–{p.range[1]}</Text>
                </View>
                <Text style={[styles.phaseBarPct, isActive && { color: p.color }]}>
                  {Math.min(pct, 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.phaseBarTrack}>
                <View
                  style={[
                    styles.phaseBarFill,
                    {
                      width: `${Math.min(pct, 100)}%` as any,
                      backgroundColor: p.color,
                      opacity: pct >= 100 ? 0.5 : 0.85,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  headerLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
    marginBottom: 6,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  ageValue: {
    fontFamily: AppFonts.monoBold,
    fontSize: 44,
    color: AppColors.text100,
  },
  ageTotal: {
    fontFamily: AppFonts.outfit,
    fontSize: 16,
    color: AppColors.text25,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
  },
  card: {
    backgroundColor: AppColors.surfaceBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
  },
  gridCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
    overflow: 'hidden',
  },
  currentFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    opacity: 0.9,
  },
  ageScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ageScaleText: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text20,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    opacity: 0.85,
  },
  legendLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 9,
    color: AppColors.text35,
  },
  phaseBars: {
    marginTop: 20,
  },
  phaseBarContainer: {
    marginBottom: 14,
  },
  phaseBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  phaseBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phaseBarDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  phaseBarLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
  },
  phaseBarRange: {
    fontFamily: AppFonts.mono,
    fontSize: 10,
    color: AppColors.text20,
  },
  phaseBarPct: {
    fontFamily: AppFonts.mono,
    fontSize: 12,
    color: AppColors.text25,
  },
  phaseBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 99,
    backgroundColor: AppColors.text04,
    overflow: 'hidden',
  },
  phaseBarFill: {
    height: '100%',
    borderRadius: 99,
  },
});
