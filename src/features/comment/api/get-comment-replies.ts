import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchCommentReplies(commentId: string): Promise<Array<Comment>> {
  return api.get(`/comments/${commentId}/replies`);
}

export const useCommentReplies = (
  commentId: string,
  commentRepliesCount: number
) =>
  useQuery({
    queryKey: ['comment', commentId, 'replies'],
    queryFn: () => fetchCommentReplies(commentId),
    enabled: commentRepliesCount > 0,
  });
