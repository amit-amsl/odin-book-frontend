import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInfiniteAllCommunitiesFeed } from '@/features/community/api/get-communities-posts-all';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { Fragment } from 'react/jsx-runtime';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function AllFeedRoute() {
  const allCommunitiesFeedQuery = useInfiniteAllCommunitiesFeed();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && allCommunitiesFeedQuery.hasNextPage)
      allCommunitiesFeedQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inView,
    allCommunitiesFeedQuery.hasNextPage,
    allCommunitiesFeedQuery.fetchNextPage,
  ]);

  if (allCommunitiesFeedQuery.isLoading)
    return (
      <div className="mt-5 flex justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const communitiesFeed = allCommunitiesFeedQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!communitiesFeed?.length) return null;

  return (
    <ScrollArea className="">
      <div className="flex flex-col gap-2 p-2">
        <Separator className="" />
        {communitiesFeed.map((post) => (
          <Fragment key={post.id}>
            <PostFeedView key={post.id} post={post} location="feed" />
            <Separator className="" />
          </Fragment>
        ))}
      </div>
      {/* Intersection Observer trigger */}
      <div ref={ref} className="mb-3 flex items-center justify-center">
        {allCommunitiesFeedQuery.isFetchingNextPage && (
          <p>Loading more posts...</p>
        )}
      </div>
    </ScrollArea>
  );
}
