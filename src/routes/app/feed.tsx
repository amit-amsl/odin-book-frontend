import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInfiniteCommunitiesFeed } from '@/features/community/api/get-communities-feed';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { Loader2 } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

export function FeedRoute() {
  const communitiesFeedQuery = useInfiniteCommunitiesFeed();

  if (communitiesFeedQuery.isLoading) return <div>Loading...</div>;

  const communitiesFeed = communitiesFeedQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!communitiesFeed?.length) return null;

  return (
    <ScrollArea className="">
      <div className="flex flex-col gap-2 p-2">
        <Separator className="" />
        {communitiesFeed.map((post) => (
          <Fragment key={post.id}>
            <PostFeedView
              location="feed"
              post={post}
              key={post.id}
              communityName={post.community.normalizedName}
            />
            <Separator className="" />
          </Fragment>
        ))}
      </div>
      {communitiesFeedQuery.hasNextPage && (
        <div className="mb-3 flex items-center justify-center">
          <Button onClick={() => communitiesFeedQuery.fetchNextPage()}>
            {communitiesFeedQuery.isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              'Load more posts...'
            )}
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}
