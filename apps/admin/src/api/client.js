import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      ['customerToken', 'vendorToken', 'adminToken', 'userRole', 'userEmail'].forEach(
        (k) => localStorage.removeItem(k)
      );
      window.location.href = 'http://localhost:3004/admin-login';
      return Promise.reject(err);
    }
    const msg = err.response?.data?.error || err.message || 'Request failed';
    toast.error(msg);
    return Promise.reject(err);
  }
);

export default client;
