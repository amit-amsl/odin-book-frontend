import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

async function fetchUserCommunities(): Promise<
  Array<{ name: string; normalizedName: string }>
> {
  return api.get(`/user/communities`);
}

export const useUserCommunities = () =>
  useQuery({
    queryKey: ['user', 'sidebar-communities'],
    queryFn: fetchUserCommunities,
  });
