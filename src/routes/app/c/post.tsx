import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  Bookmark,
  Undo2,
} from 'lucide-react';
import { usePost } from '@/features/post/api/get-post';
import { Link, useParams } from 'react-router';
import { usePostVote } from '@/features/post/api/vote-post';
import { calculateTotalVotes, cn, formatDate } from '@/lib/utils';
import { CommentSection } from '@/features/comment/components/comment-section';
import { CommentRTEditor } from '@/features/comment/components/comment-tiptap-editor';
import parse from 'html-react-parser';
import { usePostBookmark } from '@/features/post/api/bookmark-post';
import { Badge } from '@/components/ui/badge';

export function PostRoute() {
  const params = useParams();
  const communityName = params.communityName as string;
  const postId = params.postId as string;

  const postQuery = usePost(communityName, postId);

  const postVotingMutation = usePostVote();

  const postBookmarkMutation = usePostBookmark();

  const handlePostVote = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voteDir: 'up' | 'down'
  ) => {
    e.stopPropagation();
    postVotingMutation.mutate({
      communityName,
      postId,
      voteValue: voteDir === 'up' ? 1 : -1,
    });
  };

  if (postQuery.isLoading) return <div>loading...</div>;

  const post = postQuery.data;

  if (!post) return null;

  return (
    <div className="flex items-start gap-4 p-4">
      <Link
        to={`/c/${communityName}`}
        className="bg-secondary hover:bg-secondary/40 hidden rounded-xl p-1 md:block"
      >
        <Undo2 />
      </Link>
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <Avatar className="size-8">
              <AvatarImage src="https://b.thumbs.redditmedia.com/9aAIqRjSQwF2C7Xohx1u2Q8nAUqmUsHqdYtAlhQZsgE.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-1">
                <Link
                  to={`/c/${communityName}`}
                  className="text-xs font-bold transition-colors hover:text-cyan-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  c/{post.communityNormalizedName}
                </Link>
                <span className="text-muted-foreground text-xs">•</span>
                <time
                  className="text-muted-foreground text-xs"
                  dateTime={new Date(post.createdAt).toISOString()}
                >
                  {formatDate(post.createdAt)}
                </time>
              </div>
              <Link
                to={`/user/${post.author.username}`}
                className="text-xs transition-colors hover:text-cyan-600"
                onClick={(e) => e.stopPropagation()}
              >
                {post.author.username}
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="">
              <h1 className="mb-2 text-xl font-semibold tracking-tight text-pretty sm:text-2xl md:text-3xl">
                {post.title}
              </h1>
              <div className="flex gap-2">
                {post.isNSFW && <Badge variant="destructive">NSFW (18+)</Badge>}
                {post.isSpoiler && <Badge variant="default">SPOILER</Badge>}
              </div>
            </div>
            <div className="dark:prose-invert prose prose-headings:mt-2 prose-headings:mb-1 prose-headings:font-semibold prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:marker:text-foreground max-w-2xl text-sm">
              {post.content ? parse(post.content) : ''}
            </div>
          </div>
          <div className="mt-6 flex gap-2.5">
            <div className="bg-muted-foreground/20 flex items-center justify-center gap-1 rounded-2xl">
              <Button
                className="group cursor-pointer"
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
              <span className="text-sm font-semibold tabular-nums">
                {calculateTotalVotes(
                  post._count.upvotes,
                  post._count.downvotes
                )}
              </span>
              <Button
                className="group cursor-pointer"
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
              className="bg-muted-foreground/20 rounded-2xl"
              variant={'ghost'}
            >
              <MessageCircle />
              <span className="text-xs">{post._count.comments}</span>
            </Button>
            <Button
              className="bg-muted-foreground/20 cursor-pointer rounded-2xl"
              variant={'ghost'}
              onClick={() =>
                postBookmarkMutation.mutate({ communityName, postId })
              }
            >
              <Bookmark
                className={cn(post.isPostBookmarked && 'fill-primary')}
              />
              <span className="text-xs">
                {post.isPostBookmarked ? 'Unsave' : 'Save'}
              </span>
            </Button>
            <Button
              className="bg-muted-foreground/20 cursor-pointer rounded-2xl"
              variant={'ghost'}
            >
              <Share2 />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>
        <CommentRTEditor postId={postId} communityName={communityName} />
        <CommentSection communityName={communityName} postId={postId} />
      </div>
    </div>
  );
}
