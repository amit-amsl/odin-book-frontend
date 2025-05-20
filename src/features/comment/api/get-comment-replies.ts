import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

// async function fetchCommentReplies(commentId: string): Promise<Array<Comment>> {
//   return api.get(`/comments/${commentId}/replies`);
// }

// export const useCommentReplies = (
//   commentId: string,
//   shouldFetchReplies: boolean
// ) =>
//   useQuery({
//     queryKey: ['comment', commentId, 'replies'],
//     queryFn: () => fetchCommentReplies(commentId),
//     enabled: shouldFetchReplies,
//   });

type CommentRepliesResponse = {
  data: Array<Comment>;
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
};

async function fetchCommentReplies({
  commentId,
  page = 1,
}: {
  commentId: string;
  page?: number;
}): Promise<CommentRepliesResponse> {
  return api.get(`/comments/${commentId}/replies`, { params: { page } });
}

export const useInfiniteCommentReplies = (
  commentId: string,
  shouldFetchReplies: boolean
) =>
  useInfiniteQuery({
    queryKey: ['comment', commentId, 'replies'],
    queryFn: ({ pageParam = 1 }) => {
      return fetchCommentReplies({ commentId, page: pageParam as number });
    },
    enabled: shouldFetchReplies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page === lastPage.meta.totalPages) return undefined;
      const nextPage = lastPage.meta.page + 1;
      return nextPage;
    },
  });
