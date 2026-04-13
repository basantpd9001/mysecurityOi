import * as SMS from 'expo-sms';
import { EmergencyContact, IntruderAlert } from '@/types';
import { SMS_ALERT_TEMPLATE } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export const smsService = {
  async sendIntruderAlert(
    contacts: EmergencyContact[],
    alertData: IntruderAlert,
  ): Promise<boolean> {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      console.error('SMS is not available on this device');
      return false;
    }

    if (contacts.length === 0) {
      return false;
    }

    const mapsUrl = `https://maps.google.com/?q=${alertData.location.latitude},${alertData.location.longitude}`;
    const message = SMS_ALERT_TEMPLATE(
      alertData.failedAttempts,
      alertData.location.address,
      mapsUrl,
      formatDateTime(alertData.timestamp),
    );

    const phoneNumbers = contacts.map(c => `${c.countryCode}${c.phoneNumber}`);

    try {
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);
      return result === 'sent';
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  },

  async sendTestSMS(contact: EmergencyContact): Promise<boolean> {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) return false;

    const message =
      '✅ SecureGuard Test Message\n\nThis is a test alert from SecureGuard. Your emergency contact has been set up successfully!';
    const phoneNumber = `${contact.countryCode}${contact.phoneNumber}`;

    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      return result === 'sent';
    } catch (error) {
      console.error('Error sending test SMS:', error);
      return false;
    }
  },
};
