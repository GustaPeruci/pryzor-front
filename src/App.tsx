import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ModelMetrics from './components/ml/ModelMetrics';
import GameSearch from './components/games/GameSearch';
import PriceAnalysisResult from './components/analysis/PriceAnalysisResult';
import { gameApi, mlApi, Game, MLPrediction } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ prediction: MLPrediction; game: Game } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await gameApi.searchGames({ search: query, limit: 1 });
      if (!result.games.length) {
        setError('Nenhum jogo encontrado com esse nome. Tente outra busca.');
        return;
      }
      const game = result.games[0];
      const prediction = await mlApi.predictGame(game.appid);
      setAnalysis({ prediction, game });
    } catch (err) {
      console.error('Erro na busca/análise:', err);
      setError('Não foi possível analisar o jogo. Verifique a conexão com a API e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="pryzor-app">
      <Header onOpenMetricsModal={() => setShowMetricsModal(true)} />
      <main className="pryzor-main">
        <div className="pryzor-glow" aria-hidden="true" />
        <div className="pryzor-content">
          <div className="pryzor-eyebrow"><span className="pryzor-status-dot" /> INTELIGÊNCIA DE PREÇOS PARA GAMES</div>
          <h1 className="pryzor-headline">Seu próximo jogo.<br /><span>Na hora certa.</span></h1>
          <p className="pryzor-subtitle">Use inteligência artificial para descobrir se vale a pena comprar agora ou esperar a próxima promoção na Steam.</p>
          <GameSearch onSearch={handleSearch} loading={loading} />
          {error && <div role="alert" className="pryzor-error">{error}</div>}
          <div className="pryzor-trust">
            <span>✦ Previsões com machine learning</span>
            <span>◇ Análise de tendências</span>
            <span>◎ Decisões mais inteligentes</span>
          </div>
        </div>
      </main>
      <footer className="pryzor-footer"><span>© {new Date().getFullYear()} Pryzor</span><span>Projeto de Engenharia de Software · Previsões não garantem descontos futuros.</span></footer>
      {analysis && <PriceAnalysisResult prediction={analysis.prediction} game={analysis.game} onClose={() => setAnalysis(null)} />}
      {showMetricsModal && (
        <div className="pryzor-modal-overlay" onClick={() => setShowMetricsModal(false)}>
          <section role="dialog" aria-modal="true" aria-label="Métricas do modelo" className="pryzor-modal" onClick={e => e.stopPropagation()}>
            <button className="pryzor-modal-close" onClick={() => setShowMetricsModal(false)} aria-label="Fechar métricas">×</button>
            <h2>Métricas do modelo</h2>
            <p>Indicadores de avaliação do modelo preditivo.</p>
            <ModelMetrics />
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
