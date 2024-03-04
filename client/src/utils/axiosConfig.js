import axios from 'axios';

const baseURL = 'https://natours-api.onrender.com';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;
