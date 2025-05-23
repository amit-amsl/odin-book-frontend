import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentInput } from './create-comment';
import { Comment } from '@/types/api';
import { CommentRepliesResponse } from './get-comment-replies';
import { PostCommentsResponse } from './get-comments';

async function createCommentReply({
  communityName,
  postId,
  commentId,
  data,
}: {
  communityName: string;
  postId: string;
  commentId: string;
  data: createCommentInput;
}): Promise<Comment> {
  return api.post(`/post/${communityName}/${postId}/${commentId}/reply`, data);
}

export const useCreateCommentReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentReply,
    onSuccess: (newData, variables) => {
      const { postId, commentId } = variables;

      queryClient.setQueryData<{
        pages: Array<CommentRepliesResponse>;
        pageParams: string[];
      }>(['comment', newData.parentCommentId, 'replies'], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [newData, ...oldData.pages[0].data],
              meta: {
                ...oldData.pages[0].meta,
              },
            },
            ...oldData.pages.slice(1),
          ],
        };
      });

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
              comment.id === commentId
                ? {
                    ...comment,
                    _count: {
                      ...comment._count,
                      replies: comment._count.replies + 1,
                    },
                  }
                : comment
            ),
          })),
        };
      });
    },
  });
};
