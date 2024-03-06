import axios from 'axios';

const baseURL = 'https://natours-app-r8rd.onrender.com/api/v1/';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;
