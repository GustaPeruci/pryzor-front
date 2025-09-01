import React, { useState, useEffect } from 'react';
import { apiConfig } from '../config/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface ValidationSummary {
  total_predictions: number;
  unique_games: number;
  period_start: string;
  period_end: string;
  mean_error: number;
  median_error: number;
  max_error: number;
  mean_error_pct: number;
  r2_approx: number;
}

interface GameAnalysis {
  name: string;
  predictions: number;
  mean_error: number;
  std_error: number;
  mean_error_pct: number;
  mean_price: number;
}

interface PriceAnalysis {
  category: string;
  count: number;
  mean_error: number;
  mean_error_pct: number;
}

interface WorstCase {
  name: string;
  date: string;
  price: number;
  predicted: number;
  error: number;
  error_pct: number;
}

interface DetailedData {
  name: string;
  date: string;
  price: number;
  predicted: number;
  error: number;
  error_pct: number;
}

interface ValidationData {
  summary: ValidationSummary;
  games_analysis: GameAnalysis[];
  price_analysis: PriceAnalysis[];
  worst_absolute: WorstCase[];
  worst_percentage: WorstCase[];
  detailed_data: DetailedData[];
}

const TemporalValidation: React.FC = () => {
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValidationData();
  }, []);

  const fetchValidationData = async () => {
    try {
      const response = await fetch(apiConfig.endpoints.temporalValidation);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados de validação');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLabel = (errorPct: number) => {
    if (errorPct < 10) return '🟢 EXCELENTE';
    if (errorPct < 15) return '🟡 BOA';
    if (errorPct < 25) return '🟠 REGULAR';
    return '🔴 RUIM';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-4 text-white text-lg">Carregando validação temporal...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-500/30 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">❌ Erro ao Carregar Dados</h2>
              <p className="text-red-300">{error}</p>
              <button
                onClick={fetchValidationData}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🔍 Validação Temporal do Modelo ML</h1>
          <p className="text-xl opacity-90">
            Análise rigorosa com split 80/20 baseado em ordem cronológica
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">📊 Total de Predições</h3>
            <p className="text-3xl font-bold text-blue-400">{data.summary.total_predictions}</p>
            <p className="text-gray-300 text-sm">{data.summary.unique_games} jogos únicos</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">💰 Erro Médio</h3>
            <p className="text-3xl font-bold text-green-400">R$ {data.summary.mean_error.toFixed(2)}</p>
            <p className="text-gray-300 text-sm">Mediano: R$ {data.summary.median_error.toFixed(2)}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">📈 Erro Percentual</h3>
            <p className="text-3xl font-bold text-yellow-400">{data.summary.mean_error_pct.toFixed(1)}%</p>
            <p className="text-gray-300 text-sm">MAPE médio</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">🎯 R² Score</h3>
            <p className="text-3xl font-bold text-purple-400">{data.summary.r2_approx.toFixed(3)}</p>
            <p className="text-gray-300 text-sm">{getPerformanceLabel(data.summary.mean_error_pct)}</p>
          </div>
        </div>

        {/* Performance por Jogo */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎮 Performance por Jogo</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.games_analysis.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="white" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="white" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="mean_error" fill="#8884d8" name="Erro Médio (R$)" />
                <Bar dataKey="mean_error_pct" fill="#82ca9d" name="Erro % Médio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Análise por Faixa de Preço */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💰 Performance por Faixa de Preço</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.price_analysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.mean_error_pct.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.price_analysis.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">⚠️ Casos Extremos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Maiores Erros Absolutos:</h3>
                {data.worst_absolute.slice(0, 3).map((item, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-3 mb-2">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-300 text-sm">
                      Real: R$ {item.price.toFixed(2)} | Previsto: R$ {item.predicted.toFixed(2)}
                    </p>
                    <p className="text-red-400 text-sm">
                      Erro: R$ {item.error.toFixed(2)} ({item.error_pct.toFixed(1)}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scatter Plot: Real vs Previsto */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📊 Real vs Previsto</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data.detailed_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="price" 
                  stroke="white" 
                  name="Preço Real"
                  type="number"
                />
                <YAxis 
                  dataKey="predicted" 
                  stroke="white" 
                  name="Preço Previsto"
                  type="number"
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [
                    `R$ ${value.toFixed(2)}`,
                    'Valor'
                  ]}
                />
                <Scatter 
                  data={data.detailed_data} 
                  fill="#8884d8" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">💡 Recomendações para Melhoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📈 Coleta de Dados</h3>
                <p className="text-gray-300 text-sm">
                  Expandir histórico para jogos com poucos dados e implementar features específicas
                </p>
              </div>
              
              <div className="bg-green-500/20 rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">🤖 Algoritmo</h3>
                <p className="text-gray-300 text-sm">
                  Considerar ensemble methods e regularização mais forte para evitar overfitting
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-500/20 rounded-lg p-4">
                <h3 className="text-purple-300 font-semibold mb-2">🔍 Features</h3>
                <p className="text-gray-300 text-sm">
                  Investigar padrões sazonais e criar features específicas por faixa de preço
                </p>
              </div>
              
              <div className="bg-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-300 font-semibold mb-2">📊 Validação</h3>
                <p className="text-gray-300 text-sm">
                  Implementar validação cruzada temporal e métricas específicas por categoria
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TemporalValidation;
