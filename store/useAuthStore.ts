import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
  masterPin: string | null;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  failedAttempts: number;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  incrementFailedAttempts: () => number;
  resetFailedAttempts: () => void;
  setFirstLaunchComplete: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      masterPin: null,
      isAuthenticated: false,
      isFirstLaunch: true,
      failedAttempts: 0,

      setPin: async (pin: string) => {
        try {
          // Store PIN securely using SecureStore
          await SecureStore.setItemAsync(STORAGE_KEYS.MASTER_PIN, pin);
          set({ masterPin: pin, isAuthenticated: true });
        } catch (error) {
          console.error('Error saving PIN:', error);
          // Fallback to in-memory storage
          set({ masterPin: pin, isAuthenticated: true });
        }
      },

      verifyPin: async (pin: string) => {
        try {
          const storedPin = await SecureStore.getItemAsync(STORAGE_KEYS.MASTER_PIN);
          const currentPin = storedPin ?? get().masterPin;
          const isValid = currentPin === pin;
          if (isValid) {
            set({ isAuthenticated: true, failedAttempts: 0 });
          }
          return isValid;
        } catch (error) {
          console.error('Error verifying PIN:', error);
          const { masterPin } = get();
          const isValid = masterPin === pin;
          if (isValid) {
            set({ isAuthenticated: true, failedAttempts: 0 });
          }
          return isValid;
        }
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      incrementFailedAttempts: () => {
        const current = get().failedAttempts + 1;
        set({ failedAttempts: current });
        return current;
      },

      resetFailedAttempts: () => {
        set({ failedAttempts: 0 });
      },

      setFirstLaunchComplete: () => {
        set({ isFirstLaunch: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        masterPin: state.masterPin,
        isFirstLaunch: state.isFirstLaunch,
      }),
    },
  ),
);
