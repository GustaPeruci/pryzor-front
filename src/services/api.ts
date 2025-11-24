import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => { console.error('API Error:', error.response?.data || error.message); return Promise.reject(error); }
);

export interface Game {
  appid: number;
  name: string;
  type?: string;
  releasedate?: string;
  freetoplay?: number;
  current_price?: number;
  current_discount?: number | null;
  price_records?: number;
}

export interface GameDetails {
  game: { appid: number; name: string; type?: string; releasedate?: string; freetoplay?: number };
  price_history: Array<{ date: string; final_price: number; discount: number }>;
  price_history_count: number;
}

export interface MLPrediction {
  appid: number;
  game_name: string;
  will_have_discount: boolean;
  probability: number;
  confidence: number;
  current_discount: number;
  current_price?: number;
  last_price_date?: string; // Data do último preço
  recommendation: string; // "BUY" ou "WAIT"
  recommendation_text?: string; // Texto descritivo da recomendação
  reasoning: string[];
  model_version: string;
  prediction_date: string;
}

export interface ModelMetrics {
  loaded: boolean;
  version: string;
  validation_method: string;
  trained_at: string;
  features_count: number;
  metrics: { f1_score: number; precision: number; recall: number; accuracy: number; roc_auc: number };
}

export const gameApi = {
  searchGames: async (params: { search?: string; limit?: number; offset?: number }) => {
    const response = await api.get('/api/games', { params });
    const data = response.data;
    return { games: data.games || [], total: data.pagination?.total || 0, page: Math.floor((data.pagination?.offset || 0) / (params.limit || 50)) + 1, limit: data.pagination?.limit || 50 };
  },
  getGameById: async (appid: number): Promise<GameDetails> => { const response = await api.get(`/api/games/${appid}`); return response.data; },
  getStatus: async (): Promise<any> => { const response = await api.get('/'); return response.data; },
};

export const mlApi = {
  getModelInfo: async (): Promise<ModelMetrics> => { const response = await api.get('/api/ml/info'); return response.data; },
  predictGame: async (appid: number): Promise<MLPrediction> => { const response = await api.get(`/api/ml/predict/${appid}`); return response.data; },
  predictBatch: async (appids: number[]) => { const response = await api.post('/api/ml/predict/batch', { appids }); return response.data; },
  healthCheck: async () => { const response = await api.get('/api/ml/health'); return response.data; },
};

export default api;
