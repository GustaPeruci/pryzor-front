// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pryzor-back-production.up.railway.app';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    games: `${API_BASE_URL}/api/games`,
    predictions: `${API_BASE_URL}/api/predictions`,
    temporalValidation: `${API_BASE_URL}/api/temporal-validation`,
    buyAnalysis: `${API_BASE_URL}/api/buy-analysis`,
  }
};

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};
