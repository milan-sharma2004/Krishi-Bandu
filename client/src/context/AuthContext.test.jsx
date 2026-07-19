import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

vi.mock('../api/client.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
  getToken: vi.fn(),
  setToken: vi.fn(),
  getErrorMessage: vi.fn((e) => e?.response?.data?.message || 'Something went wrong'),
}));

import api, { getToken, setToken } from '../api/client.js';

function TestConsumer() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="user">{user?.name || ''}</span>
      <button onClick={() => login('ravi@example.com', 'password123')}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restores a valid session from an existing token on load', async () => {
    getToken.mockReturnValue('existing-token');
    api.get.mockResolvedValue({ data: { user: { name: 'Ravi Kumar', role: 'farmer' } } });

    renderAuth();

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authed').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe('Ravi Kumar');
    expect(api.get).toHaveBeenCalledWith('/auth/me');
  });

  it('does not call /auth/me and stays logged out when there is no stored token', async () => {
    getToken.mockReturnValue(null);

    renderAuth();

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authed').textContent).toBe('false');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('clears an invalid session when /auth/me fails', async () => {
    getToken.mockReturnValue('stale-token');
    api.get.mockRejectedValue(new Error('unauthorized'));

    renderAuth();

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authed').textContent).toBe('false');
    expect(setToken).toHaveBeenCalledWith(null);
  });

  it('updates auth state immediately after a successful login', async () => {
    getToken.mockReturnValue(null);
    api.post.mockResolvedValue({ data: { token: 'fresh-token', user: { name: 'Ravi Kumar', role: 'farmer' } } });

    renderAuth();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    fireEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('authed').textContent).toBe('true'));
    expect(screen.getByTestId('user').textContent).toBe('Ravi Kumar');
    expect(setToken).toHaveBeenCalledWith('fresh-token', false);
  });

  it('clears session state on logout', async () => {
    getToken.mockReturnValue('existing-token');
    api.get.mockResolvedValue({ data: { user: { name: 'Ravi Kumar', role: 'farmer' } } });

    renderAuth();
    await waitFor(() => expect(screen.getByTestId('authed').textContent).toBe('true'));

    fireEvent.click(screen.getByText('logout'));

    expect(screen.getByTestId('authed').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('');
    expect(setToken).toHaveBeenCalledWith(null);
  });
});
