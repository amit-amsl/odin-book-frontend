import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInfiniteSubscribedCommunitiesFeed } from '@/features/community/api/get-communities-posts-subscribed';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Fragment } from 'react/jsx-runtime';
import { Telescope } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router';
import { SortByQueryParam } from '@/types/api';
import { SortBySelectionList } from '@/features/community/components/sort-by-select';
import { useUserCommunities } from '@/features/user/api/get-user-communities';

export default function SubscribedFeedRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOptionSelected = (searchParams.get('sort') ??
    'new') as SortByQueryParam;

  const handleSortSelection = (value: SortByQueryParam) => {
    searchParams.set('sort', value);
    setSearchParams(searchParams);
  };

  const subscribedCommunitiesFeedQuery =
    useInfiniteSubscribedCommunitiesFeed(sortOptionSelected);

  const userCommunitiesQuery = useUserCommunities();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && subscribedCommunitiesFeedQuery.hasNextPage)
      subscribedCommunitiesFeedQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inView,
    subscribedCommunitiesFeedQuery.hasNextPage,
    subscribedCommunitiesFeedQuery.fetchNextPage,
  ]);

  if (subscribedCommunitiesFeedQuery.isLoading)
    return (
      <div className="mt-5 flex justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const subCommunitiesFeed = subscribedCommunitiesFeedQuery.data?.pages.flatMap(
    (page) => page.data
  );

  const userCommunities = userCommunitiesQuery.data;

  if (!subCommunitiesFeed?.length && !userCommunities)
    return (
      <div className="mt-10 flex flex-col items-center justify-center gap-3 p-2 text-center">
        <Telescope size={56} />
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          You haven't subscribed to any community...
        </h1>
        <p className="leading-7">
          Head over now to{' '}
          <Button variant={'link'} className="px-0 text-cyan-600" asChild>
            <Link to={'/c/all'}>c/all</Link>
          </Button>{' '}
          to explore interesting communities to become part of.
        </p>
      </div>
    );

  return (
    <ScrollArea>
      <SortBySelectionList
        sortOptionSelected={sortOptionSelected}
        handleSortSelection={handleSortSelection}
      />
      {!subCommunitiesFeed?.length ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 p-2 text-center">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            No posts available...
          </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 p-2">
            <Separator className="" />
            {subCommunitiesFeed?.map((post) => (
              <Fragment key={post.id}>
                <PostFeedView key={post.id} post={post} location="feed" />
                <Separator className="" />
              </Fragment>
            ))}
          </div>
          {/* Intersection Observer trigger */}
          <div ref={ref} className="mb-3 flex items-center justify-center">
            {subscribedCommunitiesFeedQuery.isFetchingNextPage && (
              <p>Loading more posts...</p>
            )}
          </div>
        </>
      )}
    </ScrollArea>
  );
}
