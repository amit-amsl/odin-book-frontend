import { api } from '@/lib/api-client';
import { Comment } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

async function fetchPostComments(
  communityName: string,
  postId: string
): Promise<Array<Comment>> {
  return api.get(`/post/${communityName}/${postId}/comments`);
}

export const usePostComments = (communityName: string, postId: string) =>
  useQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: () => fetchPostComments(communityName, postId),
  });
