import { Navigate, useLocation } from 'react-router';
import { useUser } from '@/lib/auth';
import { Bot } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-16 animate-bounce items-center justify-center rounded-lg">
          <Bot className="size-12" />
        </div>
        <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Authenticating...
        </p>
      </div>
    );

  if (!isAuthenticated)
    return <Navigate to={'/login'} state={{ from: location }} replace />;

  return children;
}
