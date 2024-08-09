import { GetDataFromSecureStore } from '@/utils/SecureStore';
import axios from 'axios';
console.log(process.env.EXPO_PUBLIC_API_URL)
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

async function handleAddTokenToRequest(config: any) {
  const token = await GetDataFromSecureStore('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Content-Type'] = 'application/json';

  return config;
}

api.interceptors.request.use(
  handleAddTokenToRequest,
  (error) => Promise.reject(error)
);

export default api;
