import React, { useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Linking, TouchableOpacity, Platform, Image, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { AppColors, AppFonts } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { track } from '@/utils/analytics';
import { SettingSlider } from '@/components/SettingSlider';
import { SettingToggle } from '@/components/SettingToggle';

let hasAnimated = false;

export default function SettingsScreen() {
  const { settings, updateSetting } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const shouldAnimate = useRef(!hasAnimated);
  hasAnimated = true;

  const entering = (animation: ReturnType<typeof FadeInDown.duration>) =>
    shouldAnimate.current ? animation : undefined;

  const handleContact = () => {
    track('feedback_pressed');
    const subject = encodeURIComponent('Finite App Feedback');
    const body = encodeURIComponent(
      `Hi Finite team,\n\n[Describe your feedback, feature request, or bug report here]\n\n---\nApp: Finite v${Constants.expoConfig?.version ?? '1.0.0'}\nPlatform: ${Platform.OS}`
    );
    Linking.openURL(`mailto:contact@finite.app?subject=${subject}&body=${body}`);
  };

  const sleepHours =
    settings.sleepStart > settings.sleepEnd
      ? 24 - settings.sleepStart + settings.sleepEnd
      : settings.sleepEnd - settings.sleepStart;
  const awakeHours = 24 - sleepHours;
  const age = new Date().getFullYear() - settings.birthYear;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag">
        {/* Header */}
        <Animated.View entering={entering(FadeInDown.duration(600))} style={styles.headerSection}>
          <Text style={styles.headerLabel}>SETTINGS</Text>
        </Animated.View>

        {/* Premium Card */}
        <Animated.View entering={entering(FadeInUp.duration(500))}>
          <TouchableOpacity onPress={() => router.push('/paywall')} activeOpacity={0.8}>
            <LinearGradient
              colors={['rgba(249,115,22,0.12)', 'rgba(249,115,22,0.04)']}
              style={styles.premiumCard}>
              <View style={styles.premiumContent}>
                <Text style={styles.premiumIcon}>{'\u2B50'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTitle}>Finite Premium</Text>
                  <Text style={styles.premiumDesc}>Unlock all features</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={AppColors.orange} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Section */}
        <Animated.View entering={entering(FadeInUp.duration(500))} style={styles.card}>
          <Text style={styles.sectionTitle}>👤 PROFILE</Text>
          <View style={styles.nameSection}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.textInput}
              value={settings.name}
              onChangeText={(v) => updateSetting('name', v)}
              placeholder="Enter your name..."
              placeholderTextColor={AppColors.text25}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <SettingSlider
            label="Birth Year"
            value={settings.birthYear}
            min={1920}
            max={new Date().getFullYear() - 10}
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
        <Animated.View entering={entering(FadeInUp.delay(100).duration(500))}>
          <LinearGradient
            colors={['rgba(99,102,241,0.06)', 'rgba(99,102,241,0.02)']}
            style={styles.sleepCard}>
            <Text style={styles.sectionTitle}>😴 SLEEP SCHEDULE</Text>
            <SettingSlider
              label="Bedtime"
              value={settings.sleepStart < 4 ? settings.sleepStart + 24 : settings.sleepStart}
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

        {/* Display */}
        <Animated.View entering={entering(FadeInUp.delay(200).duration(500))} style={styles.card}>
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
        <Animated.View entering={entering(FadeInUp.delay(300).duration(500))}>
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
            ].map((s, i, arr) => (
              <View
                key={i}
                style={[styles.statRow, i < arr.length - 1 && styles.statRowBorder]}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <View style={styles.statRight}>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statSub}>{s.sub}</Text>
                </View>
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* Contact & Feedback */}
        <Animated.View entering={entering(FadeInUp.delay(350).duration(500))} style={styles.contactCard}>
          <Text style={styles.sectionTitle}>✉️ CONTACT & FEEDBACK</Text>
          <Text style={styles.contactDescription}>
            Have a suggestion or found a bug? We'd love to hear from you.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.7}>
            <Text style={styles.contactButtonText}>Send Feedback</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App info */}
        <Animated.View entering={entering(FadeInUp.delay(400).duration(500))} style={styles.appInfo}>
          <Image source={require('@/assets/images/icon-transparent.png')} style={styles.appIcon} />
          <Text style={styles.appName}>Finite</Text>
          <Text style={styles.appVersion}>v{Constants.expoConfig?.version ?? '1.0.0'} • Made with ❤️</Text>
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
  premiumCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.2)',
    marginBottom: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumIcon: {
    fontSize: 24,
  },
  premiumTitle: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 15,
    color: AppColors.text85,
  },
  premiumDesc: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
    marginTop: 2,
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
  contactCard: {
    backgroundColor: AppColors.surfaceBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.2)',
    marginTop: 16,
    marginBottom: 16,
  },
  contactDescription: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text50,
    marginBottom: 14,
    lineHeight: 18,
  },
  contactButton: {
    backgroundColor: 'rgba(59,130,246,0.12)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 14,
    color: '#3B82F6',
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
  appIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
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
