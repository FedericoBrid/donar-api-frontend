import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    "Content-Type": "application/json",
  }, // Replace with your API base URL
});

export default api;