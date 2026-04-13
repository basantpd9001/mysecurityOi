import { db, storage } from '@/config/firebase.config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IntruderAlert } from '@/types';

const ALERTS_COLLECTION = 'intruder_alerts';

export const firebaseService = {
  async uploadPhoto(uri: string, path: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading photo to Firebase:', error);
      throw error;
    }
  },

  async saveAlert(alert: IntruderAlert): Promise<void> {
    try {
      const alertData = {
        ...alert,
        timestamp: alert.timestamp.toISOString(),
      };
      await addDoc(collection(db, ALERTS_COLLECTION), alertData);
    } catch (error) {
      console.error('Error saving alert to Firestore:', error);
      throw error;
    }
  },

  async getAlerts(): Promise<IntruderAlert[]> {
    try {
      const q = query(collection(db, ALERTS_COLLECTION), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          timestamp: new Date(data.timestamp),
        } as IntruderAlert;
      });
    } catch (error) {
      console.error('Error fetching alerts from Firestore:', error);
      return [];
    }
  },

  async deleteAlert(alertId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, ALERTS_COLLECTION, alertId));
    } catch (error) {
      console.error('Error deleting alert from Firestore:', error);
      throw error;
    }
  },
};
