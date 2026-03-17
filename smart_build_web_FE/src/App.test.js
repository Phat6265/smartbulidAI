import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SmartBuild', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /smartbuild/i });
  expect(heading).toBeInTheDocument();
});
