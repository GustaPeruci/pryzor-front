import axios from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Interfaces TypeScript
export interface Game {
  id?: number;
  appid?: number;
  name: string;
  type?: string;
  freetoplay?: number;
  header_image?: string;
  price?: number;
  current_discount?: number;
  detailed_description?: string;
  short_description?: string;
  developers?: string[];
  publishers?: string[];
  categories?: string[];
  genres?: string[];
  release_date?: string;
  releasedate?: string;
  platforms?: {
    windows?: boolean;
    mac?: boolean;
    linux?: boolean;
  };
  metacritic?: {
    score?: number;
  };
}

export interface GameStatistics {
  total_price_records: number;
  average_price: number;
  min_price: number;
  max_price: number;
  max_discount?: number;
}

export interface GameDetails extends Game {
  statistics?: GameStatistics;
  recent_prices?: Array<{
    date: string;
    price?: number;
    finalprice?: number;
    discount?: number;
  }>;
}

export interface PriceAnalysis {
  recommendation: 'BUY-NOW' | 'WAIT';
  confidence: number;
  reason: string;
  current_price_ratio?: number;
  price_trend?: string;
  details: {
    current_price: number;
    average_price: number;
    min_price: number;
    max_price: number;
    price_variance: number;
    trend_analysis: string;
  };
}

// Desconto 30d (modelo ML)
export interface Discount30dResult {
  appid: number;
  game_name: string;
  as_of_date: string;
  prob_discount_30d: number; // 0..1
  will_discount_30d: boolean;
  threshold: number;
}

