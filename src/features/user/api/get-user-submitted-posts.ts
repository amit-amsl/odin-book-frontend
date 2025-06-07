import { api } from '@/lib/api-client';
import { UserProfilePost } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type UserSubmittedPostsResponse = {
  data: Array<UserProfilePost>;
  meta: {
    nextCursor: string | null;
  };
};

async function fetchUserSubmittedPosts({
  cursor,
  username,
}: {
  username: string;
  cursor?: string;
}): Promise<UserSubmittedPostsResponse> {
  return api.get(`/user/${username}/submittedPosts`, { params: { cursor } });
}

export const useInfiniteUserSubmittedPosts = (username: string) =>
  useInfiniteQuery({
    queryKey: ['user', 'profile', username, 'submitted-posts'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchUserSubmittedPosts({ username, cursor: pageParam });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
