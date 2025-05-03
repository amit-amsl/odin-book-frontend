import { api } from '@/lib/api-client';
import { Post } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
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
}): Promise<Post> {
  return api.post(`/post/${communityName}`, data);
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createComment,
  });
};
