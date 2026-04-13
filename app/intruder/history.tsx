import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Header } from '@/components/ui/Header';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { IntruderAlert } from '@/types';
import { formatRelativeTime, formatAddress } from '@/utils/formatters';

type FilterType = 'today' | 'week' | 'all';

function filterAlerts(alerts: IntruderAlert[], filter: FilterType): IntruderAlert[] {
  const now = new Date();
  return alerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    if (filter === 'today') {
      return alertDate.toDateString() === now.toDateString();
    }
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return alertDate >= weekAgo;
    }
    return true;
  });
}

export default function AlertHistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { intruderAlerts, deleteAlert } = useSecurityStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filterAlerts(intruderAlerts, filter);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Alert', 'Are you sure you want to delete this alert?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAlert(id) },
    ]);
  };

  const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Alert History" showBackButton onBack={() => router.back()} />

      {/* Filter Tabs */}
      <View style={[styles.filterRow, { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm }]}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === f.value ? theme.colors.primary : theme.colors.card,
                borderRadius: theme.borderRadius.full,
                borderWidth: 1,
                borderColor: filter === f.value ? theme.colors.primary : theme.colors.border,
                paddingVertical: 6,
                paddingHorizontal: 14,
              },
            ]}
          >
            <Text
              style={{
                color: filter === f.value ? '#FFFFFF' : theme.colors.textSecondary,
                fontSize: theme.typography.caption,
                fontWeight: '600',
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 24, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        ListEmptyComponent={
          <View style={{ flex: 1 }}>
            <EmptyState
              icon="shield-checkmark-outline"
              title="No Alerts"
              subtitle="No intruder alerts found for this period."
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/intruder/alert-detail?id=${item.id}`)}
            onLongPress={() => handleDelete(item.id)}
            activeOpacity={0.85}
            style={[
              styles.alertCard,
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
            <View style={styles.alertRow}>
              <View
                style={[
                  styles.alertIcon,
                  { backgroundColor: `${theme.colors.danger}22`, borderRadius: theme.borderRadius.sm, padding: 10 },
                ]}
              >
                <Ionicons name="warning" size={22} color={theme.colors.danger} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: theme.typography.body }}>
                    Intruder Detected
                  </Text>
                  <Badge label={`${item.failedAttempts} fails`} variant="danger" />
                </View>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: 2 }}>
                  {formatRelativeTime(item.timestamp)}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small, marginTop: 2 }} numberOfLines={1}>
                  📍 {formatAddress(item.location.address)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Badge
                    label={item.smsSent ? '✓ SMS Sent' : 'SMS not sent'}
                    variant={item.smsSent ? 'success' : 'default'}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ paddingLeft: 8 }}>
                <Ionicons name="trash-outline" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterTab: {},
  alertCard: {},
  alertRow: { flexDirection: 'row', alignItems: 'flex-start' },
  alertIcon: {},
});
