import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '@/types';

interface SettingsState {
  theme: ThemeMode;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  biometricEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  toggleBiometric: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      notificationsEnabled: true,
      soundEnabled: true,
      hapticEnabled: true,
      biometricEnabled: false,

      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },

      toggleTheme: () => {
        set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },

      toggleNotifications: () => {
        set(state => ({ notificationsEnabled: !state.notificationsEnabled }));
      },

      toggleSound: () => {
        set(state => ({ soundEnabled: !state.soundEnabled }));
      },

      toggleHaptic: () => {
        set(state => ({ hapticEnabled: !state.hapticEnabled }));
      },

      toggleBiometric: () => {
        set(state => ({ biometricEnabled: !state.biometricEnabled }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
