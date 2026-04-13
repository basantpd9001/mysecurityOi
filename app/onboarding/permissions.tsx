import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { PermissionCard } from '@/components/ui/PermissionCard';
import { usePermissions } from '@/hooks/usePermissions';

const PERMISSION_ITEMS = [
  {
    type: 'camera' as const,
    icon: 'camera' as const,
    title: '📸 Camera',
    description: 'To capture intruder photos when unlock fails',
  },
  {
    type: 'location' as const,
    icon: 'location' as const,
    title: '📍 Location',
    description: 'To track intruder location and send alerts',
  },
  {
    type: 'notifications' as const,
    icon: 'notifications' as const,
    title: '🔔 Notifications',
    description: 'To alert you of intruder detection events',
  },
  {
    type: 'mediaLibrary' as const,
    icon: 'images' as const,
    title: '🖼️ Media Library',
    description: 'To save captured intruder photos',
  },
];

export default function PermissionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { permissions, requestSinglePermission, allCriticalGranted } = usePermissions();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="key" size={48} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.h2, marginTop: theme.spacing.md }]}>
            Grant Permissions
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.sm }]}>
            SecureGuard needs these permissions to protect your device
          </Text>
        </View>

        <View style={[styles.permissionsContainer, { marginTop: theme.spacing.xl }]}>
          {PERMISSION_ITEMS.map(item => (
            <PermissionCard
              key={item.type}
              icon={item.icon}
              title={item.title}
              description={item.description}
              granted={permissions[item.type]}
              onGrant={() => requestSinglePermission(item.type)}
            />
          ))}
        </View>

        <View style={[styles.bottomActions, { marginTop: theme.spacing.xl }]}>
          <Button
            title="Continue"
            onPress={() => router.push('/onboarding/complete')}
            disabled={!allCriticalGranted}
            fullWidth
          />
          {!allCriticalGranted && (
            <Text
              style={[
                styles.hint,
                { color: theme.colors.textSecondary, fontSize: theme.typography.small, marginTop: theme.spacing.sm },
              ]}
            >
              Camera and Location permissions are required to continue
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 },
  header: { alignItems: 'center' },
  title: { fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  permissionsContainer: {},
  bottomActions: {},
  hint: { textAlign: 'center' },
});
