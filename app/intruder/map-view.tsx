import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/config/ThemeProvider';
import { useSecurityStore } from '@/store/useSecurityStore';
import { Header } from '@/components/ui/Header';

export default function MapViewScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { intruderAlerts } = useSecurityStore();

  const alert = intruderAlerts.find(a => a.id === id);

  const openInGoogleMaps = () => {
    if (!alert) return;
    const url = Platform.select({
      ios: `comgooglemaps://?q=${alert.location.latitude},${alert.location.longitude}`,
      android: `geo:${alert.location.latitude},${alert.location.longitude}?q=${alert.location.latitude},${alert.location.longitude}`,
    });
    const webUrl = `https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}`;

    if (url) {
      Linking.canOpenURL(url)
        .then(supported => {
          Linking.openURL(supported ? url : webUrl);
        })
        .catch(() => Linking.openURL(webUrl));
    } else {
      Linking.openURL(webUrl);
    }
  };

  if (!alert) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Map View" showBackButton onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.colors.textSecondary }}>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Intruder Location" showBackButton onBack={() => router.back()} />

      {/* Map placeholder — react-native-maps requires native build */}
      <View style={[styles.mapPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Ionicons name="map" size={64} color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 18, marginTop: 16 }}>
          Map View
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
          Live map requires a native build. Use Expo Go or tap "Open in Google Maps" below.
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginTop: 16 }}>
          📍 {alert.location.address}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }}>
          {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={openInGoogleMaps}
          style={[
            styles.openMapsBtn,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontWeight: '700', marginLeft: 8, fontSize: 16 }}>
            Open in Google Maps
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  openMapsBtn: {},
});
