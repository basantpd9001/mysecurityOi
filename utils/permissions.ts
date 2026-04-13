import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';

export type PermissionType = 'camera' | 'location' | 'notifications' | 'mediaLibrary';

export interface PermissionStatus {
  camera: boolean;
  location: boolean;
  notifications: boolean;
  mediaLibrary: boolean;
}

export async function checkAllPermissions(): Promise<PermissionStatus> {
  const [camera, location, notifications, mediaLibrary] = await Promise.all([
    Camera.getCameraPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Notifications.getPermissionsAsync(),
    MediaLibrary.getPermissionsAsync(),
  ]);

  return {
    camera: camera.status === 'granted',
    location: location.status === 'granted',
    notifications: notifications.status === 'granted',
    mediaLibrary: mediaLibrary.status === 'granted',
  };
}

export async function requestPermission(type: PermissionType): Promise<boolean> {
  try {
    switch (type) {
      case 'camera': {
        const { status } = await Camera.requestCameraPermissionsAsync();
        return status === 'granted';
      }
      case 'location': {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
      }
      case 'notifications': {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
      }
      case 'mediaLibrary': {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
      }
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error requesting ${type} permission:`, error);
    return false;
  }
}

export async function requestAllPermissions(): Promise<PermissionStatus> {
  const results = await Promise.all([
    requestPermission('camera'),
    requestPermission('location'),
    requestPermission('notifications'),
    requestPermission('mediaLibrary'),
  ]);

  return {
    camera: results[0],
    location: results[1],
    notifications: results[2],
    mediaLibrary: results[3],
  };
}
