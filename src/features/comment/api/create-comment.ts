import { api } from '@/lib/api-client';
import { Comment, PostExtended } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const createCommentInputSchema = z.object({
  content: z.string().trim().min(1),
});

export type createCommentInput = z.infer<typeof createCommentInputSchema>;

async function createComment({
  communityName,
  postId,
  data,
}: {
  communityName: string;
  postId: string;
  data: createCommentInput;
}): Promise<Comment> {
  return api.post(`/post/${communityName}/${postId}/comment`, data);
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newData, variables) => {
      const { postId } = variables;

      queryClient.setQueryData(['post', postId], (oldData: PostExtended) => {
        return {
          ...oldData,
          comments: [...oldData.comments, { ...newData }],
          _count: {
            ...oldData._count,
            comments: oldData._count.comments + 1,
          },
        };
      });
    },
  });
};
