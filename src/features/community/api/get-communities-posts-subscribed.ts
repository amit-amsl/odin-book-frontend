import { api } from '@/lib/api-client';
import { PaginatedPage, Post } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type SubscribedCommunitiesFeedResponse = PaginatedPage<Post>;

async function fetchSubscribedCommunitiesFeed({
  cursor,
}: {
  cursor?: string;
}): Promise<SubscribedCommunitiesFeedResponse> {
  return api.get(`/community/feed`, { params: { cursor } });
}

export const useInfiniteSubscribedCommunitiesFeed = () =>
  useInfiniteQuery({
    queryKey: ['community', 'feed', 'subscribed'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchSubscribedCommunitiesFeed({ cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
