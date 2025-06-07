import { api } from '@/lib/api-client';
import { UserProfile } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchUserProfile({
  username,
}: {
  username: string;
}): Promise<UserProfile> {
  return api.get(`/user/${username}`);
}

export const useUserProfile = (username: string) =>
  useQuery({
    queryKey: ['user', 'profile', username],
    queryFn: () => fetchUserProfile({ username }),
  });
