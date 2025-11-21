import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ModelMetrics from './ModelMetrics';

jest.mock('../../services/api', () => ({
  mlApi: {
    getModelInfo: jest.fn().mockResolvedValue({
      version: '2.0',
      precision: 0.9,
      f1_score: 0.74,
      recall: 0.63,
      trained_at: '2025-10-01',
      validation_method: 'temporal',
    }),
  },
}));

describe('ModelMetrics', () => {
  it('renderiza métricas do modelo', async () => {
    const { mlApi } = require('../../services/api');
    mlApi.getModelInfo.mockResolvedValueOnce({
      loaded: true,
      version: '2.0',
      validation_method: 'temporal',
      trained_at: '2025-10-01',
      features_count: 8,
      metrics: {
        precision: 0.9,
        f1_score: 0.74,
        recall: 0.63,
        accuracy: 0.75,
        roc_auc: 0.8,
      },
    });
    render(<ModelMetrics />);
    await waitFor(() => {
      expect(screen.getByText(/2.0/)).toBeInTheDocument();
      expect(screen.getAllByText(/90.00%/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/74.00%/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/63.00%/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/75.00%/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/80.00%/).length).toBeGreaterThan(0);
      expect(screen.getByText(/temporal/i)).toBeInTheDocument();
    });
  });

  it('exibe erro se falhar', async () => {
    const { mlApi } = require('../../services/api');
    mlApi.getModelInfo.mockRejectedValueOnce(new Error('fail'));
    render(<ModelMetrics />);
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar as métricas do modelo/i)).toBeInTheDocument();
    });
  });
});
