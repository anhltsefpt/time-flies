import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { AppColors, AppFonts } from '@/constants/theme';

interface SettingToggleProps {
  label: string;
  value: boolean;
  onChange: () => void;
  icon: string;
  description?: string;
}

export function SettingToggle({ label, value, onChange, icon, description }: SettingToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textCol}>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: AppColors.text10, true: AppColors.green }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.text04,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  icon: {
    fontSize: 16,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontFamily: AppFonts.outfit,
    fontSize: 14,
    color: AppColors.text70,
  },
  description: {
    fontFamily: AppFonts.outfit,
    fontSize: 11,
    color: AppColors.text25,
    marginTop: 2,
  },
});
