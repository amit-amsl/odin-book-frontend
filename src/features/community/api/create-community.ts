import { api } from '@/lib/api-client';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseResponse } from '@/types/api';
import { toast } from 'sonner';

export const createCommunityInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4)
    .max(16)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Community names can only contain letters, numbers and underscores'
    ),
  description: z.string().optional(),
});

export type createCommunityInput = z.infer<typeof createCommunityInputSchema>;

async function createCommunity({
  data,
}: {
  data: createCommunityInput;
}): Promise<BaseResponse & { communityNormalizedName: string }> {
  return api.post('/community', data);
}

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'sidebar-communities'],
      });
      toast(
        `Community c/${variables.data.name} has been created successfully!`
      );
    },
  });
};
