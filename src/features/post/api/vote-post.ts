import { CommunitiesFeedResponse } from '@/features/community/api/get-communities-feed';
import { api } from '@/lib/api-client';
import { BaseResponse, Community, Post } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const handleVotingSchema = z.literal(1).or(z.literal(-1));

export type voteInput = z.infer<typeof handleVotingSchema>;

async function votePost({
  communityName,
  postId,
  voteValue,
}: {
  communityName: string;
  postId: string;
  voteValue: voteInput;
}): Promise<BaseResponse & Post> {
  return api.post(`/post/${communityName}/${postId}/vote`, { voteValue });
}

export const usePostVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: votePost,
    onSuccess: (newData, variables) => {
      const { communityName, postId } = variables;
      if (queryClient.getQueryData(['community', communityName])) {
        queryClient.setQueryData(
          ['community', communityName],
          (oldData: Community) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { message, ...updatedVotedPost } = newData;
            return {
              ...oldData,
              posts: [
                ...oldData.posts.map((post) => {
                  if (post.id === postId) {
                    return { ...updatedVotedPost };
                  }
                  return post;
                }),
              ],
            };
          }
        );
      }
      if (queryClient.getQueryData(['post', postId])) {
        queryClient.setQueryData(['post', postId], (oldData: Post) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message, ...updatedVotedPost } = newData;
          return {
            ...oldData,
            _count: {
              upvotes: updatedVotedPost._count.upvotes,
              downvotes: updatedVotedPost._count.downvotes,
            },
            upvotes: [...updatedVotedPost.upvotes],
            downvotes: [...updatedVotedPost.downvotes],
          };
        });
      }
      if (queryClient.getQueryData(['community', 'feed'])) {
        queryClient.setQueryData<{
          pages: Array<CommunitiesFeedResponse>;
          pageParams: number[];
        }>(['community', 'feed'], (oldData) => {
          if (!oldData) return oldData;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message, ...updatedVotedPost } = newData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === updatedVotedPost.id
                  ? {
                      ...post,
                      _count: {
                        ...post._count,
                        upvotes: updatedVotedPost._count.upvotes,
                        downvotes: updatedVotedPost._count.downvotes,
                      },
                      upvotes: [...updatedVotedPost.upvotes],
                      downvotes: [...updatedVotedPost.downvotes],
                    }
                  : post
              ),
            })),
          };
        });
      }
    },
  });
};
