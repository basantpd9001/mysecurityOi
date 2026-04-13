import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function SecurityScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { intruderSettings, intruderAlerts, emergencyContacts, updateSettings } = useSecurityStore();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.h2 }]}>
          Security
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intruder Detection Card */}
        <Card style={{ marginTop: theme.spacing.md }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.danger}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm }]}>
                <Ionicons name="camera" size={22} color={theme.colors.danger} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                  Intruder Detection
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  Capture photos on failed unlock
                </Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <Switch
                value={intruderSettings.enabled}
                onValueChange={v => updateSettings({ enabled: v })}
                trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}88` }}
                thumbColor={intruderSettings.enabled ? theme.colors.primary : theme.colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => router.push('/intruder/setup')}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ color: theme.colors.primary, fontSize: theme.typography.caption }}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Recent Alerts Card */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.warning}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm }]}>
                <Ionicons name="warning" size={22} color={theme.colors.warning} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                  Recent Alerts
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  {intruderAlerts.length} total alert{intruderAlerts.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/intruder/history')}>
              <Text style={{ color: theme.colors.primary, fontSize: theme.typography.caption }}>View All</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Emergency Contacts Card */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.success}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm }]}>
                <Ionicons name="people" size={22} color={theme.colors.success} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                  Emergency Contacts
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  {emergencyContacts.length} contact{emergencyContacts.length !== 1 ? 's' : ''} added
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/intruder/emergency-contacts')}>
              <Text style={{ color: theme.colors.primary, fontSize: theme.typography.caption }}>Manage</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* App Lock Card — Coming Soon */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.primary}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm }]}>
                <Ionicons name="lock-closed" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                  App Lock
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  Lock individual apps with PIN
                </Text>
              </View>
            </View>
            <Badge label="Module 2" variant="default" />
          </View>
        </Card>

        {/* Anti-Theft Card — Coming Soon */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconWrapper, { backgroundColor: `${theme.colors.secondary}22`, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm }]}>
                <Ionicons name="shield" size={22} color={theme.colors.secondary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                  Anti-Theft
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                  SIM change alert, remote wipe
                </Text>
              </View>
            </View>
            <Badge label="Module 7" variant="default" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {},
  headerTitle: { fontWeight: '800' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardIconRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrapper: {},
  cardTitle: { fontWeight: '600', marginBottom: 2 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
});
