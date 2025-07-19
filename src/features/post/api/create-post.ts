import { api } from '@/lib/api-client';
import { BaseResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const createPostInputSchema = (postType: 'text' | 'image' | 'youtube') =>
  z
    .object({
      title: z.string().min(12).max(150),
      content: z.string().optional(),
      image: z
        .instanceof(File)
        .refine(
          (file) =>
            file &&
            ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
          'Invalid image file type'
        )
        .refine(
          (file) => file && file.size <= MAX_FILE_SIZE,
          'Image size should not exceed 5MB'
        )
        .optional(),
      youtubeUrl: z
        .string()
        .optional()
        .refine(
          (val) =>
            !val || /^https?:\/\/(www\.)?youtube\.com|youtu\.be/.test(val),
          {
            message: 'Must be a valid YouTube URL',
          }
        ),
      isNSFW: z.boolean(),
      isSpoiler: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (postType === 'image' && !data.image) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['image'],
          message: 'Image is required for image posts',
        });
      }
      if (postType === 'youtube' && !data.youtubeUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['youtubeUrl'],
          message: 'Youtube URL is required for video posts',
        });
      }
    });

export type createPostInput = z.infer<ReturnType<typeof createPostInputSchema>>;

async function createPost({
  communityName,
  data,
}: {
  communityName: string;
  data: createPostInput;
}): Promise<BaseResponse & { postId: string }> {
  return api.post(`/post/${communityName}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast(`Post has been created successfully!`);
    },
  });
};
