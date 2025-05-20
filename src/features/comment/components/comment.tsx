import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  CornerDownRight,
} from 'lucide-react';
import { calculateTotalVotes, cn, formatDate } from '@/lib/utils';
import { Comment } from '@/types/api';
import { useCommentVote } from '../api/vote-comment';
import { Link } from 'react-router';
import { useState } from 'react';
import { ReplyRTEditor } from './reply-tiptap-editor';
import { useInfiniteCommentReplies } from '../api/get-comment-replies';
import parse from 'html-react-parser';

type CommentProps = {
  communityName: string;
  postId: string;
  comment: Comment;
  children?: React.ReactNode;
};

export function PostComment({ communityName, postId, comment }: CommentProps) {
  const [isReplyEditorVisible, setReplyEditorVisibility] = useState(false);
  const [isRepliesVisible, setRepliesVisibility] = useState(false);

  const commentVotingMutation = useCommentVote();

  const shouldFetchReplies = comment._count.replies > 0 && isRepliesVisible;

  const commentRepliesQuery = useInfiniteCommentReplies(
    comment.id,
    shouldFetchReplies
  );

  const commentReplies = commentRepliesQuery.data?.pages.flatMap(
    (page) => page.data
  );

  const isUserUpvoted = !!comment.upvotes.length;
  const isUserDownvoted = !!comment.downvotes.length;
  const isReplyComment = !!comment.parentCommentId;

  const handleReplyEditorVisibility = (value: boolean) => {
    if (!isReplyComment) {
      setReplyEditorVisibility(value);
    }
  };

  const toggleRepliesVisibility = () => {
    setRepliesVisibility((prev) => !prev);
  };

  const handleCommentVote = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voteDir: 'up' | 'down'
  ) => {
    e.stopPropagation();
    commentVotingMutation.mutate({
      postId,
      commentId: comment.id,
      voteValue: voteDir === 'up' ? 1 : -1,
    });
  };

  return (
    <Collapsible defaultOpen key={comment.id}>
      <CollapsibleTrigger className="flex items-center gap-1">
        <Avatar className="size-8">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Link
          to={`u/${comment.author.username}`}
          className="text-xs font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {comment.author.username}
        </Link>
        <span>•</span>
        <time className="text-muted-foreground text-xs">
          {formatDate(comment.createdAt)}
        </time>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-9 flex flex-col gap-2">
        <div className="dark:prose-invert prose prose-headings:mt-2 prose-headings:mb-1 prose-headings:font-semibold prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:marker:text-foreground text-sm">
          {parse(comment.content)}
        </div>
        <div className="flex gap-1">
          <div className="flex items-center gap-1">
            <Button
              className="group size-7"
              variant={'ghost'}
              size={'icon'}
              onClick={(e) => handleCommentVote(e, 'up')}
            >
              <ArrowBigUp
                strokeWidth={1.2}
                className={cn(
                  'text-muted-foreground size-6 transition-all group-hover:stroke-amber-400',
                  isUserUpvoted && 'fill-amber-400 stroke-amber-400'
                )}
              />
            </Button>
            <span className="text-muted-foreground text-xs font-semibold">
              {calculateTotalVotes(
                comment._count.upvotes,
                comment._count.downvotes
              )}
            </span>
            <Button
              className="group size-7"
              variant={'ghost'}
              size={'icon'}
              onClick={(e) => handleCommentVote(e, 'down')}
            >
              <ArrowBigDown
                strokeWidth={1.2}
                className={cn(
                  'text-muted-foreground size-6 transition-all group-hover:stroke-indigo-400',
                  isUserDownvoted && 'fill-indigo-400 stroke-indigo-400'
                )}
              />
            </Button>
          </div>
          {!isReplyComment && (
            <Button
              className="text-muted-foreground rounded-2xl"
              variant={'ghost'}
              onClick={() => handleReplyEditorVisibility(true)}
            >
              <MessageCircle />
              Reply
            </Button>
          )}
          {comment._count.replies > 0 && (
            <Button variant={'ghost'} onClick={toggleRepliesVisibility}>
              {isRepliesVisible ? <ChevronUp /> : <ChevronDown />}
              {isRepliesVisible
                ? 'Hide replies'
                : `${comment._count.replies} repl${comment._count.replies > 1 ? 'ies' : 'y'}`}
            </Button>
          )}
        </div>
        {!isReplyComment && isReplyEditorVisible && (
          <ReplyRTEditor
            communityName={communityName}
            postId={postId}
            commentId={comment.id}
            handleVisibility={handleReplyEditorVisibility}
          />
        )}
        {/* Reply section */}
        {isRepliesVisible && commentReplies && (
          <div>
            {commentReplies.map((reply) => (
              <PostComment
                key={reply.id}
                comment={reply}
                postId={postId}
                communityName={communityName}
              />
            ))}
            {commentRepliesQuery.hasNextPage && (
              <Button
                variant={'ghost'}
                onClick={() => commentRepliesQuery.fetchNextPage()}
              >
                {commentRepliesQuery.isFetchingNextPage ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <CornerDownRight />
                    Show more replies
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
