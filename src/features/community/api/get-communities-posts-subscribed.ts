import { api } from '@/lib/api-client';
import { PaginatedPage, Post, SortByQueryParam } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type SubscribedCommunitiesFeedResponse = PaginatedPage<Post>;

async function fetchSubscribedCommunitiesFeed({
  cursor,
  sortBy,
}: {
  cursor?: string;
  sortBy?: SortByQueryParam;
}): Promise<SubscribedCommunitiesFeedResponse> {
  return api.get(`/community/feed`, { params: { cursor, sort: sortBy } });
}

export const useInfiniteSubscribedCommunitiesFeed = (
  sortBy: SortByQueryParam
) =>
  useInfiniteQuery({
    queryKey: ['community', 'feed', 'subscribed', { sortBy }],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchSubscribedCommunitiesFeed({ cursor: pageParam, sortBy });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
