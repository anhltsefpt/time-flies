import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { useTimeData } from '@/hooks/useTimeData';
import { AppHeader } from '@/components/AppHeader';
import { DayHeatmap } from '@/components/DayHeatmap';
import { WeekHeatmap } from '@/components/WeekHeatmap';
import { ProgressBar } from '@/components/ProgressBar';

export default function HomeScreen() {
  const { settings } = useSettings();
  const { data, currentTime } = useTimeData();
  const insets = useSafeAreaInsets();
  const now = new Date();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Time display */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.timeSection}>
          <Text style={styles.greeting}>
            {settings.name ? `${settings.name}, RIGHT NOW IT'S` : "RIGHT NOW IT'S"}
          </Text>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.dateText}>
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </Animated.View>

        {/* Awake progress card */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.awakeCard}>
          <View style={styles.awakeHeader}>
            <View style={styles.awakeLabel}>
              <Text style={styles.awakeIcon}>⚡</Text>
              <Text style={styles.awakeLabelText}>Awake Time</Text>
            </View>
            <Text style={styles.awakeLeft}>{data.awake.left.toFixed(1)} hrs left</Text>
          </View>
          <View style={styles.awakeTrack}>
            <LinearGradient
              colors={[AppColors.orange, AppColors.orangeLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.awakeFill, { width: `${data.awake.progress}%` as any }]}
            />
          </View>
          <View style={styles.awakePercentRow}>
            <Text style={styles.awakePercent}>{data.awake.progress.toFixed(1)}</Text>
            <Text style={styles.awakePercentSign}>%</Text>
          </View>
        </Animated.View>

        {/* Day Heatmap */}
        <DayHeatmap currentHour={now.getHours()} currentMinute={now.getMinutes()} settings={settings} />

        <View style={styles.spacer} />

        {/* Week Heatmap */}
        <WeekHeatmap data={data} />

        {/* Month & Year progress */}
        <View style={styles.progressSection}>
          <ProgressBar
            label="THIS MONTH"
            progress={data.month.progress}
            left={data.month.left}
            unit={data.month.unit}
            color={AppColors.purple}
            glowColor={AppColors.purpleLight}
            delay={400}
            icon="🗓️"
          />
          <ProgressBar
            label="THIS YEAR"
            progress={data.year.progress}
            left={data.year.left}
            unit={data.year.unit}
            color={AppColors.pink}
            glowColor={AppColors.pinkLight}
            delay={550}
            icon="⏳"
          />
        </View>

        {/* Life progress card */}
        <Animated.View entering={FadeInUp.delay(700).duration(800)}>
          <LinearGradient
            colors={['rgba(245,158,11,0.08)', 'rgba(239,68,68,0.06)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lifeCard}>
            <ProgressBar
              label="YOUR LIFE"
              progress={data.life.progress}
              left={data.life.left}
              unit={data.life.unit}
              color={AppColors.amber}
              glowColor={AppColors.yellow}
              delay={700}
              icon="🔥"
            />
            <Text style={styles.lifeNote}>
              Based on avg. life expectancy of {settings.lifeExpectancy} years
            </Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  timeSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: AppFonts.monoBold,
    fontSize: 36,
    color: AppColors.text100,
    letterSpacing: -1,
  },
  dateText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text25,
    marginTop: 4,
  },
  awakeCard: {
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.1)',
    backgroundColor: 'rgba(249,115,22,0.04)',
  },
  awakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  awakeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  awakeIcon: {
    fontSize: 14,
  },
  awakeLabelText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 13,
    color: AppColors.orange,
  },
  awakeLeft: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
  },
  awakeTrack: {
    width: '100%',
    height: 10,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    overflow: 'hidden',
  },
  awakeFill: {
    height: '100%',
    borderRadius: 99,
  },
  awakePercentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 4,
  },
  awakePercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 18,
    color: AppColors.orange,
  },
  awakePercentSign: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
  },
  spacer: {
    height: 16,
  },
  progressSection: {
    marginTop: 20,
  },
  lifeCard: {
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.12)',
  },
  lifeNote: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text25,
    textAlign: 'center',
    marginTop: -8,
    fontStyle: 'italic',
  },
});
