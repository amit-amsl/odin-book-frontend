import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

type PostCommentsResponse = {
  data: Array<Comment>;
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
};

async function fetchPostComments({
  communityName,
  postId,
  page = 1,
}: {
  communityName: string;
  postId: string;
  page?: number;
}): Promise<PostCommentsResponse> {
  return api.get(`/post/${communityName}/${postId}/comments`, {
    params: { page },
  });
}

export const useInfinitePostComments = (
  communityName: string,
  postId: string
) =>
  useInfiniteQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam = 1 }) => {
      return fetchPostComments({
        communityName,
        postId,
        page: pageParam as number,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page === lastPage.meta.totalPages) return undefined;
      const nextPage = lastPage.meta.page + 1;
      return nextPage;
    },
  });
