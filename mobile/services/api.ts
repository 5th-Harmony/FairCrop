import axios from 'axios';

const MOBILE_API_URL = 'http://10.0.2.2:8001/api/v1'; // Android emulator localhost alias

export const mobileApi = axios.create({
  baseURL: MOBILE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
