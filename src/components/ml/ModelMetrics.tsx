import React, { useEffect, useState } from 'react';
import { discountApi, type DiscountModelMetrics } from '../../services/api';

const MetricPill: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
    <span className="text-gray-500 mr-1">{label}:</span>
    <span className="font-medium">{value ?? '—'}</span>
  </div>
);

const ModelMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<DiscountModelMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await discountApi.getMetrics();
        if (!cancelled) setMetrics(m);
      } catch (e) {
        if (!cancelled) setError('Não foi possível carregar métricas do modelo');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!metrics) {
    return <div className="text-sm text-gray-500">Carregando métricas do modelo...</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MetricPill label="Threshold" value={metrics.threshold?.toFixed(2)} />
      {metrics.metrics?.pr_auc_mean != null && (
        <MetricPill label="PR-AUC" value={metrics.metrics.pr_auc_mean.toFixed(3)} />
      )}
      {metrics.metrics?.roc_auc_mean != null && (
        <MetricPill label="ROC-AUC" value={metrics.metrics.roc_auc_mean.toFixed(3)} />
      )}
      {metrics.class_prevalence != null && (
        <MetricPill label="Prevalência" value={(metrics.class_prevalence * 100).toFixed(1) + '%'} />
      )}
      {metrics.date_min && metrics.date_max && (
        <MetricPill label="Período" value={`${metrics.date_min} → ${metrics.date_max}`} />
      )}
    </div>
  );
};

export default ModelMetrics;
