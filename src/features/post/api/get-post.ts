import { api } from '@/lib/api-client';
import { PostExtended } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchPost(
  communityName: string,
  postId: string
): Promise<PostExtended> {
  return api.get(`/post/${communityName}/${postId}`);
}

export const usePost = (communityName: string, postId: string) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(communityName, postId),
  });
