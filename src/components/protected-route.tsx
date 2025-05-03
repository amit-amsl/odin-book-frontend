import { Navigate, useLocation } from 'react-router';
import { useUser } from '@/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated)
    return <Navigate to={'/login'} state={{ from: location }} replace />;

  return children;
}
