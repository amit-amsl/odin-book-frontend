import { api } from '@/lib/api-client';
import { BaseResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

export const createPostInputSchema = z.object({
  title: z.string().min(12).max(150),
  content: z.string().optional(),
  isNSFW: z.boolean(),
  isSpoiler: z.boolean(),
});

export type createPostInput = z.infer<typeof createPostInputSchema>;

async function createComment({
  communityName,
  data,
}: {
  communityName: string;
  data: createPostInput;
}): Promise<BaseResponse & { postId: string }> {
  return api.post(`/post/${communityName}`, data);
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast(`Post has been created successfully!`);
    },
  });
};
