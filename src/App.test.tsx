import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza título principal e marca', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Seu próximo jogo.*Na hora certa/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Pryzor, início/i })).toBeInTheDocument();
});
