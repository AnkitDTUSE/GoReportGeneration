import axios from 'axios';

// Set the global Axios base URL from environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

export default axios;
