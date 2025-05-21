import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type CommentRepliesResponse = {
  data: Array<Comment>;
  meta: {
    nextCursor: string | null;
  };
};

async function fetchCommentReplies({
  commentId,
  cursor,
}: {
  commentId: string;
  cursor?: string;
}): Promise<CommentRepliesResponse> {
  return api.get(`/comments/${commentId}/replies`, { params: { cursor } });
}

export const useInfiniteCommentReplies = (
  commentId: string,
  shouldFetchReplies: boolean
) =>
  useInfiniteQuery({
    queryKey: ['comment', commentId, 'replies'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchCommentReplies({ commentId, cursor: pageParam });
    },
    enabled: shouldFetchReplies,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor;
    },
  });
