import { Comment } from '@/types/api';
import { PostComment } from './comment';

type CommentSectionProps = {
  comments: Array<Comment>;
  communityName: string;
  postId: string;
};

export function CommentSection({
  comments,
  communityName,
  postId,
}: CommentSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <PostComment
          key={comment.id}
          comment={comment}
          communityName={communityName}
          postId={postId}
        >
          {comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((reply) => (
              <PostComment
                key={reply.id}
                comment={reply}
                communityName={communityName}
                postId={postId}
              />
            ))}
        </PostComment>
      ))}
    </div>
  );
}
