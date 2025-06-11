import { PostComment } from './comment';
import { useInfinitePostComments } from '../api/get-comments';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { MessagesSquare } from 'lucide-react';
import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';

type CommentSectionProps = {
  communityName: string;
  postId: string;
};

export function CommentSection({ communityName, postId }: CommentSectionProps) {
  const postCommentsQuery = useInfinitePostComments(communityName, postId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && postCommentsQuery.hasNextPage)
      postCommentsQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, postCommentsQuery.hasNextPage, postCommentsQuery.fetchNextPage]);

  if (postCommentsQuery.isLoading)
    return (
      <div className="mt-5 flex justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const postComments = postCommentsQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!postComments?.length)
    return (
      <div className="mt-3 flex flex-col items-center text-center">
        <MessagesSquare size={48} />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Be the first to comment
        </h4>
        <p className="leading-7">
          Nobody's responded to this post yet. Add your thoughts and get the
          conversation going.
        </p>
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-2">
      {postComments.map((comment) => (
        <PostComment
          key={comment.id}
          comment={comment}
          communityName={communityName}
          postId={postId}
        />
      ))}
      <div ref={ref} className="mb-3 flex items-center justify-center">
        {postCommentsQuery.isFetchingNextPage && (
          <p>Loading more comments...</p>
        )}
      </div>
    </div>
  );
}
