import { api } from '@/lib/api-client';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createCommunity(data): Promise<any> {
  return api.post('/community', data);
}

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [''] }); // TODO: Update to correct key
    },
  });
};
