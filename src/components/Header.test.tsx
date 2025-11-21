import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renderiza o título do projeto', () => {
  render(<Header />);
  expect(screen.getByText(/Pryzor/i)).toBeInTheDocument();
});
