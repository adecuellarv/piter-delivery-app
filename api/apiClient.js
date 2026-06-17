import axios from 'axios';

export const apiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('Content-Type', 'application/json');
    } else {
      config.headers = { ...config.headers, 'Content-Type': 'application/json' };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const rawMessage =
      errorData?.error?.message ||
      errorData?.message ||
      errorData?.error ||
      error.message ||
      'No se pudo completar la petición';
    const message =
      typeof rawMessage === 'string'
        ? rawMessage
        : rawMessage?.message || 'No se pudo completar la petición';

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);



export default apiClient;
