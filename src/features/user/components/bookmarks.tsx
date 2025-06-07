import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { BookmarkX } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
import { useInfiniteUserBookmarks } from '../api/get-user-bookmarks';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type BookmarksProps = {
  username: string;
};

export function Bookmarks({ username }: BookmarksProps) {
  const navigate = useNavigate();
  const bookmarksQuery = useInfiniteUserBookmarks(username);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && bookmarksQuery.hasNextPage) bookmarksQuery.fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, bookmarksQuery.hasNextPage, bookmarksQuery.fetchNextPage]);

  if (bookmarksQuery.isLoading)
    return (
      <div className="mt-5 flex grow justify-center">
        <SpinnerLoadingCircle />
      </div>
    );

  const bookmarks = bookmarksQuery.data?.pages.flatMap((page) => page.data);

  if (!bookmarks?.length)
    return (
      <div className="mt-3 flex flex-col items-center justify-center gap-2">
        <BookmarkX size={48} />
        <p className="text-lg font-bold">
          Looks like you haven't bookmarked anything yet...
        </p>
      </div>
    );

  return (
    <main className="">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="cursor-pointer"
          onClick={() =>
            navigate(`/c/${bookmark.communityNormalizedName}/${bookmark.id}`)
          }
        >
          <div className="hover:bg-accent/50 flex gap-2 rounded-lg p-3 text-left transition-colors">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-1">
                <Link
                  to={`/c/${bookmark.communityNormalizedName}`}
                  className="text-muted-foreground text-xs transition-colors hover:text-cyan-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {`c/${bookmark.communityNormalizedName}`}
                </Link>
                <span className="text-xs">•</span>
                <time
                  className="text-xs"
                  dateTime={new Date(bookmark.createdAt).toISOString()}
                >
                  {formatDate(bookmark.createdAt)}
                </time>
              </div>
              <div className="font-semibold tracking-tight sm:text-base">
                {bookmark.title}
              </div>
              <div className="flex gap-1">
                <Button
                  className="text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer text-xs"
                  variant={'ghost'}
                >
                  {bookmark._count.comments} comments
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
        {bookmarksQuery.isFetchingNextPage && <p>Loading more bookmarks...</p>}
      </div>
    </main>
  );
}
