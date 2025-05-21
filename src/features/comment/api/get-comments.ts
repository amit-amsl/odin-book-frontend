import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type PostCommentsResponse = {
  data: Array<Comment>;
  meta: {
    nextCursor: string | null;
  };
};

async function fetchPostComments({
  communityName,
  postId,
  cursor,
}: {
  communityName: string;
  postId: string;
  cursor?: string;
}): Promise<PostCommentsResponse> {
  return api.get(`/post/${communityName}/${postId}/comments`, {
    params: { cursor },
  });
}

export const useInfinitePostComments = (
  communityName: string,
  postId: string
) =>
  useInfiniteQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchPostComments({
        communityName,
        postId,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
