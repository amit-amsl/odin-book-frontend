import { PostComment } from './comment';
import { usePostComments } from '../api/get-comments';

type CommentSectionProps = {
  communityName: string;
  postId: string;
};

export function CommentSection({ communityName, postId }: CommentSectionProps) {
  const postCommentsQuery = usePostComments(communityName, postId);

  if (postCommentsQuery.isLoading) return <div>loading...</div>;

  const postComments = postCommentsQuery.data;

  if (!postComments) return null;

  return (
    <div className="flex flex-col gap-2">
      {postComments.map((comment) => (
        <PostComment
          key={comment.id}
          comment={comment}
          communityName={communityName}
          postId={postId}
        />
      ))}
    </div>
  );
}

/* {comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((reply) => (
              <PostComment
                key={reply.id}
                comment={reply}
                communityName={communityName}
                postId={postId}
              />
            ))} */
