import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriceAnalysisResult from './PriceAnalysisResult';

const mockPrediction = {
  appid: 1,
  game_name: 'Counter-Strike',
  will_have_discount: true,
  probability: 0.78,
  confidence: 0.56,
  current_discount: 50,
  current_price: 29.99,
  recommendation: 'AGUARDAR',
  recommendation_text: 'Espere por desconto melhor',
  reasoning: ['Sazonalidade', 'Desconto atual'],
  model_version: '2.0',
  prediction_date: '2025-11-21',
};

const mockGame = {
  appid: 1,
  name: 'Counter-Strike',
  type: 'game',
  releasedate: '2012-08-21',
  freetoplay: 0,
  current_price: 29.99,
  current_discount: 50,
  price_records: 100,
};

describe('PriceAnalysisResult', () => {
  it('renderiza informações de predição', () => {
    render(<PriceAnalysisResult prediction={mockPrediction} game={mockGame} onClose={() => {}} />);
    expect(screen.getByText(/Counter-Strike/i)).toBeInTheDocument();
    expect(screen.getByText(/Espere por desconto melhor/i)).toBeInTheDocument();
    expect(screen.getByText(/2.0/)).toBeInTheDocument();
    expect(screen.getByText(/Sazonalidade/)).toBeInTheDocument();
    expect(screen.getByText(/Desconto atual/)).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão', () => {
    const onClose = jest.fn();
    render(<PriceAnalysisResult prediction={mockPrediction} game={mockGame} onClose={onClose} />);
    // O botão de fechar não tem texto, só ícone
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
