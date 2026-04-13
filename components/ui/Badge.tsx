import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/config/ThemeProvider';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const { theme } = useTheme();

  const getColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'danger':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const color = getColor();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${color}22`,
          borderColor: `${color}44`,
          borderRadius: theme.borderRadius.full,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color, fontSize: theme.typography.small }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
