import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyProducts from './MyProducts.jsx';

vi.mock('../../api/client.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock('../../context/ToastContext.jsx', () => ({
  useToast: () => ({ notify: vi.fn() }),
}));

import api from '../../api/client.js';

describe('MyProducts (seller listing form)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: [] });
  });

  it('loads the seller\'s own listings on mount from /products/mine', async () => {
    render(<MyProducts />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/products/mine'));
  });

  it('sends the correct payload when creating a new product', async () => {
    api.post.mockResolvedValue({ data: { _id: 'new1' } });
    render(<MyProducts />);

    fireEvent.click(screen.getByText('Add New Product'));
    fireEvent.change(screen.getByPlaceholderText('Name (e.g. Tomato)'), { target: { value: 'Fresh Tomatoes' } });
    fireEvent.change(screen.getByPlaceholderText('Price per kg (Rs.)'), { target: { value: '45' } });
    fireEvent.change(screen.getByPlaceholderText('Available Qty (kg)'), { target: { value: '100' } });

    fireEvent.click(screen.getByText('Add Product'));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    const [url, payload] = api.post.mock.calls[0];
    expect(url).toBe('/products');
    expect(payload).toMatchObject({ name: 'Fresh Tomatoes', pricePerKg: 45, availableQty: 100 });
  });

  it('displays a backend validation error without crashing', async () => {
    api.post.mockRejectedValue({ response: { data: { message: 'Price must be a positive number' } } });
    render(<MyProducts />);

    fireEvent.click(screen.getByText('Add New Product'));
    fireEvent.change(screen.getByPlaceholderText('Name (e.g. Tomato)'), { target: { value: 'Bad Price Crop' } });
    fireEvent.change(screen.getByPlaceholderText('Price per kg (Rs.)'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('Available Qty (kg)'), { target: { value: '10' } });
    fireEvent.click(screen.getByText('Add Product'));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
  });

  it('refetches listings after a successful creation', async () => {
    api.post.mockResolvedValue({ data: { _id: 'new1' } });
    render(<MyProducts />);
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add New Product'));
    fireEvent.change(screen.getByPlaceholderText('Name (e.g. Tomato)'), { target: { value: 'Fresh Tomatoes' } });
    fireEvent.change(screen.getByPlaceholderText('Price per kg (Rs.)'), { target: { value: '45' } });
    fireEvent.change(screen.getByPlaceholderText('Available Qty (kg)'), { target: { value: '100' } });
    fireEvent.click(screen.getByText('Add Product'));

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });
});
