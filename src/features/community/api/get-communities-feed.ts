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
    page: number;
    total: number;
    totalPages: number;
  };
};

async function fetchCommunitiesFeed({
  page = 1,
}: {
  page?: number;
}): Promise<CommunitiesFeedResponse> {
  return api.get(`/community/feed`, { params: { page } });
}

export const useInfiniteCommunitiesFeed = () =>
  useInfiniteQuery({
    queryKey: ['community', 'feed'],
    queryFn: ({ pageParam = 1 }) => {
      return fetchCommunitiesFeed({ page: pageParam as number });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page === lastPage.meta.totalPages) return undefined;
      const nextPage = lastPage.meta.page + 1;
      return nextPage;
    },
  });
