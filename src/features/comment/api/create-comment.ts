import { api } from '@/lib/api-client';
import { Comment, PostExtended } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { PostCommentsResponse } from './get-comments';

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

      queryClient.setQueryData<{
        pages: Array<PostCommentsResponse>;
        pageParams: string[];
      }>(['post', postId, 'comments'], (oldData) => {
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
      queryClient.setQueryData(['post', postId], (oldData: PostExtended) => {
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            comments: oldData._count.comments + 1,
          },
        };
      });
      toast('Comment has been created successfully!');
    },
  });
};
