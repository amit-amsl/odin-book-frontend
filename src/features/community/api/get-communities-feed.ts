import { api } from '@/lib/api-client';
import { Post } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchCommunitiesFeed(): Promise<
  Array<
    Post & {
      community: { normalizedName: string };
    }
  >
> {
  return api.get(`/community/feed`);
}

export const useCommunitiesFeed = () =>
  useQuery({
    queryKey: ['community', 'feed'],
    queryFn: () => fetchCommunitiesFeed(),
  });
