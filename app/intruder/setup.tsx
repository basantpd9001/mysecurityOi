import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { intruderService } from '@/services/intruder.service';
import { SENSITIVITY_LABELS, CAMERA_MODE_LABELS } from '@/utils/constants';

export default function IntruderSetupScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { intruderSettings, updateSettings } = useSecurityStore();
  const [testing, setTesting] = useState(false);

  const handleTestDetection = async () => {
    setTesting(true);
    try {
      Alert.alert(
        'Test Detection',
        'This will simulate an intruder alert. Emergency contacts will be notified.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Run Test',
            onPress: async () => {
              const result = await intruderService.handleFailedAttempt(
                intruderSettings.sensitivity,
              );
              if (result) {
                Alert.alert('Test Complete', 'Intruder detection test ran successfully!');
              } else {
                Alert.alert('Test Failed', 'Could not run test. Make sure detection is enabled.');
              }
              setTesting(false);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Test detection error:', error);
      setTesting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Intruder Detection"
        showBackButton
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Enable/Disable */}
        <Card style={{ marginTop: theme.spacing.md }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                Enable Intruder Detection
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: 2 }}>
                Capture photos & location on failed unlock
              </Text>
            </View>
            <Switch
              value={intruderSettings.enabled}
              onValueChange={v => updateSettings({ enabled: v })}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}88` }}
              thumbColor={intruderSettings.enabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
        </Card>

        {/* Sensitivity */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.lg }]}>
          SENSITIVITY
        </Text>
        <Card style={{ marginTop: theme.spacing.xs }}>
          {([1, 2, 3] as const).map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => updateSettings({ sensitivity: level })}
              style={[
                styles.optionRow,
                {
                  borderBottomWidth: level < 3 ? 1 : 0,
                  borderBottomColor: theme.colors.border,
                  paddingVertical: theme.spacing.sm + 4,
                },
              ]}
            >
              <Text style={{ color: theme.colors.text, fontSize: theme.typography.body, flex: 1 }}>
                {SENSITIVITY_LABELS[level]}
              </Text>
              {intruderSettings.sensitivity === level && (
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Camera Mode */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.lg }]}>
          CAMERA MODE
        </Text>
        <Card style={{ marginTop: theme.spacing.xs }}>
          {(['front', 'back', 'both'] as const).map((mode, i) => (
            <TouchableOpacity
              key={mode}
              onPress={() => updateSettings({ cameraMode: mode })}
              style={[
                styles.optionRow,
                {
                  borderBottomWidth: i < 2 ? 1 : 0,
                  borderBottomColor: theme.colors.border,
                  paddingVertical: theme.spacing.sm + 4,
                },
              ]}
            >
              <Text style={{ color: theme.colors.text, fontSize: theme.typography.body, flex: 1 }}>
                {CAMERA_MODE_LABELS[mode]}
              </Text>
              {intruderSettings.cameraMode === mode && (
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Alert Options */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.lg }]}>
          ALERT OPTIONS
        </Text>
        <Card style={{ marginTop: theme.spacing.xs }}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                SMS Alert
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                Send SMS to emergency contacts
              </Text>
            </View>
            <Switch
              value={intruderSettings.smsAlertEnabled}
              onValueChange={v => updateSettings({ smsAlertEnabled: v })}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}88` }}
              thumbColor={intruderSettings.smsAlertEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
          <View style={[styles.row, { paddingTop: theme.spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.typography.body }]}>
                Sound Alert
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption }}>
                Play alarm sound on detection
              </Text>
            </View>
            <Switch
              value={intruderSettings.soundAlertEnabled}
              onValueChange={v => updateSettings({ soundAlertEnabled: v })}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}88` }}
              thumbColor={intruderSettings.soundAlertEnabled ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
        </Card>

        {/* Test Button */}
        <Button
          title="Test Detection"
          onPress={handleTestDetection}
          loading={testing}
          variant="secondary"
          style={{ marginTop: theme.spacing.xl }}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontWeight: '600' },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
});
