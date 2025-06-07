import { api } from '@/lib/api-client';
import { PaginatedPage, Post } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type CommunityPostsResponse = PaginatedPage<Post>;

async function fetchCommunityPosts({
  communityName,
  cursor,
}: {
  communityName: string;
  cursor?: string;
}): Promise<CommunityPostsResponse> {
  return api.get(`/community/${communityName}/posts`, { params: { cursor } });
}

export const useInfiniteCommunityPosts = (communityName: string) =>
  useInfiniteQuery({
    queryKey: ['community', communityName, 'posts'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchCommunityPosts({ communityName, cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
