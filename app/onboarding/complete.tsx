import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { AppTheme } from '@/types';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSecurityStore } from '@/store/useSecurityStore';

export default function OnboardingCompleteScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { setFirstLaunchComplete } = useAuthStore();
  const { emergencyContacts } = useSecurityStore();

  const handleGoToDashboard = () => {
    setFirstLaunchComplete();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: `${theme.colors.success}22`,
              borderRadius: theme.borderRadius.full,
              width: 120,
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
        </View>

        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: theme.typography.h1, marginTop: theme.spacing.xl },
          ]}
        >
          You&apos;re All Set!
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.colors.textSecondary, fontSize: theme.typography.body, marginTop: theme.spacing.sm },
          ]}
        >
          SecureGuard is now protecting your phone
        </Text>

        {/* Summary */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.lg,
              marginTop: theme.spacing.xl,
              width: '100%',
            },
          ]}
        >
          <SummaryRow
            icon="people"
            label="Emergency Contacts"
            value={`${emergencyContacts.length} added`}
            theme={theme}
          />
          <SummaryRow
            icon="shield-checkmark"
            label="Intruder Detection"
            value="Enabled"
            theme={theme}
            valueColor={theme.colors.success}
          />
          <SummaryRow
            icon="lock-closed"
            label="PIN Protection"
            value="Configured"
            theme={theme}
            valueColor={theme.colors.success}
          />
        </View>

        <View style={[styles.ctaContainer, { marginTop: theme.spacing.xl, width: '100%' }]}>
          <Button title="Go to Dashboard" onPress={handleGoToDashboard} fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  theme,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: AppTheme;
  valueColor?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={{ flex: 1, color: theme.colors.text, marginLeft: 12, fontSize: theme.typography.body }}>
        {label}
      </Text>
      <Text style={{ color: valueColor ?? theme.colors.textSecondary, fontSize: theme.typography.caption, fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconWrapper: {},
  title: { fontWeight: '800', textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  summaryCard: {},
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ctaContainer: {},
});
