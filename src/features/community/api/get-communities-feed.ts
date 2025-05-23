import { api } from '@/lib/api-client';
import { Post } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type CommunitiesFeedResponse = {
  data: Array<
    Post & {
      community: { normalizedName: string };
    }
  >;
  meta: {
    nextCursor: string | null;
  };
};

async function fetchCommunitiesFeed({
  cursor,
}: {
  cursor?: string;
}): Promise<CommunitiesFeedResponse> {
  return api.get(`/community/feed`, { params: { cursor } });
}

export const useInfiniteCommunitiesFeed = () =>
  useInfiniteQuery({
    queryKey: ['community', 'feed'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchCommunitiesFeed({ cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
