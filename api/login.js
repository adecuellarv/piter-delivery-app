import apiClient from './apiClient';

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