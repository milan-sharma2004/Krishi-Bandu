import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext.jsx';

function renderProtected(initialEntry, roles) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/buyer" element={<div>Buyer Home</div>} />
        <Route
          path="/farmer"
          element={
            <ProtectedRoute roles={roles}>
              <div>Farmer Dashboard</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('shows a loading state while auth is still resolving', () => {
    useAuth.mockReturnValue({ loading: true, isAuthenticated: false, user: null });
    renderProtected('/farmer', ['farmer']);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated users to the internal login route', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: false, user: null });
    renderProtected('/farmer', ['farmer']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content for an authenticated user with the correct role', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: true, user: { role: 'farmer' } });
    renderProtected('/farmer', ['farmer']);
    expect(screen.getByText('Farmer Dashboard')).toBeInTheDocument();
  });

  it('redirects an authenticated user with the wrong role to their own home instead of rendering the page', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: true, user: { role: 'buyer' } });
    renderProtected('/farmer', ['farmer']);
    expect(screen.getByText('Buyer Home')).toBeInTheDocument();
    expect(screen.queryByText('Farmer Dashboard')).not.toBeInTheDocument();
  });
});
