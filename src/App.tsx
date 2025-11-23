import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ModelMetrics from './components/ml/ModelMetrics';
import GameSearch from './components/games/GameSearch';
import PriceAnalysisResult from './components/analysis/PriceAnalysisResult';
import { gameApi, mlApi, Game, MLPrediction } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    prediction: MLPrediction;
    game: Game;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await gameApi.searchGames({
        search: query,
        limit: 1
      });
      
      if (result.games.length === 0) {
        setError('Nenhum jogo encontrado com esse nome.');
        setLoading(false);
        return;
      }
      
      const game = result.games[0];
      
      // Buscar predição diretamente
      const prediction = await mlApi.predictGame(game.appid);
      
      setAnalysis({
        prediction,
        game
      });
    } catch (err) {
      console.error('Erro na busca/análise:', err);
      setError('Erro ao buscar jogo ou fazer previsão. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  // handleAnalyze removido - busca agora faz predição diretamente

  const closeAnalysis = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenMetricsModal={() => setShowMetricsModal(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section com Busca */}
        <div className="mb-8">
          <GameSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* ...botão removido, agora está no header... */}

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Lista removida - busca abre modal diretamente */}
      </main>

      {/* Modal de análise */}
      {analysis && (
        <PriceAnalysisResult
          prediction={analysis.prediction}
          game={analysis.game}
          onClose={closeAnalysis}
        />
      )}

      {/* Modal de métricas do modelo */}
      {showMetricsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowMetricsModal(false)}
              aria-label="Fechar"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Métricas do Modelo</h2>
            <ModelMetrics />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

