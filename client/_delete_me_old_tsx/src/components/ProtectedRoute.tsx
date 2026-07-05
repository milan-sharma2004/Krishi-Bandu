import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export default function ProtectedRoute({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
