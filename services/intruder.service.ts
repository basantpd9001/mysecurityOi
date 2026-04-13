import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as Notifications from 'expo-notifications';
import { v4 as uuidv4 } from 'uuid';
import { IntruderAlert } from '@/types';
import { locationService } from './location.service';
import { smsService } from './sms.service';
import { firebaseService } from './firebase.service';
import { useSecurityStore } from '@/store/useSecurityStore';

export const intruderService = {
  async handleFailedAttempt(attemptCount: number): Promise<IntruderAlert | null> {
    const { intruderSettings, emergencyContacts, addAlert } = useSecurityStore.getState();

    if (!intruderSettings.enabled) return null;
    if (attemptCount < intruderSettings.sensitivity) return null;

    try {
      // Get location
      let location: IntruderAlert["location"] = {
        latitude: 0,
        longitude: 0,
        address: 'Location unavailable',
      };
      try {
        const loc = await locationService.getCurrentLocation();
        location = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          altitude: loc.altitude,
          accuracy: loc.accuracy,
          address: loc.address,
        };
      } catch (locError) {
        console.error('Could not get location:', locError);
      }

      // Get device info
      const deviceInfo = {
        deviceName: Device.deviceName ?? 'Unknown Device',
        brand: Device.brand ?? 'Unknown',
        model: Device.modelName ?? 'Unknown Model',
        osVersion: `${Device.osName ?? 'OS'} ${Device.osVersion ?? ''}`.trim(),
      };

      // Get network info
      let networkInfo: IntruderAlert["networkInfo"] = { type: 'unknown' };
      try {
        const netState = await Network.getNetworkStateAsync();
        networkInfo = {
          type: netState.type ?? 'unknown',
          ipAddress: await Network.getIpAddressAsync(),
        };
      } catch (netError) {
        console.error('Could not get network info:', netError);
      }

      const alert: IntruderAlert = {
        id: uuidv4(),
        timestamp: new Date(),
        frontPhotoUri: '',
        backPhotoUri: '',
        location,
        deviceInfo,
        failedAttempts: attemptCount,
        networkInfo,
        smsSent: false,
        smsRecipients: [],
      };

      // Try to upload photos to Firebase (will fail with placeholder config)
      try {
        if (alert.frontPhotoUri) {
          alert.frontPhotoUrl = await firebaseService.uploadPhoto(
            alert.frontPhotoUri,
            `alerts/${alert.id}/front.jpg`,
          );
        }
        if (alert.backPhotoUri) {
          alert.backPhotoUrl = await firebaseService.uploadPhoto(
            alert.backPhotoUri,
            `alerts/${alert.id}/back.jpg`,
          );
        }
        await firebaseService.saveAlert(alert);
      } catch (firebaseError) {
        console.error('Firebase operations failed (expected with placeholder config):', firebaseError);
      }

      // Send SMS to emergency contacts
      if (intruderSettings.smsAlertEnabled && emergencyContacts.length > 0) {
        try {
          const smsSent = await smsService.sendIntruderAlert(emergencyContacts, alert);
          alert.smsSent = smsSent;
          alert.smsRecipients = emergencyContacts.map(c => `${c.countryCode}${c.phoneNumber}`);
        } catch (smsError) {
          console.error('SMS sending failed:', smsError);
        }
      }

      // Send push notification
      try {
        await intruderService.sendLocalNotification(alert);
      } catch (notifError) {
        console.error('Notification failed:', notifError);
      }

      // Save to store
      addAlert(alert);

      return alert;
    } catch (error) {
      console.error('Intruder detection failed:', error);
      return null;
    }
  },

  async sendLocalNotification(alert: IntruderAlert): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 Intruder Detected!',
        body: `Failed attempts: ${alert.failedAttempts} | Location: ${alert.location.address}`,
        data: { alertId: alert.id },
        sound: true,
      },
      trigger: null,
    });
  },

  getAllAlerts(): IntruderAlert[] {
    return useSecurityStore.getState().intruderAlerts;
  },

  deleteAlert(id: string): void {
    useSecurityStore.getState().deleteAlert(id);
  },
};
