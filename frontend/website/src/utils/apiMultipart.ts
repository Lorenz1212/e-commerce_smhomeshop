import axios from 'axios';

const token_name = import.meta.env.VITE_APP_TOKEN_NAME;

const isLive = !["localhost", "127.0.0.1"].includes(window.location.hostname);

const baseUrl = (isLive)?import.meta.env.VITE_APP_API_URL_LIVE:import.meta.env.VITE_APP_API_URL;

const apiMultipart = axios.create({
  baseURL: baseUrl,
  headers: {
      "Content-Type": "multipart/form-data",
  },
});

// Helper to get token from localStorage
const getStoredToken = () => {
  const raw = localStorage.getItem(token_name);
  if (!raw) return null;

  try {
    return JSON.parse(raw); // if saved as JSON.stringify(token)
  } catch {
    return raw.replace(/^"(.*)"$/, '$1'); // fallback
  }
};

// Set token if it exists
const token = getStoredToken();
if (token) {
  apiMultipart.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Exported setter for manual updates
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiMultipart.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(token_name, token);
  } else {
    delete apiMultipart.defaults.headers.common['Authorization'];
    localStorage.removeItem(token_name);
  }
};

export default apiMultipart;
