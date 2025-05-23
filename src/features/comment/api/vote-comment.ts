/* eslint-disable @typescript-eslint/no-unused-vars */
import { voteInput } from '@/features/post/api/vote-post';
import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, BaseResponse } from '@/types/api';
import { PostCommentsResponse } from './get-comments';
import { CommentRepliesResponse } from './get-comment-replies';

async function voteComment({
  commentId,
  postId,
  voteValue,
}: {
  commentId: string;
  postId: string;
  voteValue: voteInput;
}): Promise<BaseResponse & Comment> {
  return api.post(`/comments/${commentId}/vote`, { voteValue });
}

export const useCommentVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voteComment,
    onSuccess: (newData, variables) => {
      const { commentId, postId } = variables;
      const { message, ...updatedVotedComment } = newData;
      if (newData.parentCommentId) {
        queryClient.setQueryData<{
          pages: Array<CommentRepliesResponse>;
          pageParams: string[];
        }>(['comment', newData.parentCommentId, 'replies'], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((reply) =>
                reply.id === commentId ? { ...updatedVotedComment } : reply
              ),
            })),
          };
        });
      } else {
        queryClient.setQueryData<{
          pages: Array<PostCommentsResponse>;
          pageParams: string[];
        }>(['post', postId, 'comments'], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) =>
                comment.id === commentId ? { ...updatedVotedComment } : comment
              ),
            })),
          };
        });
      }
    },
  });
};
