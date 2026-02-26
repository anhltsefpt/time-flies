import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { AppColors } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { track } from '@/utils/analytics';

export default function TabLayout() {
  const { settings } = useSettings();

  return (
    <Tabs
      screenListeners={{
        state: (e) => {
          const state = e.data.state;
          const route = state.routes[state.index];
          track('tab_changed', { tab: route.name });
        },
      }}
      screenOptions={{
        tabBarActiveTintColor: AppColors.orange,
        tabBarInactiveTintColor: AppColors.text35,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: AppColors.background,
          borderTopColor: AppColors.surfaceBorder,
          borderTopWidth: 1,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Outfit-Medium',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⏱</Text>,
        }}
      />
      <Tabs.Screen
        name="year"
        options={{
          title: 'Year',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🟩</Text>,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="life"
        options={{
          title: 'Life',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          href: settings.showLifeTab ? '/life' : null,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text>,
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
