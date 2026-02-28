import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Settings } from '@/types';
import { DEFAULT_SETTINGS } from '@/utils/time';
import { track, setUserProperties } from '@/utils/analytics';

const STORAGE_KEY = 'finite-settings';

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const didSetInitialProps = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const merged = stored ? (() => { try { return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }; } catch { return DEFAULT_SETTINGS; } })() : DEFAULT_SETTINGS;
      if (!merged.firstOpenDate) {
        merged.firstOpenDate = new Date().toISOString().split('T')[0];
      }
      setSettings(merged);
      setIsLoaded(true);
    }).catch(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded && !didSetInitialProps.current) {
      didSetInitialProps.current = true;
      setUserProperties({
        birth_year: settings.birthYear,
        life_expectancy: settings.lifeExpectancy,
        sleep_start: settings.sleepStart,
        sleep_end: settings.sleepEnd,
        show_life_tab: settings.showLifeTab,
        show_seconds: settings.showSeconds,
        has_name: !!settings.name,
        first_open_date: settings.firstOpenDate,
      });
    }
  }, [isLoaded]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    track('setting_changed', { key, value });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
