// Firebase Configuration
// Replace placeholder values with your actual Firebase project credentials.
// Get these from: https://console.firebase.google.com -> Project Settings -> Your apps
//
// Steps:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Add a Web app to get config
// 4. Replace the values below with your actual credentials
// 5. Enable Authentication, Firestore, and Storage in the Firebase console

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase only once
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
