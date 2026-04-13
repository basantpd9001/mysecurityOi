import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { Badge } from './Badge';

interface PermissionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  granted: boolean;
  onGrant: () => void;
}

export function PermissionCard({ icon, title, description, granted, onGrant }: PermissionCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: granted ? `${theme.colors.success}44` : theme.colors.border,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.sm,
        },
      ]}
    >
      <View style={styles.iconRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${theme.colors.primary}22`,
              borderRadius: theme.borderRadius.sm,
              padding: theme.spacing.sm,
            },
          ]}
        >
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.body }]}>
            {title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary, fontSize: theme.typography.caption }]}>
            {description}
          </Text>
        </View>
        {granted ? (
          <Badge label="Granted" variant="success" />
        ) : (
          <TouchableOpacity
            onPress={onGrant}
            style={[
              styles.grantButton,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
                paddingVertical: 6,
                paddingHorizontal: theme.spacing.sm,
              },
            ]}
          >
            <Text style={styles.grantText}>Grant</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {},
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    lineHeight: 18,
  },
  grantButton: {},
  grantText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
