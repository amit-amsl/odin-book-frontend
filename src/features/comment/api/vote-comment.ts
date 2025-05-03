import { voteInput } from '@/features/post/api/vote-post';
import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, BaseResponse, PostExtended } from '@/types/api';

async function voteComment({
  communityName,
  postId,
  commentId,
  voteValue,
}: {
  communityName: string;
  postId: string;
  commentId: string;
  voteValue: voteInput;
}): Promise<BaseResponse & Comment> {
  return api.post(`/post/${communityName}/${postId}/${commentId}/vote`, {
    voteValue,
  });
}

export const useCommentVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voteComment,
    onSuccess: (newData, variables) => {
      const { postId, commentId } = variables;

      if (queryClient.getQueryData(['post', postId])) {
        queryClient.setQueryData(['post', postId], (oldData: PostExtended) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { message, ...updatedVotedComment } = newData;
          if (newData.parentCommentId) {
            return {
              ...oldData,
              comments: [
                ...oldData.comments.map((comment) => {
                  return {
                    ...comment,
                    replies: [
                      ...comment.replies.map((reply) => {
                        if (reply.id === commentId) {
                          return { ...updatedVotedComment };
                        }
                        return reply;
                      }),
                    ],
                  };
                }),
              ],
            };
          } else {
            return {
              ...oldData,
              comments: [
                ...oldData.comments.map((comment) => {
                  if (comment.id === commentId) {
                    return {
                      ...comment,
                      _count: {
                        upvotes: updatedVotedComment._count.upvotes,
                        downvotes: updatedVotedComment._count.downvotes,
                      },
                      upvotes: [...updatedVotedComment.upvotes],
                      downvotes: [...updatedVotedComment.downvotes],
                    };
                  }
                  return comment;
                }),
              ],
            };
          }
        });
      }
    },
  });
};
