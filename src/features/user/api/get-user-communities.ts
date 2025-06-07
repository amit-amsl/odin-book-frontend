import { api } from '@/lib/api-client';
import { SidebarUserCommunity } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchUserCommunities(): Promise<Array<SidebarUserCommunity>> {
  return api.get(`/user/communities`);
}

export const useUserCommunities = () =>
  useQuery({
    queryKey: ['user', 'sidebar-communities'],
    queryFn: fetchUserCommunities,
  });
