import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameSearch from './GameSearch';

describe('GameSearch', () => {
  it('renderiza título e popular games', () => {
    render(<GameSearch onSearch={() => {}} />);
    expect(screen.getByText(/Encontre o Melhor Preço/i)).toBeInTheDocument();
    expect(screen.getByText(/Counter-Strike/i)).toBeInTheDocument();
    expect(screen.getByText(/Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Dota 2/i)).toBeInTheDocument();
  });

  it('chama onSearch ao submeter', () => {
    const onSearch = jest.fn();
    render(<GameSearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/Digite o nome do jogo/i);
    fireEvent.change(input, { target: { value: 'Half-Life' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('Half-Life');
  });

  it('não chama onSearch se input vazio', () => {
    const onSearch = jest.fn();
    render(<GameSearch onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/Digite o nome do jogo/i);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).not.toHaveBeenCalled();
  });
});
