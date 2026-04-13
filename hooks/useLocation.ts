import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationResult } from '@/types';

interface UseLocationReturn {
  hasLocationPermission: boolean | null;
  isLoadingLocation: boolean;
  currentLocation: LocationResult | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationResult | null>;
}

export function useLocation(): UseLocationReturn {
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationResult | null>(null);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasLocationPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setHasLocationPermission(false);
      return false;
    }
  }, []);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [r.name, r.street, r.district, r.city, r.region, r.country].filter(Boolean);
        return parts.join(', ');
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const getCurrentLocation = useCallback(async (): Promise<LocationResult | null> => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasLocationPermission(false);
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude,
      );

      const result: LocationResult = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude ?? undefined,
        accuracy: position.coords.accuracy ?? undefined,
        address,
        timestamp: new Date(position.timestamp),
      };

      setCurrentLocation(result);
      return result;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  return {
    hasLocationPermission,
    isLoadingLocation,
    currentLocation,
    requestLocationPermission,
    getCurrentLocation,
  };
}
