import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/features/community/api/get-community';
import { useCommunitySubscribe } from '@/features/community/api/subscribe-community';
import { useUser } from '@/lib/auth';
import { Plus } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { PostFeedView } from '@/features/post/components/post-feed-view';

export function CommunityRoute() {
  const params = useParams();
  const communityName = params.communityName as string;
  const { user } = useUser();

  const communityQuery = useCommunity(communityName);

  const communitySubscriptionMutation = useCommunitySubscribe();

  if (communityQuery.isLoading) return <div>loading...</div>;

  const community = communityQuery.data;

  const isLoggedUserSubscribed = community?.subscribers.some((sub) => {
    return sub.user.id === user?.userId;
  });

  if (!community) return null;

  return (
    <div>
      <header className="bg-muted flex flex-col shadow-sm">
        <div className="h-48 w-full p-3">
          <img
            className="h-full w-full rounded-sm object-cover"
            src="https://styles.redditmedia.com/t5_2s7cz/styles/bannerBackgroundImage_27yjhkspg7se1.jpg"
            alt=""
          />
        </div>
        <div className="relative flex gap-4 p-4">
          <Avatar className="md:border-muted size-16 md:absolute md:top-[-60px] md:left-10 md:size-24 md:border-[5px]">
            <AvatarImage src="https://b.thumbs.redditmedia.com/9aAIqRjSQwF2C7Xohx1u2Q8nAUqmUsHqdYtAlhQZsgE.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-2 md:mt-5 md:flex-row md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold md:text-4xl">
                c/{communityName}
              </h1>
              <p>{community.description}</p>
              <div className="flex gap-3 text-xs md:text-sm">
                <p>{community.subscribers.length} members</p>
                <p className="space-x-1">
                  <span className="inline-flex size-2 rounded-full bg-green-400"></span>
                  <span>N/A online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild>
                <Link to={`/c/${communityName}/create`}>
                  <Plus />
                  Create post
                </Link>
              </Button>
              <Button
                variant={`${isLoggedUserSubscribed ? 'destructive' : 'default'}`}
                onClick={() =>
                  communitySubscriptionMutation.mutate(communityName)
                }
                disabled={communitySubscriptionMutation.isPending}
              >
                {isLoggedUserSubscribed ? 'Leave' : 'Join'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div>
        {community.posts.map((post) => (
          <PostFeedView
            location="community"
            key={post.id}
            post={post}
            communityName={communityName}
          />
        ))}
      </div>
    </div>
  );
}
