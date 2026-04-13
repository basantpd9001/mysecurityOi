import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/utils/constants';

const FEATURES = [
  {
    icon: 'camera' as const,
    title: 'Intruder Detection',
    description: 'Capture photos & location on failed unlock attempts',
  },
  {
    icon: 'lock-closed' as const,
    title: 'App Lock',
    description: 'Protect individual apps with PIN or biometrics',
  },
  {
    icon: 'timer' as const,
    title: 'Focus Mode',
    description: 'Block distractions and maximize productivity',
  },
];

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoWrapper,
              {
                backgroundColor: `${theme.colors.primary}22`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={80} color={theme.colors.primary} />
          </View>
          <Text
            style={[
              styles.appName,
              {
                color: theme.colors.text,
                fontSize: theme.typography.h1,
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            {APP_NAME}
          </Text>
          <Text
            style={[
              styles.tagline,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.body,
                marginTop: theme.spacing.sm,
              },
            ]}
          >
            Your Phone. Your Rules. Your Safety.
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.featuresContainer, { marginTop: theme.spacing.xl }]}>
          {FEATURES.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureItem,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconWrapper,
                  {
                    backgroundColor: `${theme.colors.primary}22`,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.spacing.sm,
                  },
                ]}
              >
                <Ionicons name={feature.icon} size={28} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text
                  style={[
                    styles.featureTitle,
                    { color: theme.colors.text, fontSize: theme.typography.body },
                  ]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDesc,
                    { color: theme.colors.textSecondary, fontSize: theme.typography.caption },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={[styles.ctaContainer, { marginTop: theme.spacing.xl }]}>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding/set-pin')}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 },
  logoContainer: { alignItems: 'center' },
  logoWrapper: {},
  appName: { fontWeight: '800', letterSpacing: 1 },
  tagline: { textAlign: 'center' },
  featuresContainer: {},
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIconWrapper: {},
  featureText: { flex: 1, marginLeft: 12 },
  featureTitle: { fontWeight: '600', marginBottom: 2 },
  featureDesc: { lineHeight: 18 },
  ctaContainer: { paddingBottom: 16 },
});
