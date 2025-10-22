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
      // Busca o jogo e a previsão do modelo
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
        {/* Busca + Métricas do modelo */}
        <div className="mb-12">
          <GameSearch onSearch={handleSearch} loading={loading} />
          <div className="mt-6">
            <ModelMetrics />
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de jogos */}
        {(games.length > 0 || loading) && (
          <div className="mb-12">
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

        {/* Seção inicial */}
        {games.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 text-blue-300 mb-8">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Pryzor
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Use Machine Learning para prever quando jogos da Steam vão entrar em promoção.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Busque Jogos</h3>
                <p className="text-gray-600">Digite o nome do jogo para começar</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Previsão com ML</h3>
                <p className="text-gray-600">Modelo v2.0 com 90% de precision</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Economize Dinheiro</h3>
                <p className="text-gray-600">Compre na hora certa e economize</p>
              </div>
            </div>
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

