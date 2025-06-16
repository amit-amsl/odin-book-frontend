import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useInfiniteAllCommunitiesFeed } from '@/features/community/api/get-communities-posts-all';
import { PostFeedView } from '@/features/post/components/post-feed-view';
import { Fragment } from 'react/jsx-runtime';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { SortByQueryParam } from '@/types/api';
import { SortBySelectionList } from '@/features/community/components/sort-by-select';

export default function AllFeedRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOptionSelected = (searchParams.get('sort') ??
    'new') as SortByQueryParam;

  const handleSortSelection = (value: SortByQueryParam) => {
    searchParams.set('sort', value);
    setSearchParams(searchParams);
  };

  const allCommunitiesFeedQuery =
    useInfiniteAllCommunitiesFeed(sortOptionSelected);

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

  const allCommunitiesFeed = allCommunitiesFeedQuery.data?.pages.flatMap(
    (page) => page.data
  );

  //if (!communitiesFeed?.length) return null;

  return (
    <ScrollArea>
      <SortBySelectionList
        sortOptionSelected={sortOptionSelected}
        handleSortSelection={handleSortSelection}
      />
      {!allCommunitiesFeed?.length ? (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 p-2 text-center">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            No posts available...
          </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 p-2">
            <Separator className="" />
            {allCommunitiesFeed.map((post) => (
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
        </>
      )}
    </ScrollArea>
  );
}
