import { Navigate } from 'react-router';
import { useUser } from '@/lib/auth';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) return <Navigate to={'/'} />;

  return children;
}
