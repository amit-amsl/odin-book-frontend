import { api } from '@/lib/api-client';
import { PaginatedPage, Post } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type AllCommunitiesFeedResponse = PaginatedPage<Post>;

async function fetchAllCommunitiesFeed({
  cursor,
}: {
  cursor?: string;
}): Promise<AllCommunitiesFeedResponse> {
  return api.get(`/community/all`, { params: { cursor } });
}

export const useInfiniteAllCommunitiesFeed = () =>
  useInfiniteQuery({
    queryKey: ['community', 'feed', 'all'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchAllCommunitiesFeed({ cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
