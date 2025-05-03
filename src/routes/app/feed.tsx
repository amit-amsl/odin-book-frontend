import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCommunitiesFeed } from '@/features/community/api/get-communities-feed';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { Fragment } from 'react/jsx-runtime';

export function FeedRoute() {
  const communitiesFeedQuery = useCommunitiesFeed();

  if (communitiesFeedQuery.isLoading) return <div>Loading...</div>;

  const communitiesFeed = communitiesFeedQuery.data;

  if (!communitiesFeed) return null;

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
    </ScrollArea>
  );
}
