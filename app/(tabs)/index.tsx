import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime, formatAddress } from '@/utils/formatters';
import { usePermissions } from '@/hooks/usePermissions';

function SecurityScoreCircle({ score }: { score: number }) {
  const { theme } = useTheme();

  const getColor = () => {
    if (score >= 80) return theme.colors.success;
    if (score >= 50) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <View style={styles.scoreContainer}>
      <View
        style={[
          styles.scoreCircle,
          {
            borderColor: getColor(),
            backgroundColor: `${getColor()}18`,
          },
        ]}
      >
        <Text style={[styles.scoreNumber, { color: getColor() }]}>{score}</Text>
        <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>/100</Text>
      </View>
      <Text style={[styles.scoreTitle, { color: theme.colors.text }]}>Security Score</Text>
      <Text style={[styles.scoreSubtitle, { color: theme.colors.textSecondary }]}>
        {score >= 80 ? 'Excellent Protection' : score >= 50 ? 'Moderate Protection' : 'Needs Attention'}
      </Text>
    </View>
  );
}

const QUICK_ACTIONS = [
  { icon: 'alert-circle' as const, label: 'SOS', color: '#EF4444' },
  { icon: 'lock-closed' as const, label: 'Lock All', color: '#4F46E5' },
  { icon: 'location' as const, label: 'Find Phone', color: '#10B981' },
  { icon: 'timer' as const, label: 'Quick Focus', color: '#F59E0B' },
];

export default function DashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { intruderAlerts, intruderSettings, emergencyContacts } = useSecurityStore();
  const { masterPin } = useAuthStore();
  const { permissions, allCriticalGranted } = usePermissions();
  const [refreshing, setRefreshing] = React.useState(false);

  const calculateScore = useCallback(() => {
    let score = 0;
    if (masterPin) score += 25;
    if (permissions.camera) score += 15;
    if (permissions.location) score += 15;
    if (intruderSettings.enabled) score += 25;
    if (emergencyContacts.length > 0) score += 20;
    return score;
  }, [masterPin, permissions, intruderSettings.enabled, emergencyContacts.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const recentAlerts = intruderAlerts.slice(0, 3);
  const score = calculateScore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={28} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.h3, marginLeft: 8 }]}>
            SecureGuard
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/intruder/setup')}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 24 }}
      >
        {/* Security Score */}
        <Card style={{ marginTop: theme.spacing.md, alignItems: 'center' }}>
          <SecurityScoreCircle score={score} />
        </Card>

        {/* Quick Stats */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.h3, marginTop: theme.spacing.lg }]}>
          Quick Stats
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: theme.spacing.sm }}>
          {[
            { icon: 'warning' as const, label: 'Intruder Alerts', value: String(intruderAlerts.length), color: theme.colors.danger },
            { icon: 'phone-portrait' as const, label: 'Screen Time', value: '0h 0m', color: theme.colors.primary },
            { icon: 'walk' as const, label: 'Steps', value: '0', color: theme.colors.success },
            { icon: 'timer' as const, label: 'Focus Saved', value: '0h', color: theme.colors.warning },
          ].map((stat, i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  marginRight: theme.spacing.sm,
                  minWidth: 110,
                },
              ]}
            >
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 22, marginTop: 4 }}>
                {stat.value}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Recent Alerts */}
        <View style={[styles.sectionHeader, { marginTop: theme.spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.h3 }]}>
            Recent Alerts
          </Text>
          {intruderAlerts.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/intruder/history')}>
              <Text style={{ color: theme.colors.primary, fontSize: theme.typography.caption }}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentAlerts.length === 0 ? (
          <Card style={{ marginTop: theme.spacing.sm }}>
            <EmptyState
              icon="shield-checkmark-outline"
              title="No Alerts"
              subtitle="Your device is secure. No intruder attempts detected."
            />
          </Card>
        ) : (
          recentAlerts.map(alert => (
            <Card
              key={alert.id}
              pressable
              onPress={() => router.push(`/intruder/alert-detail?id=${alert.id}`)}
              style={{ marginTop: theme.spacing.sm }}
            >
              <View style={styles.alertRow}>
                <View
                  style={[
                    styles.alertIconWrapper,
                    { backgroundColor: `${theme.colors.danger}22`, borderRadius: theme.borderRadius.sm, padding: 10 },
                  ]}
                >
                  <Ionicons name="warning" size={24} color={theme.colors.danger} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: theme.typography.body }}>
                    Intruder Detected
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: 2 }}>
                    {formatRelativeTime(alert.timestamp)}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small, marginTop: 2 }} numberOfLines={1}>
                    📍 {formatAddress(alert.location.address)}
                  </Text>
                </View>
                <Badge label={`${alert.failedAttempts}x`} variant="danger" />
              </View>
            </Card>
          ))
        )}

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.h3, marginTop: theme.spacing.lg }]}>
          Quick Actions
        </Text>
        <View style={[styles.actionsGrid, { marginTop: theme.spacing.sm }]}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[
                styles.actionItem,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIconWrapper,
                  { backgroundColor: `${action.color}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm },
                ]}
              >
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: theme.typography.caption, marginTop: 8 }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '700' },
  scoreContainer: { alignItems: 'center', paddingVertical: 8 },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: { fontSize: 42, fontWeight: '800' },
  scoreLabel: { fontSize: 14 },
  scoreTitle: { fontWeight: '700', fontSize: 18, marginTop: 12 },
  scoreSubtitle: { fontSize: 13, marginTop: 4 },
  statCard: {},
  alertRow: { flexDirection: 'row', alignItems: 'center' },
  alertIconWrapper: {},
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionItem: { width: '47%', alignItems: 'center' },
  actionIconWrapper: {},
});
