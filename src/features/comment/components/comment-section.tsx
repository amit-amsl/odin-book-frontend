import { PostComment } from './comment';
import { useInfinitePostComments } from '../api/get-comments';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CommentSectionProps = {
  communityName: string;
  postId: string;
};

export function CommentSection({ communityName, postId }: CommentSectionProps) {
  const postCommentsQuery = useInfinitePostComments(communityName, postId);

  if (postCommentsQuery.isLoading) return <div>loading...</div>;

  const postComments = postCommentsQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!postComments?.length) return null;

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
      {postCommentsQuery.hasNextPage && (
        <div className="mb-3 flex items-center justify-center">
          <Button onClick={() => postCommentsQuery.fetchNextPage()}>
            {postCommentsQuery.isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              'Load more comments...'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
