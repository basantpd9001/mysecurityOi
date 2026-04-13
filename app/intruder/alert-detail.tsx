import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { AppTheme } from '@/types';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, formatAddress } from '@/utils/formatters';

export default function AlertDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { intruderAlerts, deleteAlert } = useSecurityStore();

  const alert = intruderAlerts.find(a => a.id === id);

  if (!alert) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Alert Detail" showBackButton onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.colors.textSecondary }}>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    const mapsUrl = `https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}`;
    const message = `🚨 SecureGuard Alert\n\nTime: ${formatDateTime(alert.timestamp)}\nLocation: ${alert.location.address}\nMaps: ${mapsUrl}\nFailed Attempts: ${alert.failedAttempts}`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Alert', 'Are you sure you want to permanently delete this alert?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteAlert(alert.id);
          router.back();
        },
      },
    ]);
  };

  const mapsUrl = `https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Alert Detail"
        showBackButton
        onBack={() => router.back()}
        rightAction={{ icon: 'share-outline', onPress: handleShare }}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View
          style={[
            styles.banner,
            {
              backgroundColor: `${theme.colors.danger}18`,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: `${theme.colors.danger}44`,
              padding: theme.spacing.md,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="warning" size={28} color={theme.colors.danger} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: theme.colors.danger, fontWeight: '700', fontSize: theme.typography.h3 }}>
                Intruder Detected
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: 2 }}>
                {formatDateTime(alert.timestamp)}
              </Text>
            </View>
            <Badge label={`${alert.failedAttempts} fails`} variant="danger" style={{ marginLeft: 'auto' }} />
          </View>
        </View>

        {/* Location Info */}
        <Card style={{ marginTop: theme.spacing.md }}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.body, marginLeft: 8 }]}>
              Location
            </Text>
          </View>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, marginTop: theme.spacing.sm }}>
            {alert.location.address || 'Location unavailable'}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small }}>
              Lat: {alert.location.latitude.toFixed(6)}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small }}>
              Lng: {alert.location.longitude.toFixed(6)}
            </Text>
          </View>
          {alert.location.accuracy && (
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.small, marginTop: 4 }}>
              Accuracy: ±{Math.round(alert.location.accuracy)}m
            </Text>
          )}
          <TouchableOpacity
            onPress={() => router.push(`/intruder/map-view?id=${alert.id}`)}
            style={[
              styles.mapButton,
              {
                backgroundColor: `${theme.colors.primary}22`,
                borderRadius: theme.borderRadius.sm,
                padding: theme.spacing.sm,
                marginTop: theme.spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Ionicons name="map-outline" size={16} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, marginLeft: 6, fontSize: theme.typography.caption, fontWeight: '600' }}>
              View on Map
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Device Info */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.body, marginLeft: 8 }]}>
              Device Info
            </Text>
          </View>
          <InfoRow label="Device" value={alert.deviceInfo.deviceName} theme={theme} />
          <InfoRow label="Brand" value={alert.deviceInfo.brand} theme={theme} />
          <InfoRow label="Model" value={alert.deviceInfo.model} theme={theme} />
          <InfoRow label="OS" value={alert.deviceInfo.osVersion} theme={theme} />
        </Card>

        {/* Network Info */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wifi" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.body, marginLeft: 8 }]}>
              Network Info
            </Text>
          </View>
          <InfoRow label="Type" value={alert.networkInfo.type} theme={theme} />
          {alert.networkInfo.ipAddress && (
            <InfoRow label="IP Address" value={alert.networkInfo.ipAddress} theme={theme} />
          )}
          {alert.networkInfo.ssid && (
            <InfoRow label="SSID" value={alert.networkInfo.ssid} theme={theme} />
          )}
        </Card>

        {/* SMS Status */}
        <Card style={{ marginTop: theme.spacing.sm }}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.typography.body, marginLeft: 8 }]}>
              Alert Status
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.sm }}>
            <Text style={{ color: theme.colors.textSecondary, flex: 1 }}>SMS Sent</Text>
            <Badge
              label={alert.smsSent ? `✓ Sent to ${alert.smsRecipients.length}` : 'Not Sent'}
              variant={alert.smsSent ? 'success' : 'default'}
            />
          </View>
        </Card>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            styles.deleteBtn,
            {
              backgroundColor: `${theme.colors.danger}18`,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: `${theme.colors.danger}44`,
              padding: theme.spacing.md,
              marginTop: theme.spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
          <Text style={{ color: theme.colors.danger, fontWeight: '600', marginLeft: 8 }}>
            Delete Alert
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: AppTheme;
}) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <Text style={{ color: theme.colors.textSecondary, flex: 1, fontSize: theme.typography.caption }}>
        {label}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.caption, fontWeight: '500', flex: 2 }}>
        {value || 'N/A'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {},
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontWeight: '600' },
  mapButton: {},
  deleteBtn: {},
});
