import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute } from './components/protected-route';
import { PublicRoute } from './components/public-route';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Bot } from 'lucide-react';

const LoginRoute = lazy(() => import('./routes/auth/login'));
const RegisterRoute = lazy(() => import('./routes/auth/register'));
const AppRoot = lazy(() => import('./routes/app/app-root'));
const SubscribedFeedRoute = lazy(() => import('./routes/app/subscribed-feed'));
const AllFeedRoute = lazy(() => import('./routes/app/all-feed'));
const PostRoute = lazy(() => import('./routes/app/c/post'));
const CommunityRoute = lazy(() => import('./routes/app/c/community'));
const UserProfileRoute = lazy(() => import('./routes/app/user/user-profile'));
const CommunityCreationRoute = lazy(
  () => import('./routes/app/communities/community-create')
);
const PostCreationRoute = lazy(() => import('./routes/app/c/post-create'));

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.response?.status === 401) {
        console.error(`${error.response?.data.message}`);
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 3,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
const DEV_MODE = true;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-16 animate-bounce items-center justify-center rounded-lg">
                  <Bot className="size-12" />
                </div>
                <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Loading app...
                </p>
              </div>
            }
          >
            <Routes>
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <LoginRoute />
                  </PublicRoute>
                }
              />
              <Route
                path="register"
                element={
                  <PublicRoute>
                    <RegisterRoute />
                  </PublicRoute>
                }
              />
              <Route
                element={
                  <ProtectedRoute>
                    <AppRoot />
                  </ProtectedRoute>
                }
              >
                <Route path="feed" element={<SubscribedFeedRoute />} />
                <Route
                  path="communities/create"
                  element={<CommunityCreationRoute />}
                />
                <Route path="c/all" element={<AllFeedRoute />} />
                <Route path="c/:communityName" element={<CommunityRoute />} />
                <Route
                  path="c/:communityName/create"
                  element={<PostCreationRoute />}
                />
                <Route
                  path="c/:communityName/:postId"
                  element={<PostRoute />}
                />
                <Route path="user/:username" element={<UserProfileRoute />} />
              </Route>

              <Route path="*" element={<Navigate to="/feed" />} />
            </Routes>
          </Suspense>
          <Toaster position="top-center" />
        </BrowserRouter>
      </ThemeProvider>
      {DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
