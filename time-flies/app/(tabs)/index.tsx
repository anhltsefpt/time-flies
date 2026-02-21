import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { useTimeData } from '@/hooks/useTimeData';
import { AppHeader } from '@/components/AppHeader';
import { CircularRing } from '@/components/CircularRing';
import { DayHeatmap } from '@/components/DayHeatmap';
import { WeekHeatmap } from '@/components/WeekHeatmap';
import { ProgressBar } from '@/components/ProgressBar';

function SecondsPulse({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function fmtCountdown(totalSec: number): string {
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const { settings } = useSettings();
  const { data } = useTimeData();
  const insets = useSafeAreaInsets();
  const now = new Date();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero: Day Countdown */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.heroSection}>
          <Text style={styles.greeting}>
            {settings.name ? `${settings.name}, TODAY YOU HAVE` : 'TODAY YOU HAVE'}
          </Text>
          <View style={styles.heroRow}>
            <CircularRing
              progress={data.day.progress}
              size={72}
              strokeWidth={5}
              color={AppColors.orange}
              glowColor="rgba(249,115,22,0.27)">
              <Text style={styles.heroRingPercent}>
                {data.day.progress.toFixed(1)}%
              </Text>
            </CircularRing>
            <SecondsPulse>
              <Text style={styles.heroCountdown}>{fmtCountdown(data.seconds.todayLeft)}</Text>
            </SecondsPulse>
          </View>
          <Text style={styles.dateText}>
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </Animated.View>

        {/* Awake Time Card */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <LinearGradient
            colors={['rgba(139,92,246,0.06)', 'rgba(167,139,250,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.awakeCard}>
            <Text style={styles.awakeTitle}>AWAKE TIME REMAINING</Text>
            <View style={styles.awakeRow}>
              <CircularRing
                progress={data.awake.progress}
                size={64}
                strokeWidth={5}
                color={AppColors.purple}
                glowColor="rgba(167,139,250,0.27)">
                <Text style={styles.awakeRingPercent}>
                  {data.awake.progress.toFixed(0)}%
                </Text>
              </CircularRing>
              <View style={styles.awakeInfo}>
                <View style={styles.awakeHoursRow}>
                  <Text style={styles.awakeHoursLeft}>
                    {Math.floor(data.awake.left)}h
                  </Text>
                  <Text style={styles.awakeHoursTotal}>
                    / {data.awake.total}h
                  </Text>
                </View>
              </View>
            </View>
            {/* Hour dots */}
            <View style={styles.hourDotsRow}>
              {Array.from({ length: data.awake.total }, (_, i) => {
                const elapsedHours = Math.floor(data.awake.elapsed);
                const isCurrent = i === elapsedHours && data.awake.progress < 100;
                const isPast = i < elapsedHours;
                return (
                  <View
                    key={i}
                    style={[
                      styles.hourDot,
                      isPast && styles.hourDotPast,
                      isCurrent && styles.hourDotCurrent,
                      !isPast && !isCurrent && styles.hourDotFuture,
                    ]}
                  />
                );
              })}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Day Heatmap */}
        <DayHeatmap
          currentHour={now.getHours()}
          currentMinute={now.getMinutes()}
          currentSecond={now.getSeconds()}
          settings={settings}
        />

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

  // Hero section
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  heroRingPercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 14,
    color: AppColors.orange,
  },
  heroCountdown: {
    fontFamily: AppFonts.monoBold,
    fontSize: 36,
    color: AppColors.orange,
    letterSpacing: -1,
  },
  dateText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text25,
    marginTop: 8,
  },

  // Awake card
  awakeCard: {
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
  },
  awakeTitle: {
    fontFamily: AppFonts.mono,
    fontSize: 13,
    color: AppColors.text25,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  awakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  awakeRingPercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 13,
    color: AppColors.purple,
  },
  awakeInfo: {
    flex: 1,
  },
  awakeHoursRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  awakeHoursLeft: {
    fontFamily: AppFonts.monoBold,
    fontSize: 36,
    color: AppColors.purple,
  },
  awakeHoursTotal: {
    fontFamily: AppFonts.monoMedium,
    fontSize: 18,
    color: AppColors.text35,
  },

  // Hour dots
  hourDotsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    justifyContent: 'center',
  },
  hourDot: {
    flex: 1,
    height: 8,
    borderRadius: 2,
  },
  hourDotPast: {
    backgroundColor: AppColors.purple,
    opacity: 0.45,
  },
  hourDotCurrent: {
    backgroundColor: AppColors.purple,
    shadowColor: AppColors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  hourDotFuture: {
    backgroundColor: AppColors.text06,
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
