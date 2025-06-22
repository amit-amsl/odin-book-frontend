import { Button } from '@/components/ui/button';
import { usePostVote } from '@/features/post/api/vote-post';
import { calculateTotalVotes, cn, formatDate } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Post } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { PostThumbnail } from './post-thumbnail';
import { usePostBookmark } from '../api/bookmark-post';

type PostFeedViewProps = {
  post: Post;
  location: 'community' | 'feed';
};

export function PostFeedView({ post, location }: PostFeedViewProps) {
  const navigate = useNavigate();
  const postVotingMutation = usePostVote();
  const postBookmarkMutation = usePostBookmark();

  const handlePostVote = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voteDir: 'up' | 'down'
  ) => {
    e.stopPropagation();
    postVotingMutation.mutate({
      communityName: post.communityNormalizedName,
      postId: post.id,
      voteValue: voteDir === 'up' ? 1 : -1,
    });
  };

  return (
    <div
      className="md:hover:bg-accent/50 cursor-pointer gap-3 md:flex md:rounded-lg md:p-3 md:transition-colors"
      key={post.id}
      onClick={() => navigate(`/c/${post.communityNormalizedName}/${post.id}`)}
    >
      <PostThumbnail isPostNSFW={post.isNSFW} isPostSpoiler={post.isSpoiler} />
      <div className="sm:max-md:hover:bg-accent/50 flex grow gap-2 rounded-lg p-3 text-left transition-colors md:rounded-none md:p-0 md:transition-none">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-1">
            <Link
              to={
                location === 'feed'
                  ? `/c/${post.communityNormalizedName}`
                  : `/user/${post.author.username}`
              }
              className="text-muted-foreground text-xs transition-colors hover:text-cyan-600"
              onClick={(e) => e.stopPropagation()}
            >
              {location === 'feed' && `c/${post.communityNormalizedName}`}
              {location === 'community' && `u/${post.author.username}`}
            </Link>
            <span className="text-xs">•</span>
            <time
              className="text-xs"
              dateTime={new Date(post.createdAt).toISOString()}
            >
              {formatDate(post.createdAt)}
            </time>
          </div>
          <div
            className={`font-semibold tracking-tight sm:text-base ${(post.isNSFW || post.isSpoiler) && 'blur-xs'}`}
          >
            {post.title}
          </div>
          <div className="flex gap-2">
            {post.isNSFW && (
              <Badge className="py-0" variant="destructive">
                NSFW (18+)
              </Badge>
            )}
            {post.isSpoiler && (
              <Badge className="py-0" variant="default">
                SPOILER
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <div
              className="bg-muted-foreground/20 flex cursor-default items-center justify-center gap-1 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="group cursor-pointer rounded-2xl"
                variant={'ghost'}
                size={'icon'}
                onClick={(e) => handlePostVote(e, 'up')}
              >
                <ArrowBigUp
                  className={cn(
                    'size-6 transition-all group-hover:stroke-amber-400',
                    post.isPostUpvoted && 'fill-amber-400 stroke-amber-400'
                  )}
                />
              </Button>
              <p className="text-sm font-semibold tabular-nums">
                {calculateTotalVotes(
                  post._count.upvotes,
                  post._count.downvotes
                )}
              </p>
              <Button
                className="group cursor-pointer rounded-2xl"
                variant={'ghost'}
                size={'icon'}
                onClick={(e) => handlePostVote(e, 'down')}
              >
                <ArrowBigDown
                  className={cn(
                    'size-6 transition-all group-hover:stroke-indigo-400',
                    post.isPostDownvoted && 'fill-indigo-400 stroke-indigo-400'
                  )}
                />
              </Button>
            </div>
            <Button
              className="text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer text-xs"
              variant={'ghost'}
            >
              {post._count.comments} comment
              {post._count.comments === 1 ? '' : 's'}
            </Button>
            <Button
              className="text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer text-xs"
              variant={'ghost'}
              onClick={(e) => {
                e.stopPropagation();
                postBookmarkMutation.mutate({
                  communityName: post.communityNormalizedName,
                  postId: post.id,
                });
              }}
            >
              {post.isPostBookmarked ? 'Unsave' : 'Save'}
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
  );
}
