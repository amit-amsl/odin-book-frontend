import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentInput } from './create-comment';
import { PostExtended, Comment } from '@/types/api';

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

      // queryClient.setQueryData<Array<Comment>>(
      //   ['comment', commentId, 'replies'],
      //   (oldData = []) => [newData, ...oldData]
      // );
      // queryClient.setQueryData(['post', postId], (oldData: PostExtended) => {
      //   return {
      //     ...oldData,
      //     _count: {
      //       ...oldData._count,
      //       comments: oldData._count.comments + 1,
      //     },
      //   };
      // });
    },
  });
};
