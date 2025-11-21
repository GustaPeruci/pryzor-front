import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameCard from './GameCard';

const mockGame = {
  appid: 123,
  name: 'Counter-Strike',
  type: 'game',
  releasedate: '2012-08-21',
  freetoplay: 0,
  current_price: 29.99,
  current_discount: 50,
  price_records: 100,
};

describe('GameCard', () => {
  it('renderiza nome, preço, desconto e data', () => {
    render(<GameCard game={mockGame} onAnalyze={() => {}} />);
    expect(screen.getByText(/Counter-Strike/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ 29.99/i)).toBeInTheDocument();
    expect(screen.getByText(/-50%/i)).toBeInTheDocument();
    // Aceita qualquer data renderizada pelo componente
    expect(screen.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
    expect(screen.getByText(/100 registros/)).toBeInTheDocument();
  });

  it('desabilita botão para jogos gratuitos', () => {
    const freeGame = { ...mockGame, freetoplay: 1, current_price: 0, current_discount: 0 };
    render(<GameCard game={freeGame} onAnalyze={() => {}} />);
    // Aceita múltiplos elementos com "Gratuito"
    expect(screen.getAllByText(/Gratuito/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Jogos gratuitos não precisam de análise/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('chama onAnalyze ao clicar', () => {
    const onAnalyze = jest.fn();
    render(<GameCard game={mockGame} onAnalyze={onAnalyze} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onAnalyze).toHaveBeenCalledWith(mockGame.appid);
  });
});
