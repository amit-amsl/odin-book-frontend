import { api } from '@/lib/api-client';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseResponse } from '@/types/api';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const editUserProfileInputSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
      'Invalid image file type'
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'Image size should not exceed 3MB'
    ),
});

export type editUserProfileInput = z.infer<typeof editUserProfileInputSchema>;

async function editUserProfile({
  data,
  username,
}: {
  data: editUserProfileInput;
  username: string;
}): Promise<BaseResponse> {
  // TODO: Fix Promise type
  return api.patch(`/user/${username}/edit`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export const useEditUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUserProfile,
    onSuccess: async (_, variables) => {
      toast.success('User profile updated successfully!');
      return queryClient.invalidateQueries({
        queryKey: ['user', 'profile', variables.username],
      });
    },
  });
};
