import { api } from '@/lib/api-client';
import { Community } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchCommunity(communityName: string): Promise<Community> {
  return api.get(`/community/${communityName}`);
}

export const useCommunity = (communityName: string) =>
  useQuery({
    queryKey: ['community', communityName],
    queryFn: () => fetchCommunity(communityName),
  });
