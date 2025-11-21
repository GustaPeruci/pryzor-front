import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza título principal', () => {
  render(<App />);
  const titleElement = screen.getByText(/Pryzor/i);
  expect(titleElement).toBeInTheDocument();
});
