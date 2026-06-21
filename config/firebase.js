import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const REQUIRED_CONFIG_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];

const assertFirebaseConfig = () => {
  const missingKeys = REQUIRED_CONFIG_KEYS.filter((key) => !firebaseConfig[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Faltan variables de Firebase: ${missingKeys.join(', ')}`);
  }
};

let authInstance;

export const getFirebaseAuth = () => {
  assertFirebaseConfig();

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  if (!authInstance) {
    try {
      // Primera vez: inicializa CON persistencia
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error) {
      // Si ya estaba inicializado (hot reload en dev), solo lo recuperas
      authInstance = getAuth(app);
    }
  }

  return authInstance;
};