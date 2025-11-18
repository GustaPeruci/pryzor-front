import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ModelMetrics from './components/ml/ModelMetrics';
import GameSearch from './components/games/GameSearch';
import GameList from './components/games/GameList';
import PriceAnalysisResult from './components/analysis/PriceAnalysisResult';
import { gameApi, mlApi, Game, MLPrediction } from './services/api';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzingGameId, setAnalyzingGameId] = useState<number | undefined>();
  const [analysis, setAnalysis] = useState<{
    prediction: MLPrediction;
    game: Game;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await gameApi.searchGames({
        search: query,
        limit: 20
      });
      setGames(result.games);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar jogos. Verifique se a API está rodando.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnalyze = useCallback(async (gameId: number) => {
    setAnalyzingGameId(gameId);
    setError(null);

    try {
      const prediction = await mlApi.predictGame(gameId);
      const gameData = games.find(g => g.appid === gameId);

      if (!gameData) {
        throw new Error('Jogo não encontrado');
      }

      setAnalysis({
        prediction,
        game: gameData
      });
    } catch (err) {
      console.error('Erro na análise:', err);
      setError('Erro ao fazer previsão. Verifique se a API está rodando.');
    } finally {
      setAnalyzingGameId(undefined);
    }
  }, [games]);

  const closeAnalysis = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section com Busca */}
        <div className="mb-8">
          <GameSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* Métricas do Modelo - Compactas */}
        <div className="mb-8">
          <ModelMetrics />
        </div>

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

        {/* Lista de jogos */}
        {(games.length > 0 || loading) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resultados da Busca
            </h2>
            <GameList
              games={games}
              loading={loading}
              onAnalyze={handleAnalyze}
              analyzingGameId={analyzingGameId}
            />
          </div>
        )}
      </main>

      {/* Modal de análise */}
      {analysis && (
        <PriceAnalysisResult
          prediction={analysis.prediction}
          game={analysis.game}
          onClose={closeAnalysis}
        />
      )}
    </div>
  );
}

export default App;

