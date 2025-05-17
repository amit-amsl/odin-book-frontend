import { api } from '@/lib/api-client';
import { BaseResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function handleCommunitySubscription(
  communityName: string
): Promise<BaseResponse> {
  return api.post(`/community/${communityName}/subscribe`);
}

export const useCommunitySubscribe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleCommunitySubscription,
    onSuccess: (_, communityName) => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'sidebar-communities'],
      });
      return queryClient.invalidateQueries({
        queryKey: ['community', communityName],
      });
    },
  });
};
