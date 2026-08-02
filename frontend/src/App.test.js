import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));

test('renders SQL Agent header branding', () => {
  render(<App />);
  // Use getAllByText to handle multiple matches, then pick the first instance
  const titleElements = screen.getAllByText(/sql Agent/i);
  expect(titleElements[0]).toBeInTheDocument();
});

test('renders get started action button', () => {
  render(<App />);
  // Alternatively, query by role for the specific "Get started" button
  const buttonElements = screen.getAllByRole('button', { name: /get started/i });
  expect(buttonElements[0]).toBeInTheDocument();
});