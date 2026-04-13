export const APP_NAME = 'SecureGuard';
export const APP_VERSION = '1.0.0';
export const APP_SLUG = 'secureguard';

export const MAX_EMERGENCY_CONTACTS = 5;
export const DEFAULT_PIN_LENGTH = 6;

export const DEFAULT_INTRUDER_SETTINGS = {
  enabled: true,
  sensitivity: 2 as 1 | 2 | 3,
  cameraMode: 'front' as 'front' | 'back' | 'both',
  smsAlertEnabled: true,
  emailAlertEnabled: false,
  soundAlertEnabled: true,
};

export const STORAGE_KEYS = {
  MASTER_PIN: 'master_pin',
  IS_FIRST_LAUNCH: 'is_first_launch',
  INTRUDER_SETTINGS: 'intruder_settings',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  THEME: 'app_theme',
} as const;

export const SENSITIVITY_LABELS: Record<1 | 2 | 3, string> = {
  1: '1 Failed Attempt',
  2: '2 Failed Attempts',
  3: '3 Failed Attempts',
};

export const CAMERA_MODE_LABELS = {
  front: 'Front Camera Only',
  back: 'Back Camera Only',
  both: 'Both Cameras',
} as const;

export const SMS_ALERT_TEMPLATE = (
  attempts: number,
  address: string,
  mapsUrl: string,
  time: string,
) =>
  `🚨 SECUREGUARD ALERT 🚨\n\nIntruder detected on your device!\n\nFailed attempts: ${attempts}\nTime: ${time}\nLocation: ${address}\nMaps: ${mapsUrl}\n\nSent by SecureGuard`;
