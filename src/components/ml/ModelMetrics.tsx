import React, { useEffect, useState } from 'react';
import { mlApi, type ModelMetrics as ModelMetricsType } from '../../services/api';

const MetricCard: React.FC<{ 
  label: string; 
  value: string | number; 
  description?: string;
  highlight?: boolean;
}> = ({ label, value, description, highlight }) => (
  <div className={`px-3 py-2.5 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">{label}</div>
    <div className={`text-xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
      {value}
    </div>
    {description && (
      <div className="text-xs text-gray-600 mt-0.5">{description}</div>
    )}
  </div>
);

const ModelMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadMetrics = async () => {
      try {
        const data = await mlApi.getModelInfo();
        if (!cancelled) {
          setMetrics(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Não foi possível carregar as métricas do modelo');
          setLoading(false);
        }
      }
    };

    loadMetrics();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-red-700">{error || 'Erro ao carregar métricas'}</span>
        </div>
      </div>
    );
  }

  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      {/* Cabeçalho compacto */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Modelo de Machine Learning v{metrics.version}
        </h3>
        <p className="text-xs text-gray-500">
          {metrics.validation_method} • Treinado em {formatDate(metrics.trained_at)} • {metrics.features_count} features
        </p>
      </div>

      {/* Métricas principais - Grid compacto */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard
          label="Precision"
          value={formatPercentage(metrics.metrics.precision)}
          description="Alta confiabilidade"
          highlight={true}
        />
        <MetricCard
          label="F1-Score"
          value={formatPercentage(metrics.metrics.f1_score)}
          description="Balanço geral"
        />
        <MetricCard
          label="Recall"
          value={formatPercentage(metrics.metrics.recall)}
          description="Cobertura"
        />
        <MetricCard
          label="Accuracy"
          value={formatPercentage(metrics.metrics.accuracy)}
          description="Taxa de acerto"
        />
        <MetricCard
          label="ROC-AUC"
          value={formatPercentage(metrics.metrics.roc_auc)}
          description="Separação"
        />
      </div>

      {/* Informação extra compacta */}
      <div className="mt-3 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-800">
            <strong>Precision {formatPercentage(metrics.metrics.precision)}:</strong> Quando o modelo prevê desconto, 
            acerta {Math.round(metrics.metrics.precision * 100)} em 100 vezes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;

