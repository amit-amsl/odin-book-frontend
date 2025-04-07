import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppRoot } from './routes/app/app-root';
import { LoginRoute } from './routes/auth/login';
import { RegisterRoute } from './routes/auth/register';
import { FeedRoute } from './routes/app/feed';
import { CommunityRoute } from './routes/app/c/community';
import { PostRoute } from './routes/app/c/post';
import { ProfileRoute } from './routes/app/profile';

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
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
const DEV_MODE = true;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginRoute />} />
          <Route path="register" element={<RegisterRoute />} />
          <Route path="/" element={<AppRoot />}>
            <Route path="feed" element={<FeedRoute />} />
            <Route path="c/:communityName" element={<CommunityRoute />} />
            <Route path="c/:communityName/:postId" element={<PostRoute />} />
            <Route path="u/:userId" element={<ProfileRoute />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      {DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