// Funções da API
export const gameApi = {
  // Buscar jogos com filtros
  searchGames: async (params: {
    search?: string;
    page?: number;
    limit?: number;
    min_price?: number;
    max_price?: number;
    genres?: string[];
    categories?: string[];
  }): Promise<{ games: Game[]; total: number; page: number; limit: number }> => {
    const response = await api.get('/api/games', { params });
    
    // Adaptar a resposta da API para o formato esperado pelo frontend
    const data = response.data;
    
    // Mapear jogos adicionando ID compatível
    const mappedGames = (data.games || []).map((game: any) => ({
      ...game,
      id: game.appid || game.id,
      price: typeof game.current_price === 'number' ? game.current_price : game.price,
      current_discount: typeof game.current_discount === 'number' ? game.current_discount : undefined,
    }));
    
    return {
      games: mappedGames,
      total: data.pagination?.total || 0,
      page: Math.floor((data.pagination?.offset || 0) / (data.pagination?.limit || 1)) + 1,
      limit: data.pagination?.limit || 10
    };
  },

  // Buscar jogo por ID
  getGameById: async (gameId: number): Promise<GameDetails> => {
    const response = await api.get(`/api/games/${gameId}`);
    const data = response.data;
    
    // Adaptar estrutura da API para o formato esperado
    const game = data.game || data;
    const currentPrice = data.recent_prices?.[0]?.finalprice || game.price || 0;
    
    return {
      ...game,
      id: game.appid || game.id,
      price: currentPrice,
      statistics: data.statistics,
      recent_prices: data.recent_prices
    };
  },

  // Analisar preço do jogo
  analyzeGamePrice: async (gameId: number): Promise<PriceAnalysis> => {
    try {
      // Primeiro, buscar os dados do jogo
      const gameData = await gameApi.getGameById(gameId);
      
      // Note: A API de predições retorna dados diferentes do que precisamos
      // Vamos usar apenas a análise local baseada nos dados do jogo
      
      
      if (!gameData.statistics || !gameData.statistics.total_price_records) {
        console.error('❌ Dados insuficientes:', gameData.statistics);
        throw new Error('Dados de preço insuficientes para análise');
      }

      // Lógica de análise de preço atualizada
      const stats = gameData.statistics;
      const currentPrice = gameData.recent_prices?.[0]?.finalprice || gameData.price || stats.average_price;

      
      // Calcular ratio do preço atual vs preço médio
      const priceRatio = currentPrice / stats.average_price;
      
      // Calcular variação de preços
      const priceRange = stats.max_price - stats.min_price;
      const priceVariance = priceRange / stats.average_price;
      
      // Determinar posição do preço atual na escala
  // const pricePosition = (currentPrice - stats.min_price) / priceRange;
      
      // Lógica de recomendação melhorada
      let recommendation: 'BUY-NOW' | 'WAIT' = 'WAIT';
      let confidence = 0;
      let reason = '';
      let trend_analysis = '';

      if (priceRatio <= 0.7) {
        // Preço muito abaixo da média (30% ou mais de desconto)
        recommendation = 'BUY-NOW';
        confidence = Math.min(95, 70 + (0.7 - priceRatio) * 100);
        reason = `Excelente oportunidade! Preço ${Math.round((1 - priceRatio) * 100)}% abaixo da média histórica.`;
        trend_analysis = 'Preço excepcional - raramente fica mais barato';
      } else if (priceRatio <= 0.85) {
        // Preço bom (15-30% abaixo da média)
        recommendation = 'BUY-NOW';
        confidence = Math.min(85, 50 + (0.85 - priceRatio) * 200);
        reason = `Bom preço! ${Math.round((1 - priceRatio) * 100)}% abaixo da média histórica.`;
        trend_analysis = 'Preço atrativo - vale a pena comprar';
      } else if (priceRatio <= 1.1 && priceVariance > 0.3) {
        // Preço próximo da média, mas com boa variação histórica
        recommendation = 'BUY-NOW';
        confidence = 65;
        reason = `Preço justo próximo à média. Histórico mostra variações de até ${Math.round(priceVariance * 100)}%.`;
        trend_analysis = 'Preço estável - seguro para comprar';
      } else if (priceRatio > 1.2) {
        // Preço muito acima da média
        recommendation = 'WAIT';
        confidence = Math.min(90, 60 + (priceRatio - 1.2) * 100);
        reason = `Preço ${Math.round((priceRatio - 1) * 100)}% acima da média histórica. Recomendamos aguardar uma promoção.`;
        trend_analysis = 'Preço alto - melhor aguardar';
      } else {
        // Preço ligeiramente acima da média
        recommendation = 'WAIT';
        confidence = 55;
        reason = `Preço ${Math.round((priceRatio - 1) * 100)}% acima da média. Pode valer a pena aguardar.`;
        trend_analysis = 'Preço moderado - considere aguardar';
      }

      // Ajustar confiança baseada na quantidade de dados
      if (stats.total_price_records < 50) {
        confidence = Math.max(30, confidence - 20);
      } else if (stats.total_price_records < 100) {
        confidence = Math.max(40, confidence - 10);
      }

      return {
        recommendation,
        confidence: Math.round(confidence),
        reason,
        current_price_ratio: Math.round(priceRatio * 100) / 100,
        price_trend: trend_analysis,
        details: {
          current_price: currentPrice,
          average_price: stats.average_price,
          min_price: stats.min_price,
          max_price: stats.max_price,
          price_variance: Math.round(priceVariance * 100) / 100,
          trend_analysis
        }
      };
    } catch (error) {
      console.error('Erro na análise de preço:', error);
      throw error;
    }
  },

  // Buscar categorias disponíveis
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Buscar gêneros disponíveis
  getGenres: async (): Promise<string[]> => {
    const response = await api.get('/api/genres');
    return response.data;
  },

  // Verificar status da API
  getStatus: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/');
    return response.data;
  }
};

// API de previsão de desconto 30 dias
export const discountApi = {
  getOne: async (appid: number): Promise<Discount30dResult> => {
    const res = await api.get('/api/ml/discount-30d', { params: { appid } });
    return res.data as Discount30dResult;
  },
  getBatch: async (appids: number[]): Promise<Record<number, Discount30dResult>> => {
    if (!appids || appids.length === 0) return {};
    const res = await api.post('/api/ml/discount-30d/batch', { appids });
    const results = res.data?.results || {};
    const out: Record<number, Discount30dResult> = {};
    for (const k of Object.keys(results)) {
      const num = Number(k);
      const v = results[k];
      if (v && !v.error) out[num] = v as Discount30dResult;
    }
    return out;
  }
};

export default api;