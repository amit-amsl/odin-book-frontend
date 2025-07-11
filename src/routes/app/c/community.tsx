import { Button } from '@/components/ui/button';
import { useCommunity } from '@/features/community/api/get-community';
import { useCommunitySubscribe } from '@/features/community/api/subscribe-community';
import { Bot, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { useInfiniteCommunityPosts } from '@/features/community/api/get-community-posts';
import { useInView } from 'react-intersection-observer';
import { Fragment, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Avatar from 'boring-avatars';

export default function CommunityRoute() {
  const params = useParams();
  const communityName = params.communityName as string;

  const communityQuery = useCommunity(communityName);

  const communityPostsQuery = useInfiniteCommunityPosts(communityName);

  const communitySubscriptionMutation = useCommunitySubscribe();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && communityPostsQuery.hasNextPage)
      communityPostsQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inView,
    communityPostsQuery.hasNextPage,
    communityPostsQuery.fetchNextPage,
  ]);

  if (communityQuery.isLoading || communityPostsQuery.isLoading)
    return (
      <div className="mt-5 flex justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const community = communityQuery.data;

  const communityPosts = communityPostsQuery.data?.pages.flatMap(
    (page) => page.data
  );

  if (!community)
    return (
      <div className="mt-14 flex flex-col items-center justify-center gap-2 text-center">
        <div className="bg-accent text-sidebar-primary flex aspect-square size-16 items-center justify-center rounded-lg">
          <Bot className="size-12" />
        </div>
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
          Community not found.
        </h1>
        <p className="max-w-md">
          There aren’t any communities on Tidder with that name. Double-check
          the community name or try searching for similar communities.
        </p>
        <Button variant={'default'} className="mt-2" asChild>
          <Link to={'/'}>Return to home</Link>
        </Button>
      </div>
    );

  return (
    <div>
      <header className="bg-muted flex flex-col shadow-sm">
        <div className="relative h-48 w-full overflow-hidden p-3">
          <Avatar
            className="h-full w-full rounded-sm"
            name={communityName}
            variant="marble"
            square
            preserveAspectRatio="none"
            colors={['#84b295', '#eccf8d', '#bb8138', '#ac2005', '#2c1507']}
          />
        </div>
        <div className="relative flex gap-4 p-4">
          <Avatar
            name={communityName}
            className="md:border-muted size-16 md:absolute md:top-[-60px] md:left-10 md:size-24 md:rounded-full md:border-[5px]"
            variant="pixel"
            colors={['#84b295', '#eccf8d', '#bb8138', '#ac2005', '#2c1507']}
          />
          <div className="flex flex-1 flex-col gap-2 md:mt-5 md:flex-row md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold md:text-4xl">
                c/{communityName}
              </h1>
              <p className="text-sm">{community.description}</p>
              <p className="flex gap-3 text-xs md:text-sm">
                {community.subscribersAmount} member
                {community.subscribersAmount === 1 ? '' : 's'}
              </p>
              {community.isUserModerator && (
                <Badge variant="destructive">Moderator</Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {community.isUserSubscribed && (
                <Button asChild>
                  <Link to={`/c/${communityName}/create`}>
                    <Plus />
                    Create post
                  </Link>
                </Button>
              )}
              <Button
                variant={`${community.isUserSubscribed ? 'destructive' : 'default'}`}
                onClick={() =>
                  communitySubscriptionMutation.mutate(communityName)
                }
                disabled={
                  communitySubscriptionMutation.isPending ||
                  community.isUserModerator
                }
              >
                {community.isUserSubscribed ? 'Leave' : 'Join'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-2 p-2">
        {communityPosts?.map((post) => (
          <Fragment key={post.id}>
            <PostFeedView location="community" key={post.id} post={post} />
            <Separator />
          </Fragment>
        ))}
        <div ref={ref} className="mb-3 flex items-center justify-center">
          {communityPostsQuery.isFetchingNextPage && (
            <p>Loading more posts...</p>
          )}
        </div>
      </div>
    </div>
  );
}
