import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AppColors, AppFonts } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { AppHeader } from '@/components/AppHeader';
import { SettingSlider } from '@/components/SettingSlider';
import { SettingToggle } from '@/components/SettingToggle';

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();
  const insets = useSafeAreaInsets();

  const sleepHours =
    settings.sleepStart > settings.sleepEnd
      ? 24 - settings.sleepStart + settings.sleepEnd
      : settings.sleepEnd - settings.sleepStart;
  const awakeHours = 24 - sleepHours;
  const age = new Date().getFullYear() - settings.birthYear;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerSection}>
          <Text style={styles.headerLabel}>SETTINGS</Text>
        </Animated.View>

        {/* Profile Section */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
          <Text style={styles.sectionTitle}>👤 PROFILE</Text>
          <View style={styles.nameSection}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.textInput}
              value={settings.name}
              onChangeText={(v) => updateSetting('name', v)}
              placeholder="Enter your name..."
              placeholderTextColor={AppColors.text25}
            />
          </View>
          <SettingSlider
            label="Birth Year"
            value={settings.birthYear}
            min={1940}
            max={2015}
            onChange={(v) => updateSetting('birthYear', v)}
            format={(v) => `${v} (age ${new Date().getFullYear() - v})`}
            icon="🎂"
            color={AppColors.blueLight}
          />
          <SettingSlider
            label="Life Expectancy"
            value={settings.lifeExpectancy}
            min={50}
            max={120}
            onChange={(v) => updateSetting('lifeExpectancy', v)}
            format={(v) => `${v} years`}
            icon="🎯"
            color="#34D399"
          />
        </Animated.View>

        {/* Sleep Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <LinearGradient
            colors={['rgba(99,102,241,0.06)', 'rgba(99,102,241,0.02)']}
            style={styles.sleepCard}>
            <Text style={styles.sectionTitle}>😴 SLEEP SCHEDULE</Text>
            <SettingSlider
              label="Bedtime"
              value={settings.sleepStart}
              min={20}
              max={26}
              onChange={(v) => updateSetting('sleepStart', v > 23 ? v - 24 : v)}
              format={(v) => {
                const h = v > 23 ? v - 24 : v;
                return `${String(h).padStart(2, '0')}:00`;
              }}
              icon="🌙"
              color={AppColors.indigo}
            />
            <SettingSlider
              label="Wake Up"
              value={settings.sleepEnd}
              min={4}
              max={12}
              onChange={(v) => updateSetting('sleepEnd', v)}
              format={(v) => `${String(v).padStart(2, '0')}:00`}
              icon="🌅"
              color={AppColors.orange}
            />

            {/* Sleep visualization */}
            <View style={styles.sleepViz}>
              <View style={styles.sleepBars}>
                {Array.from({ length: 24 }, (_, h) => {
                  const isSleep =
                    settings.sleepStart > settings.sleepEnd
                      ? h >= settings.sleepStart || h < settings.sleepEnd
                      : h >= settings.sleepStart && h < settings.sleepEnd;
                  return (
                    <View
                      key={h}
                      style={[
                        styles.sleepBar,
                        {
                          backgroundColor: isSleep ? AppColors.indigo : 'rgba(249,115,22,0.27)',
                          opacity: isSleep ? 0.7 : 0.25,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <View style={styles.sleepHourLabels}>
                {[0, 6, 12, 18, 23].map((h) => (
                  <Text key={h} style={styles.sleepHourLabel}>
                    {String(h).padStart(2, '0')}h
                  </Text>
                ))}
              </View>
            </View>

            {/* Sleep summary */}
            <View style={styles.sleepSummaryRow}>
              <View style={[styles.sleepSummaryCard, { backgroundColor: 'rgba(99,102,241,0.1)' }]}>
                <Text style={[styles.sleepSummaryValue, { color: AppColors.indigo }]}>{sleepHours}h</Text>
                <Text style={styles.sleepSummaryLabel}>Sleep</Text>
              </View>
              <View style={[styles.sleepSummaryCard, { backgroundColor: 'rgba(249,115,22,0.1)' }]}>
                <Text style={[styles.sleepSummaryValue, { color: AppColors.orange }]}>{awakeHours}h</Text>
                <Text style={styles.sleepSummaryLabel}>Awake</Text>
              </View>
              <View style={[styles.sleepSummaryCard, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                <Text style={[styles.sleepSummaryValue, { color: AppColors.green }]}>
                  {(awakeHours * 365).toLocaleString()}h
                </Text>
                <Text style={styles.sleepSummaryLabel}>Awake/yr</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 NOTIFICATIONS</Text>
          <SettingToggle
            label="Milestone Alerts"
            value={settings.notifyMilestones}
            onChange={() => updateSetting('notifyMilestones', !settings.notifyMilestones)}
            icon="🏁"
            description={'"2026 is now 50% over!"'}
          />
          <SettingToggle
            label="Daily Reminder"
            value={settings.notifyDaily}
            onChange={() => updateSetting('notifyDaily', !settings.notifyDaily)}
            icon="⏰"
            description="Get a daily nudge"
          />
          {settings.notifyDaily && (
            <View style={styles.indentedSlider}>
              <SettingSlider
                label="Reminder Time"
                value={settings.dailyNotifyTime}
                min={6}
                max={22}
                onChange={(v) => updateSetting('dailyNotifyTime', v)}
                format={(v) => `${String(v).padStart(2, '0')}:00`}
                icon="🕐"
                color={AppColors.yellow}
              />
            </View>
          )}
        </Animated.View>

        {/* Display */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.card}>
          <Text style={styles.sectionTitle}>🎨 DISPLAY</Text>
          <SettingToggle
            label="Show Seconds"
            value={settings.showSeconds}
            onChange={() => updateSetting('showSeconds', !settings.showSeconds)}
            icon="⏱"
            description="Show seconds on the clock"
          />
          <SettingToggle
            label="Life Tab"
            value={settings.showLifeTab}
            onChange={() => updateSetting('showLifeTab', !settings.showLifeTab)}
            icon="👤"
            description="Show life tab in navigation"
          />
        </Animated.View>

        {/* Life stats */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <LinearGradient
            colors={['rgba(245,158,11,0.06)', 'rgba(236,72,153,0.04)']}
            style={styles.lifeStatsCard}>
            <Text style={styles.sectionTitle}>📊 LIFETIME STATS</Text>
            {[
              {
                label: 'Time Alive',
                value: `${age} years`,
                sub: `${(age * 365).toLocaleString()} days`,
                color: AppColors.amber,
              },
              {
                label: 'Awake Time',
                value: `${(age * awakeHours * 365).toLocaleString()}h`,
                sub: `${Math.floor((age * awakeHours * 365) / 24).toLocaleString()} days`,
                color: AppColors.orange,
              },
              {
                label: 'Time Asleep',
                value: `${(age * sleepHours * 365).toLocaleString()}h`,
                sub: `${Math.floor((age * sleepHours * 365) / 24).toLocaleString()} days`,
                color: AppColors.indigo,
              },
              {
                label: 'Est. Heartbeats',
                value: `${(age * 365 * 24 * 60 * 72).toExponential(1)}`,
                sub: 'beats (72 bpm avg)',
                color: AppColors.pink,
              },
            ].map((s, i) => (
              <View
                key={i}
                style={[styles.statRow, i < 3 && styles.statRowBorder]}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <View style={styles.statRight}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statSub}>{s.sub}</Text>
                </View>
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* App info */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.appInfo}>
          <Text style={styles.appName}>⏳ Time Flies</Text>
          <Text style={styles.appVersion}>v1.0.0 • Made with ❤️</Text>
          <Text style={styles.appMotto}>Every second counts.</Text>
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
    paddingBottom: 120,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  headerLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text35,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: AppColors.surfaceBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.surfaceBorder,
    marginBottom: 16,
  },
  sleepCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.12)',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: AppColors.text25,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  nameSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: AppColors.text04,
    borderWidth: 1,
    borderColor: AppColors.text08,
    color: AppColors.text100,
    fontFamily: AppFonts.outfit,
    fontSize: 14,
  },
  sleepViz: {
    marginTop: 8,
    paddingVertical: 12,
  },
  sleepBars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  sleepBar: {
    flex: 1,
    height: 16,
    borderRadius: 2,
  },
  sleepHourLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sleepHourLabel: {
    fontFamily: AppFonts.mono,
    fontSize: 8,
    color: AppColors.text20,
  },
  sleepSummaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  sleepSummaryCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  sleepSummaryValue: {
    fontFamily: AppFonts.monoBold,
    fontSize: 18,
  },
  sleepSummaryLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 10,
    color: AppColors.text25,
    marginTop: 2,
  },
  indentedSlider: {
    paddingLeft: 34,
    marginTop: 8,
  },
  lifeStatsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.text04,
  },
  statLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text50,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontFamily: AppFonts.monoMedium,
    fontSize: 14,
  },
  statSub: {
    fontFamily: AppFonts.mono,
    fontSize: 9,
    color: AppColors.text20,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  appName: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 16,
    color: AppColors.text50,
  },
  appVersion: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text20,
    marginTop: 4,
  },
  appMotto: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: AppColors.text15,
    marginTop: 8,
  },
});
