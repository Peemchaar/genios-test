import axios from 'axios';
import axiosRetry from 'axios-retry';
import { API_TOKEN, API_BASE_URL,BACKUP_TOKEN } from '../environment';




axios.defaults.baseURL = `${API_BASE_URL}`; 
axios.defaults.headers.common['Authorization'] = `Bearer ${BACKUP_TOKEN}`;

axiosRetry(axios, {
    retries: 2,
    retryDelay: (retryCount) => retryCount * 20000,
    retryCondition: (error) => error.response?.status === 503,
});

export default axios;
