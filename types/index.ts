export interface IntruderAlert {
  id: string;
  timestamp: Date;
  frontPhotoUri: string;
  backPhotoUri: string;
  frontPhotoUrl?: string;
  backPhotoUrl?: string;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    address: string;
  };
  deviceInfo: {
    deviceName: string;
    brand: string;
    model: string;
    osVersion: string;
  };
  failedAttempts: number;
  networkInfo: {
    type: string;
    ipAddress?: string;
    ssid?: string;
  };
  smsSent: boolean;
  smsRecipients: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  createdAt: Date;
}

export interface IntruderSettings {
  enabled: boolean;
  sensitivity: 1 | 2 | 3;
  cameraMode: 'front' | 'back' | 'both';
  smsAlertEnabled: boolean;
  emailAlertEnabled: boolean;
  soundAlertEnabled: boolean;
}

export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
  timestamp: Date;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  address: string;
  timestamp: Date;
}

export type ThemeMode = 'dark' | 'light';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
  };
  typography: {
    h1: number;
    h2: number;
    h3: number;
    body: number;
    caption: number;
    small: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}
