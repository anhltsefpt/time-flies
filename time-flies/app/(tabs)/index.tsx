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

function BlinkingColon() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 500, easing: Easing.steps(1) }),
        withTiming(1, { duration: 500, easing: Easing.steps(1) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.colonText, animatedStyle]}>:</Animated.Text>
  );
}

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

function ShimmerBar() {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(2, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value * 100}%` as any }],
  }));

  return (
    <Animated.View style={[styles.shimmerOverlay, animatedStyle]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

function fmtCountdown(totalSec: number): string {
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const { settings } = useSettings();
  const { data, clockParts } = useTimeData();
  const insets = useSafeAreaInsets();
  const now = new Date();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Clock display with split H:M:S */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.timeSection}>
          <Text style={styles.greeting}>
            {settings.name ? `${settings.name}, RIGHT NOW IT'S` : "RIGHT NOW IT'S"}
          </Text>
          <View style={styles.clockRow}>
            <Text style={styles.clockDigits}>{clockParts.hours}</Text>
            <BlinkingColon />
            <Text style={styles.clockDigits}>{clockParts.minutes}</Text>
            {settings.showSeconds && (
              <>
                <BlinkingColon />
                <Text style={styles.clockSeconds}>{clockParts.seconds}</Text>
              </>
            )}
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

        {/* Day Progress Ring Card */}
        <Animated.View entering={FadeInUp.delay(50).duration(500)}>
          <LinearGradient
            colors={['rgba(249,115,22,0.06)', 'rgba(251,146,60,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dayRingCard}>
            <View style={styles.dayRingRow}>
              <CircularRing
                progress={data.day.progress}
                size={64}
                strokeWidth={5}
                color={AppColors.orange}
                glowColor="rgba(249,115,22,0.27)">
                <Text style={styles.ringPercent}>
                  {data.day.progress.toFixed(1)}%
                </Text>
              </CircularRing>
              <View style={styles.dayRingInfo}>
                <Text style={styles.countdownLabel}>REMAINING</Text>
                <SecondsPulse>
                  <Text style={styles.countdownRemaining}>{fmtCountdown(data.seconds.todayLeft)}</Text>
                </SecondsPulse>
              </View>
            </View>
            {/* Full-width day bar with shimmer */}
            <View style={styles.dayBarContainer}>
              <View style={styles.dayBarTrack}>
                <View style={[styles.dayBarFillWrapper, { width: `${data.day.progress}%` as any }]}>
                  <LinearGradient
                    colors={[AppColors.orange, AppColors.orangeLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <ShimmerBar />
                </View>
              </View>
              <View style={styles.dayBarLabels}>
                <Text style={styles.dayBarTime}>00:00</Text>
                <Text style={styles.dayBarTime}>24:00</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Seconds Counter Banner */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.secondsBanner}>
          <SecondsPulse>
            <Text style={styles.secondsCount}>{data.seconds.today.toLocaleString()}</Text>
          </SecondsPulse>
          <Text style={styles.secondsLabel}>seconds passed today</Text>
        </Animated.View>

        {/* Awake progress card - PURPLE */}
        <Animated.View entering={FadeInUp.delay(150).duration(500)}>
          <LinearGradient
            colors={['rgba(139,92,246,0.06)', 'rgba(167,139,250,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.awakeCard}>
            <View style={styles.awakeHeader}>
              <View style={styles.awakeLabel}>
                <Text style={styles.awakeIcon}>⚡</Text>
                <Text style={styles.awakeLabelText}>Awake Time</Text>
              </View>
              <Text style={styles.awakeLeft}>{data.awake.left.toFixed(1)} hrs left</Text>
            </View>
            <View style={styles.awakeTrack}>
              <View style={[styles.awakeFillWrapper, { width: `${data.awake.progress}%` as any }]}>
                <LinearGradient
                  colors={[AppColors.purple, AppColors.purpleLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <ShimmerBar />
              </View>
            </View>
            <View style={styles.awakeFooter}>
              <Text style={styles.awakeElapsed}>{data.awake.elapsed.toFixed(1)}h used</Text>
              <View style={styles.awakePercentRow}>
                <Text style={styles.awakePercent}>{data.awake.progress.toFixed(1)}</Text>
                <Text style={styles.awakePercentSign}>%</Text>
              </View>
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

  // Clock
  timeSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
    marginBottom: 4,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  clockDigits: {
    fontFamily: AppFonts.monoBold,
    fontSize: 38,
    color: AppColors.text100,
    letterSpacing: -1,
  },
  colonText: {
    fontFamily: AppFonts.monoBold,
    fontSize: 36,
    color: AppColors.orange,
    marginHorizontal: 1,
  },
  clockSeconds: {
    fontFamily: AppFonts.monoBold,
    fontSize: 28,
    color: AppColors.orange,
  },
  dateText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text25,
    marginTop: 4,
  },

  // Day Progress Ring Card
  dayRingCard: {
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.1)',
  },
  dayRingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ringPercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 13,
    color: AppColors.orange,
  },
  dayRingInfo: {
    flex: 1,
  },
  countdownLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text25,
    letterSpacing: 1,
    marginBottom: 2,
  },
  countdownRemaining: {
    fontFamily: AppFonts.monoBold,
    fontSize: 18,
    color: AppColors.orange,
  },

  // Day bar
  dayBarContainer: {
    marginTop: 10,
  },
  dayBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 99,
    backgroundColor: AppColors.text06,
    overflow: 'hidden',
  },
  dayBarFillWrapper: {
    height: '100%',
    borderRadius: 99,
    overflow: 'hidden',
  },
  dayBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  dayBarTime: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text20,
  },

  // Shimmer
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '50%',
  },

  // Seconds banner
  secondsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(249,115,22,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.08)',
  },
  secondsCount: {
    fontFamily: AppFonts.monoBold,
    fontSize: 22,
    color: AppColors.orange,
  },
  secondsLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: AppColors.text25,
    marginLeft: 6,
  },

  // Awake card - purple
  awakeCard: {
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
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
    color: AppColors.purple,
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
  awakeFillWrapper: {
    height: '100%',
    borderRadius: 99,
    overflow: 'hidden',
  },
  awakeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 6,
  },
  awakeElapsed: {
    fontFamily: AppFonts.mono,
    fontSize: 10,
    color: AppColors.text25,
  },
  awakePercentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  awakePercent: {
    fontFamily: AppFonts.monoBold,
    fontSize: 18,
    color: AppColors.purple,
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
