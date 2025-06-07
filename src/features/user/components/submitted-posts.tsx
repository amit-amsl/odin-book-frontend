import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useInfiniteUserSubmittedPosts } from '../api/get-user-submitted-posts';
import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

type SubmittedPostsProps = {
  username: string;
};

export function SubmittedPosts({ username }: SubmittedPostsProps) {
  const navigate = useNavigate();
  const submittedPostsQuery = useInfiniteUserSubmittedPosts(username);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && submittedPostsQuery.hasNextPage)
      submittedPostsQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inView,
    submittedPostsQuery.hasNextPage,
    submittedPostsQuery.fetchNextPage,
  ]);

  if (submittedPostsQuery.isLoading)
    return (
      <div className="mt-5 flex grow justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const submittedPosts = submittedPostsQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!submittedPosts?.length)
    return (
      <div className="mt-3 flex flex-col items-center justify-center gap-2">
        <TriangleAlert size={48} />
        <p className="text-lg font-bold">
          Looks like you haven't posted anything yet...
        </p>
      </div>
    );

  return (
    <main className="">
      {submittedPosts.map((submittedPost) => (
        <div
          key={submittedPost.id}
          className="cursor-pointer"
          onClick={() =>
            navigate(
              `/c/${submittedPost.communityNormalizedName}/${submittedPost.id}`
            )
          }
        >
          <div className="hover:bg-accent/50 flex gap-2 rounded-lg p-3 text-left transition-colors">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-1">
                <Link
                  to={`/c/${submittedPost.communityNormalizedName}`}
                  className="text-muted-foreground text-xs transition-colors hover:text-cyan-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {`c/${submittedPost.communityNormalizedName}`}
                </Link>
                <span className="text-xs">•</span>
                <time
                  className="text-xs"
                  dateTime={new Date(submittedPost.createdAt).toISOString()}
                >
                  {formatDate(submittedPost.createdAt)}
                </time>
              </div>
              <div className="font-semibold tracking-tight sm:text-base">
                {submittedPost.title}
              </div>
              <div className="flex gap-1">
                <Button
                  className="text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer text-xs"
                  variant={'ghost'}
                >
                  {submittedPost._count.comments} comments
                </Button>
                <Button
                  className="text-muted-foreground hover:bg-muted-foreground/20 text-xs"
                  variant={'ghost'}
                  onClick={(e) => e.stopPropagation()}
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={ref} className="mb-3 flex items-center justify-center">
        {submittedPostsQuery.isFetchingNextPage && <p>Loading more posts...</p>}
      </div>
    </main>
  );
}
