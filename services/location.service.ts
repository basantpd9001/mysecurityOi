import * as Location from 'expo-location';
import { LocationResult } from '@/types';

export const locationService = {
  async getCurrentLocation(): Promise<LocationResult> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const address = await locationService.reverseGeocode(
      position.coords.latitude,
      position.coords.longitude,
    );

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude ?? undefined,
      accuracy: position.coords.accuracy ?? undefined,
      address,
      timestamp: new Date(position.timestamp),
    };
  },

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [r.name, r.street, r.district, r.city, r.region, r.country].filter(Boolean);
        return parts.join(', ');
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  },
};
