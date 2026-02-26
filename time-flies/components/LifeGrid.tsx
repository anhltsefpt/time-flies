import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';
import { getLifePhases } from '@/data/life-phases';
import { glowShadow } from '@/utils/shadow';
import type { Settings } from '@/types';

interface LifeGridProps {
  settings: Settings;
}

export function LifeGrid({ settings }: LifeGridProps) {
  const { birthYear, lifeExpectancy } = settings;
  const { width: screenWidth } = useWindowDimensions();
  const now = new Date();
  const currentAge = now.getFullYear() - birthYear + (now.getMonth() >= 6 ? 0.5 : 0);
  const livedYears = Math.floor(currentAge);
  const currentYearProgress = currentAge - livedYears;
  const phases = getLifePhases(lifeExpectancy);
  const getPhase = (yr: number) => phases.find((p) => yr >= p.range[0] && yr < p.range[1]);
  const currentPhase = getPhase(livedYears);

  // Dynamic cell size: fit 10 cells in available width
  const scrollPadding = 40;
  const cardPadding = 28;
  const labelWidth = 24;
  const labelGap = 6;
  const dotGap = 3;
  const available = screenWidth - scrollPadding - cardPadding - labelWidth - labelGap;
  const cellSize = Math.max(Math.floor((available - dotGap * 9) / 10), 8);

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

      {/* Life grid — phase-grouped rows */}
      <View style={styles.card}>
        {phases.map((phase, pi) => {
          const phaseYears = phase.range[1] - phase.range[0];
          const rowCount = Math.ceil(phaseYears / 10);

          return (
            <View key={pi} style={[styles.phaseGroup, pi === phases.length - 1 && { marginBottom: 0 }]}>
              <View style={styles.phaseGroupHeader}>
                <Text style={[styles.phaseGroupLabel, { color: phase.color }]}>{phase.label}</Text>
                <Text style={[styles.phaseGroupPct, { color: phase.color }]}>
                  ({Math.max(0, Math.min(livedYears - phase.range[0], phaseYears))}/{phaseYears} years)
                </Text>
              </View>
              {Array.from({ length: rowCount }, (_, r) => {
                const rowStart = phase.range[0] + r * 10;
                const rowEnd = Math.min(rowStart + 10, phase.range[1]);
                const cellCount = rowEnd - rowStart;

                return (
                  <View key={r} style={styles.cellRow}>
                    <Text style={styles.rowLabel}>{rowStart}</Text>
                    <View style={styles.cellsRow}>
                      {Array.from({ length: cellCount }, (_, i) => {
                        const yr = rowStart + i;
                        const isLived = yr < livedYears;
                        const isCurrent = yr === livedYears;
                        const color = phase.color;

                        return (
                          <View
                            key={yr}
                            style={[
                              {
                                width: cellSize,
                                height: cellSize,
                                borderRadius: cellSize / 4,
                                overflow: 'hidden',
                                backgroundColor: isLived ? color : isCurrent ? `${color}88` : AppColors.text10,
                                opacity: isLived ? 0.85 : isCurrent ? 1 : 0.6,
                              },
                              isCurrent && glowShadow(color, 8),
                            ]}>
                            {isCurrent && (
                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: `${currentYearProgress * 100}%` as any,
                                  backgroundColor: color,
                                  borderBottomLeftRadius: cellSize / 4,
                                  borderBottomRightRadius: cellSize / 4,
                                  opacity: 0.9,
                                }}
                              />
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
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
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    overflow: 'hidden',
  },
  phaseGroup: {
    marginBottom: 12,
  },
  phaseGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft: 30,
  },
  phaseGroupLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
  },
  phaseGroupPct: {
    fontFamily: AppFonts.mono,
    fontSize: 10,
    opacity: 0.6,
  },
  cellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowLabel: {
    width: 24,
    marginRight: 6,
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: AppColors.text25,
  },
  cellsRow: {
    flexDirection: 'row',
    gap: 3,
    flex: 1,
  },
});
