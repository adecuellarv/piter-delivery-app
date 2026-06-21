import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import apiClient from './apiClient';
import { getFirebaseAuth } from '../config/firebase';

const DEVICE_ID_STORAGE_KEY = 'piter-device-id';
const LOGIN_REPARTIDOR_URL =
  process.env.EXPO_PUBLIC_API_LOGIN_REPARTIDOR ||
  'https://loginrepartidor-aoz4dvh7za-uc.a.run.app';

const createDeviceId = () =>
  `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export const getOrCreateDeviceId = async () => {
  const currentDeviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (currentDeviceId) {
    return currentDeviceId;
  }

  const nextDeviceId = createDeviceId();
  await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId);

  return nextDeviceId;
};

export const createAccount = ({ correo, telefono, password }) => {
  const url = process.env.EXPO_PUBLIC_API_CREATE_PASSWORD;

  if (!url) {
    return Promise.reject({
      message: 'Falta configurar EXPO_PUBLIC_API_CREATE_PASSWORD',
    });
  }

  return apiClient.post(url, {
    data: {
      correo,
      telefono,
      password,
    },
  });
};

export const loginDriver = async ({ correo, password }) => {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, correo, password);
  const token = await credential.user.getIdToken();
  const deviceId = await getOrCreateDeviceId();
  const data = await apiClient.post(
    LOGIN_REPARTIDOR_URL,
    {
      data: {
        correo,
        deviceId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    data,
    usuario: data?.result?.usuario,
    deviceId,
    user: credential.user,
  };
};
