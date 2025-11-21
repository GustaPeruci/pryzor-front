import React from 'react';
import { render, screen } from '@testing-library/react';
import GameList from './GameList';

const mockGames = [
  {
    appid: 1,
    name: 'Counter-Strike',
    type: 'game',
    releasedate: '2012-08-21',
    freetoplay: 0,
    current_price: 29.99,
    current_discount: 50,
    price_records: 100,
  },
  {
    appid: 2,
    name: 'Portal',
    type: 'game',
    releasedate: '2007-10-10',
    freetoplay: 0,
    current_price: 19.99,
    current_discount: 75,
    price_records: 80,
  },
];

describe('GameList', () => {
  it('renderiza lista de jogos', () => {
    render(<GameList games={mockGames} onAnalyze={() => {}} />);
    expect(screen.getByText(/Counter-Strike/i)).toBeInTheDocument();
    expect(screen.getByText(/Portal/i)).toBeInTheDocument();
  });

  it('exibe mensagem de loading', () => {
    render(<GameList games={[]} loading={true} onAnalyze={() => {}} />);
    expect(screen.getByText(/Buscando jogos/i)).toBeInTheDocument();
  });

  it('exibe mensagem de nenhum jogo encontrado', () => {
    render(<GameList games={[]} loading={false} onAnalyze={() => {}} />);
    expect(screen.getByText(/Nenhum jogo encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/Tente buscar com um termo diferente/i)).toBeInTheDocument();
  });
});
