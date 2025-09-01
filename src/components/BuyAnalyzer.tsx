import { useState, useEffect } from 'react';
import { apiConfig } from '../config/api';

interface BuyAnalysisResult {
  success: boolean;
  game_name: string;
  analysis: {
    score: number;
    recommendation: {
      emoji: string;
      title: string;
      message: string;
      action: string;
    };
    price_stats: {
      current: number;
      min: number;
      max: number;
      average: number;
      median: number;
      position: string;
      percentile: number;
    };
    trend: {
      direction: string;
      change_percentage: number;
      score: number;
    };
    discounts: {
      has_discounts: boolean;
      average_discount: number;
      max_discount: number;
      days_since_last?: number;
      frequency: number;
    };
    data_info: {
      total_records: number;
      period_start: string;
      period_end: string;
    };
  };
  error?: string;
}

interface AvailableGame {
  name: string;
  records: number;
  price_range: {
    min: number;
    max: number;
    is_free: boolean;
  };
  last_update: string;
}

interface RegisteredGame {
  id: number;
  steam_id: string;
  name: string;
  current_price?: number;
  price?: number;
}

export default function BuyAnalyzer() {
  const [searchGame, setSearchGame] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [registeredGames, setRegisteredGames] = useState<RegisteredGame[]>([]);
  const [analysisResult, setAnalysisResult] = useState<BuyAnalysisResult | null>(null);
  const [availableGames, setAvailableGames] = useState<AvailableGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGamesList, setShowGamesList] = useState(false);
  const [inputMode, setInputMode] = useState<'selector' | 'manual'>('selector');

  // Carregar jogos cadastrados ao iniciar
  useEffect(() => {
    loadRegisteredGames();
  }, []);

  const loadRegisteredGames = async () => {
    try {
      const response = await fetch(apiConfig.endpoints.games);
      const data = await response.json();
      if (data.success) {
        setRegisteredGames(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar jogos cadastrados:', error);
    }
  };

  const analyzeGame = async () => {
    const gameName = inputMode === 'selector' ? selectedGame : searchGame;
    
    if (!gameName.trim()) {
      alert(inputMode === 'selector' ? 'Selecione um jogo!' : 'Digite o nome de um jogo!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiConfig.endpoints.buyAnalysis}/${encodeURIComponent(gameName)}`);
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Erro ao analisar jogo:', error);
      setAnalysisResult({
        success: false,
        game_name: gameName,
        analysis: {
          score: 0,
          recommendation: { emoji: '', title: '', message: '', action: '' },
          price_stats: { current: 0, min: 0, max: 0, average: 0, median: 0, position: '', percentile: 0 },
          trend: { direction: '', change_percentage: 0, score: 0 },
          discounts: { has_discounts: false, average_discount: 0, max_discount: 0, frequency: 0 },
          data_info: { total_records: 0, period_start: '', period_end: '' }
        },
        error: 'Erro de conexão com a API'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiConfig.endpoints.buyAnalysis);
      const data = await response.json();
      if (data.success) {
        setAvailableGames(data.games);
        setShowGamesList(true);
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Verde
    if (score >= 65) return '#F59E0B'; // Amarelo
    if (score >= 45) return '#F97316'; // Laranja
    return '#EF4444'; // Vermelho
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return '#D1FAE5'; // Verde claro
    if (score >= 65) return '#FEF3C7'; // Amarelo claro
    if (score >= 45) return '#FED7AA'; // Laranja claro
    return '#FEE2E2'; // Vermelho claro
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5em' }}>🎯 Analisador de Compra</h1>
        <p style={{ margin: 0, fontSize: '1.2em', opacity: 0.9 }}>
          Descubra se é o melhor momento para comprar um jogo!
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div style={{ 
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        {/* Modo de Input */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>🎮 Escolha um jogo</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              onClick={() => setInputMode('selector')}
              style={{
                padding: '8px 16px',
                backgroundColor: inputMode === 'selector' ? '#3B82F6' : '#E5E7EB',
                color: inputMode === 'selector' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              📋 Selecionar da Lista
            </button>
            <button
              onClick={() => setInputMode('manual')}
              style={{
                padding: '8px 16px',
                backgroundColor: inputMode === 'manual' ? '#3B82F6' : '#E5E7EB',
                color: inputMode === 'manual' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ✏️ Digitar Nome
            </button>
          </div>
        </div>

        {/* Input baseado no modo selecionado */}
        {inputMode === 'selector' ? (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #E5E7EB',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">Selecione um jogo...</option>
              {registeredGames
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((game) => (
                  <option key={game.id} value={game.name}>
                    {game.name} {game.current_price || game.price ? 
                      `- R$ ${(game.current_price || game.price || 0).toFixed(2)}` : 
                      '- Gratuito'
                    }
                  </option>
                ))
              }
            </select>
            <button
              onClick={analyzeGame}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '🔍 Analisando...' : '🎮 Analisar'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={searchGame}
              onChange={(e) => setSearchGame(e.target.value)}
              placeholder="Digite o nome do jogo (ex: The Witcher 3, Cyberpunk, Apex)"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #E5E7EB',
                fontSize: '16px',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && analyzeGame()}
            />
            <button
              onClick={analyzeGame}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '🔍 Analisando...' : '🎮 Analisar'}
            </button>
          </div>
        )}

        {/* Informações dos jogos cadastrados */}
        <div style={{ 
          background: '#F8FAFC',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
            📊 <strong>{registeredGames.length} jogos</strong> cadastrados no sistema
          </div>
          {inputMode === 'selector' && (
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Selecione um jogo da lista para análise automática
            </div>
          )}
          {inputMode === 'manual' && (
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Digite o nome exato do jogo ou use o modo seletor para maior precisão
            </div>
          )}
        </div>

        <button
          onClick={loadAvailableGames}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📋 Ver análise detalhada dos jogos disponíveis
        </button>
      </div>

      {/* Lista de Jogos Disponíveis */}
      {showGamesList && availableGames.length > 0 && (
        <div style={{ 
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>🎮 Jogos Disponíveis ({availableGames.length})</h3>
            <button
              onClick={() => setShowGamesList(false)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}>
            {availableGames.slice(0, 20).map((game, index) => (
              <div
                key={index}
                onClick={() => {
                  setSearchGame(game.name);
                  setShowGamesList(false);
                }}
                style={{
                  padding: '12px',
                  borderBottom: index < 19 ? '1px solid #F3F4F6' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{game.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {game.records} registros • Última atualização: {game.last_update}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '14px' }}>
                  {game.price_range.is_free ? (
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>GRATUITO</span>
                  ) : (
                    <span>R$ {game.price_range.min.toFixed(2)} - {game.price_range.max.toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {availableGames.length > 20 && (
            <div style={{ textAlign: 'center', padding: '10px', color: '#6B7280', fontSize: '14px' }}>
              Mostrando 20 de {availableGames.length} jogos
            </div>
          )}
        </div>
      )}

      {/* Resultado da Análise */}
      {analysisResult && (
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {analysisResult.success ? (
            <>
              {/* Header com Score */}
              <div style={{ 
                background: getScoreBg(analysisResult.analysis.score),
                padding: '25px',
                textAlign: 'center',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em' }}>
                  {analysisResult.game_name}
                </h2>
                <div style={{ 
                  fontSize: '3em',
                  margin: '10px 0'
                }}>
                  {analysisResult.analysis.recommendation.emoji}
                </div>
                <div style={{ 
                  fontSize: '2em',
                  fontWeight: 'bold',
                  color: getScoreColor(analysisResult.analysis.score),
                  margin: '10px 0'
                }}>
                  {analysisResult.analysis.score}/100
                </div>
                <div style={{ 
                  fontSize: '1.3em',
                  fontWeight: 'bold',
                  color: getScoreColor(analysisResult.analysis.score)
                }}>
                  {analysisResult.analysis.recommendation.title}
                </div>
                <div style={{ 
                  fontSize: '1.1em',
                  marginTop: '5px',
                  color: '#374151'
                }}>
                  {analysisResult.analysis.recommendation.message}
                </div>
              </div>

              {/* Informações Detalhadas */}
              <div style={{ padding: '25px' }}>
                {/* Preço Atual */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '25px'
                }}>
                  <div style={{ 
                    background: '#F8FAFC',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>💰 Preço Atual</h4>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#1F2937' }}>
                      {analysisResult.analysis.price_stats.current === 0 ? 
                        'GRATUITO' : 
                        `R$ ${analysisResult.analysis.price_stats.current.toFixed(2)}`
                      }
                    </div>
                    <div style={{ marginTop: '5px', color: '#6B7280' }}>
                      Posição: {analysisResult.analysis.price_stats.position.toUpperCase()} ({analysisResult.analysis.price_stats.percentile}° percentil)
                    </div>
                  </div>

                  <div style={{ 
                    background: '#F8FAFC',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>📈 Tendência</h4>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1F2937' }}>
                      {analysisResult.analysis.trend.direction.toUpperCase()}
                    </div>
                    <div style={{ marginTop: '5px', color: '#6B7280' }}>
                      {analysisResult.analysis.trend.change_percentage > 0 ? '+' : ''}
                      {analysisResult.analysis.trend.change_percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Estatísticas de Preço */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>📊 Estatísticas Históricas</h4>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9em', color: '#6B7280' }}>Mínimo</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        R$ {analysisResult.analysis.price_stats.min.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9em', color: '#6B7280' }}>Máximo</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        R$ {analysisResult.analysis.price_stats.max.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9em', color: '#6B7280' }}>Média</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        R$ {analysisResult.analysis.price_stats.average.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9em', color: '#6B7280' }}>Mediana</div>
                      <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        R$ {analysisResult.analysis.price_stats.median.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações de Desconto */}
                {analysisResult.analysis.discounts.has_discounts && (
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>🏷️ Histórico de Descontos</h4>
                    <div style={{ 
                      background: '#FEF3C7',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #F59E0B'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Desconto médio:</strong> {analysisResult.analysis.discounts.average_discount.toFixed(0)}%
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Desconto máximo:</strong> {analysisResult.analysis.discounts.max_discount.toFixed(0)}%
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Frequência:</strong> {analysisResult.analysis.discounts.frequency.toFixed(1)}% dos registros
                      </div>
                      {analysisResult.analysis.discounts.days_since_last && (
                        <div>
                          <strong>Último desconto:</strong> há {analysisResult.analysis.discounts.days_since_last} dias
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informações dos Dados */}
                <div style={{ 
                  background: '#F1F5F9',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '0.9em',
                  color: '#475569'
                }}>
                  <strong>📋 Dados da análise:</strong><br />
                  {analysisResult.analysis.data_info.total_records} registros de preço • 
                  Período: {analysisResult.analysis.data_info.period_start} até {analysisResult.analysis.data_info.period_end}
                </div>

                {/* Ação Recomendada */}
                <div style={{ 
                  marginTop: '20px',
                  padding: '20px',
                  background: getScoreBg(analysisResult.analysis.score),
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `2px solid ${getScoreColor(analysisResult.analysis.score)}`
                }}>
                  <div style={{ 
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: getScoreColor(analysisResult.analysis.score)
                  }}>
                    💡 Ação recomendada: {analysisResult.analysis.recommendation.action}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              padding: '40px',
              textAlign: 'center',
              color: '#EF4444'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>❌</div>
              <h3 style={{ margin: '0 0 10px 0' }}>Erro na Análise</h3>
              <p style={{ margin: 0, color: '#6B7280' }}>
                {analysisResult.error || 'Jogo não encontrado ou dados insuficientes'}
              </p>
              <div style={{ 
                marginTop: '15px',
                padding: '10px',
                background: '#FEE2E2',
                borderRadius: '6px',
                fontSize: '0.9em'
              }}>
                💡 Dica: Verifique se o nome está correto ou escolha um jogo da lista de disponíveis
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instruções de Uso */}
      {!analysisResult && (
        <div style={{ 
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>🚀 Como usar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ 
              background: '#F0F9FF',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #BAE6FD'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>📋</div>
              <h4 style={{ margin: '0 0 10px 0', color: '#0369A1' }}>Modo Seletor</h4>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
                Escolha um dos {registeredGames.length} jogos cadastrados diretamente da lista
              </p>
            </div>
            <div style={{ 
              background: '#F0FDF4',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>✏️</div>
              <h4 style={{ margin: '0 0 10px 0', color: '#15803D' }}>Modo Manual</h4>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
                Digite o nome de qualquer jogo para busca livre
              </p>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px',
            fontSize: '0.9em',
            color: '#9CA3AF',
            fontStyle: 'italic'
          }}>
            💡 Dica: Use o modo seletor para maior precisão, ou o modo manual para jogos não cadastrados
          </div>
        </div>
      )}
    </div>
  );
}
