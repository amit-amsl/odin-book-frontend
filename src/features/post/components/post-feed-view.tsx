import { Button } from '@/components/ui/button';
import { usePostVote } from '@/features/post/api/vote-post';
import { calculateTotalVotes, cn, formatDate } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Post } from '@/types/api';

type PostFeedViewProps = {
  communityName: string;
  post: Post;
  location: 'community' | 'feed';
};

export function PostFeedView({
  communityName,
  post,
  location,
}: PostFeedViewProps) {
  const navigate = useNavigate();
  const postVotingMutation = usePostVote();

  const isUserUpvoted = !!post.upvotes.length;
  const isUserDownvoted = !!post.downvotes.length;

  const handlePostVote = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voteDir: 'up' | 'down'
  ) => {
    e.stopPropagation();
    postVotingMutation.mutate({
      communityName,
      postId: post.id,
      voteValue: voteDir === 'up' ? 1 : -1,
    });
  };

  return (
    <div
      key={post.id}
      onClick={() => navigate(`/c/${communityName}/${post.id}`)}
    >
      <div className="hover:bg-accent/50 flex gap-2 rounded-lg p-3 text-left transition-colors">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-1">
            <Link
              to={
                location === 'feed'
                  ? `/c/${communityName}`
                  : `u/${post.author.username}`
              }
              className="text-muted-foreground text-xs transition-colors hover:text-cyan-600"
              onClick={(e) => e.stopPropagation()}
            >
              {location === 'feed' && `c/${communityName}`}
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
          <div className="font-semibold tracking-tight sm:text-base">
            {post.title}
          </div>
          <div className="flex gap-1">
            <div className="bg-muted-foreground/20 flex items-center justify-center gap-1 rounded-2xl">
              <Button
                className="group"
                variant={'ghost'}
                size={'icon'}
                onClick={(e) => handlePostVote(e, 'up')}
              >
                <ArrowBigUp
                  className={cn(
                    'size-6 transition-all group-hover:stroke-amber-400',
                    isUserUpvoted && 'fill-amber-400 stroke-amber-400'
                  )}
                />
              </Button>
              <span className="text-sm font-semibold tabular-nums">
                {calculateTotalVotes(
                  post._count.upvotes,
                  post._count.downvotes
                )}
              </span>
              <Button
                className="group"
                variant={'ghost'}
                size={'icon'}
                onClick={(e) => handlePostVote(e, 'down')}
              >
                <ArrowBigDown
                  className={cn(
                    'size-6 transition-all group-hover:stroke-indigo-400',
                    isUserDownvoted && 'fill-indigo-400 stroke-indigo-400'
                  )}
                />
              </Button>
            </div>
            <Button
              className="text-muted-foreground hover:bg-muted-foreground/20 text-xs"
              variant={'ghost'}
            >
              {post._count.comments} comments
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
