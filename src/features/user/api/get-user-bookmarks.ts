import { api } from '@/lib/api-client';
import { PaginatedPage, UserProfilePost } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type UserBookmarksResponse = PaginatedPage<UserProfilePost>;

async function fetchUserBookmarks({
  cursor,
  username,
}: {
  username: string;
  cursor?: string;
}): Promise<UserBookmarksResponse> {
  return api.get(`/user/${username}/bookmarks`, { params: { cursor } });
}

export const useInfiniteUserBookmarks = (username: string) =>
  useInfiniteQuery({
    queryKey: ['user', 'profile', username, 'bookmarks'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchUserBookmarks({ username, cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
