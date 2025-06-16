import { api } from '@/lib/api-client';
import { PaginatedPage, Post, SortByQueryParam } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type AllCommunitiesFeedResponse = PaginatedPage<Post>;

async function fetchAllCommunitiesFeed({
  cursor,
  sortBy,
}: {
  cursor?: string;
  sortBy?: SortByQueryParam;
}): Promise<AllCommunitiesFeedResponse> {
  return api.get(`/community/all`, { params: { cursor, sort: sortBy } });
}

export const useInfiniteAllCommunitiesFeed = (sortBy: SortByQueryParam) =>
  useInfiniteQuery({
    queryKey: ['community', 'feed', 'all', { sortBy }],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchAllCommunitiesFeed({ cursor: pageParam, sortBy });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
