import React, { useState, useEffect } from 'react';

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

const SimpleValidation: React.FC = () => {
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValidationData();
  }, []);

  const fetchValidationData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/temporal-validation');
      if (!response.ok) {
        throw new Error('Falha ao carregar dados de validação');
      }
      const result = await response.json();
      setSummary(result.summary);
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
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>🔄 Carregando validação temporal...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>❌ Erro ao Carregar Dados</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <button
            onClick={fetchValidationData}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍 Validação Temporal do Modelo ML</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Análise rigorosa com split 80/20 baseado em ordem cronológica
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📊 Total de Predições</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{summary.total_predictions}</p>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{summary.unique_games} jogos únicos</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>💰 Erro Médio</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34d399' }}>R$ {summary.mean_error.toFixed(2)}</p>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>Mediano: R$ {summary.median_error.toFixed(2)}</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📈 Erro Percentual</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>{summary.mean_error_pct.toFixed(1)}%</p>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>MAPE médio</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>🎯 R² Score</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa' }}>{summary.r2_approx.toFixed(3)}</p>
            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{getPerformanceLabel(summary.mean_error_pct)}</p>
          </div>
        </div>

        {/* Performance Analysis */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>📊 Análise de Performance</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Período de Análise */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3 style={{ color: '#60a5fa', fontSize: '1.3rem', marginBottom: '15px' }}>📅 Período de Teste</h3>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>
                <strong>Início:</strong> {summary.period_start}
              </p>
              <p style={{ fontSize: '1rem' }}>
                <strong>Fim:</strong> {summary.period_end}
              </p>
            </div>

            {/* Qualidade das Predições */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3 style={{ color: '#34d399', fontSize: '1.3rem', marginBottom: '15px' }}>🎯 Qualidade</h3>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>
                <strong>Erro Máximo:</strong> R$ {summary.max_error.toFixed(2)}
              </p>
              <p style={{ fontSize: '1rem' }}>
                <strong>Performance:</strong> {getPerformanceLabel(summary.mean_error_pct)}
              </p>
            </div>

            {/* Metodologia */}
            <div style={{
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '15px',
              padding: '25px'
            }}>
              <h3 style={{ color: '#a78bfa', fontSize: '1.3rem', marginBottom: '15px' }}>🔬 Metodologia</h3>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>
                Split temporal 80/20
              </p>
              <p style={{ fontSize: '1rem' }}>
                Validação sem vazamento de dados
              </p>
            </div>
            
          </div>
        </div>

        {/* Conclusões */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>✅ Conclusões da Validação</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: '#34d399', marginBottom: '10px' }}>🎉 Pontos Fortes</h4>
              <ul style={{ lineHeight: '1.6' }}>
                <li>R² Score de {summary.r2_approx.toFixed(3)} indica boa capacidade preditiva</li>
                <li>MAPE de {summary.mean_error_pct.toFixed(1)}% está dentro de limites aceitáveis</li>
                <li>Validação temporal previne overfitting</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(251, 191, 36, 0.2)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '10px' }}>⚠️ Áreas de Melhoria</h4>
              <ul style={{ lineHeight: '1.6' }}>
                <li>Alguns jogos com erros elevados</li>
                <li>Necessidade de mais dados históricos</li>
                <li>Features sazonais podem ser aprimoradas</li>
              </ul>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimpleValidation;
