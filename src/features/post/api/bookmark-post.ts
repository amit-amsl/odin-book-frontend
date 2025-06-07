import { api } from '@/lib/api-client';
import { BaseResponse, InfiniteData, Post } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function handlePostBookmark({
  communityName,
  postId,
}: {
  communityName: string;
  postId: string;
}): Promise<BaseResponse & { isPostBookmarked: boolean }> {
  return api.post(`/post/${communityName}/${postId}/bookmark`);
}

export const usePostBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handlePostBookmark,
    onSuccess: (newData, variables) => {
      const { postId, communityName } = variables;
      const { isPostBookmarked } = newData;

      const updatedPostsQueriesData = (oldData: InfiniteData<Post>) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isPostBookmarked,
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

      queryClient.setQueryData(['post', postId], (oldData: Post) => {
        return {
          ...oldData,
          isPostBookmarked,
        };
      });
    },
  });
};
