import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntruderAlert, EmergencyContact, IntruderSettings } from '@/types';
import { DEFAULT_INTRUDER_SETTINGS, MAX_EMERGENCY_CONTACTS } from '@/utils/constants';

interface SecurityState {
  intruderAlerts: IntruderAlert[];
  emergencyContacts: EmergencyContact[];
  intruderSettings: IntruderSettings;
  addAlert: (alert: IntruderAlert) => void;
  deleteAlert: (id: string) => void;
  clearAlerts: () => void;
  updateSettings: (settings: Partial<IntruderSettings>) => void;
  addContact: (contact: EmergencyContact) => boolean;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  removeContact: (id: string) => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      intruderAlerts: [],
      emergencyContacts: [],
      intruderSettings: DEFAULT_INTRUDER_SETTINGS,

      addAlert: (alert: IntruderAlert) => {
        set(state => ({
          intruderAlerts: [alert, ...state.intruderAlerts],
        }));
      },

      deleteAlert: (id: string) => {
        set(state => ({
          intruderAlerts: state.intruderAlerts.filter(a => a.id !== id),
        }));
      },

      clearAlerts: () => {
        set({ intruderAlerts: [] });
      },

      updateSettings: (settings: Partial<IntruderSettings>) => {
        set(state => ({
          intruderSettings: { ...state.intruderSettings, ...settings },
        }));
      },

      addContact: (contact: EmergencyContact) => {
        const { emergencyContacts } = get();
        if (emergencyContacts.length >= MAX_EMERGENCY_CONTACTS) {
          return false;
        }
        set(state => ({
          emergencyContacts: [...state.emergencyContacts, contact],
        }));
        return true;
      },

      updateContact: (id: string, updates: Partial<EmergencyContact>) => {
        set(state => ({
          emergencyContacts: state.emergencyContacts.map(c => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      removeContact: (id: string) => {
        set(state => ({
          emergencyContacts: state.emergencyContacts.filter(c => c.id !== id),
        }));
      },
    }),
    {
      name: 'security-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
