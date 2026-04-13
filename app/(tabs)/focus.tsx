import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';

export default function FocusScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Ionicons name="timer" size={72} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.h2, marginTop: theme.spacing.lg }]}>
          Coming Soon
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.typography.body, marginTop: theme.spacing.sm }]}>
          Module 4: Focus Mode
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.md }]}>
          Block distracting apps and set focus sessions to boost productivity.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontWeight: '700' },
  subtitle: { fontWeight: '600' },
  description: { textAlign: 'center', lineHeight: 20 },
});
