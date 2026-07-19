import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Browse from './Browse.jsx';

vi.mock('../../api/client.js', () => ({
  default: { get: vi.fn() },
  getErrorMessage: vi.fn(() => 'Something went wrong. Please try again.'),
}));

import api from '../../api/client.js';

function renderBrowse() {
  return render(
    <MemoryRouter>
      <Browse />
    </MemoryRouter>
  );
}

describe('Browse (buyer marketplace)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading state before the fetch resolves', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderBrowse();
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('fetches from the API and displays returned listing fields', async () => {
    api.get.mockResolvedValue({
      data: [
        { _id: 'p1', name: 'Fresh Tomatoes', variety: 'Hybrid', pricePerKg: 45, seller: { location: 'Kavre' } },
      ],
    });

    renderBrowse();

    await waitFor(() => expect(screen.getByText('Fresh Tomatoes')).toBeInTheDocument());
    expect(screen.getByText('Rs 45/kg')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/products', { params: {} });
  });

  it('shows an empty state when no products are returned', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderBrowse();
    await waitFor(() => expect(screen.getByText(/no products found/i)).toBeInTheDocument());
  });

  it('shows an error state when the fetch fails', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    renderBrowse();
    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });

  it('does not render any hard-coded demo products', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderBrowse();
    await waitFor(() => expect(screen.getByText(/no products found/i)).toBeInTheDocument());
    expect(screen.queryByText(/tomato/i)).not.toBeInTheDocument();
  });
});
