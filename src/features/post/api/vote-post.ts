import { api } from '@/lib/api-client';
import { BaseResponse, InfiniteData, Post } from '@/types/api';
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message, ...updatedVotedPost } = newData;

      const updatedPostsQueriesData = (oldData: InfiniteData<Post>) => {
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
                    isPostUpvoted: updatedVotedPost.isPostUpvoted,
                    isPostDownvoted: updatedVotedPost.isPostDownvoted,
                  }
                : post
            ),
          })),
        };
      };

      queryClient.setQueriesData<InfiniteData<Post>>(
        { queryKey: ['community', 'feed'] },
        (oldData) => {
          if (!oldData) return oldData;
          return updatedPostsQueriesData(oldData);
        }
      );

      if (queryClient.getQueryData(['community', communityName, 'posts'])) {
        queryClient.setQueryData<InfiniteData<Post>>(
          ['community', communityName, 'posts'],
          (oldData) => {
            if (!oldData) return oldData;
            return updatedPostsQueriesData(oldData);
          }
        );
      }

      if (queryClient.getQueryData(['post', postId])) {
        queryClient.setQueryData(['post', postId], (oldData: Post) => {
          return {
            ...oldData,
            _count: {
              ...oldData._count,
              upvotes: updatedVotedPost._count.upvotes,
              downvotes: updatedVotedPost._count.downvotes,
            },
            isPostUpvoted: updatedVotedPost.isPostUpvoted,
            isPostDownvoted: updatedVotedPost.isPostDownvoted,
          };
        });
      }
    },
  });
};
