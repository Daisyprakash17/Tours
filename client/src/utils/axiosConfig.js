import axios from 'axios';

// Define your base URL
const baseURL = 'http://localhost:8000/api/v1/';

// Create an Axios instance
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // Uncomment if needed
});

// Add a request interceptor to include the Bearer token
api.interceptors.request.use(
  config => {
    // Retrieve the token from localStorage or another secure source
    const token = localStorage.getItem('jwt_token'); // or wherever your token is stored
    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzViOWYyMzBmZTc3MWVjZmM4OTA3NyIsImlhdCI6MTcyNDI0MTA4NywiZXhwIjoxNzI2ODMzMDg3fQ.YDEiHlBlvtPJVB0wfDOyZtSog1HVFoDOvetcAJjBgoA"
    if (token) {
      // Add the Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

export default api;
