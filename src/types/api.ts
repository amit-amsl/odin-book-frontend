export type BaseResponse = { message: string };

export type JwtPayload = {
  userId: string;
  username: string;
};

export type AuthResponse = BaseResponse & {
  user: JwtPayload;
};

export type User = {
  id: string;
  username: string;
};

export type Community = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  subscribersAmount: number;
  isUserSubscribed: boolean;
  isUserModerator: boolean;
};

export type Post = {
  id: string;
  title: string;
  author: User;
  image_url: string | null;
  youtube_vid_id: string | null;
  isNSFW: boolean;
  isSpoiler: boolean;
  isPostBookmarked: boolean;
  isPostUpvoted: boolean;
  isPostDownvoted: boolean;
  communityNormalizedName: string;
  createdAt: Date;
  _count: {
    upvotes: number;
    downvotes: number;
    comments: number;
  };
};

export type PostExtended = Post & {
  content: string;
};

export type UserProfilePost = Omit<
  Post,
  'isPostUpvoted' | 'isPostDownvoted' | 'isPostBookmarked'
>;

export type UserProfile = {
  id: string;
  email?: string;
  totalCommentCredit: number;
  totalPostCredit: number;
  avatarUrl: string;
  createdAt: Date;
};

export type Comment = {
  id: string;
  author: User & { profile_img_url: string };
  parentCommentId: string | null;
  content: string;
  _count: {
    upvotes: number;
    downvotes: number;
    replies: number;
  };
  upvotes: Array<Omit<User, 'username'>>;
  downvotes: Array<Omit<User, 'username'>>;
  createdAt: Date;
};

export type SidebarUserCommunity = {
  name: string;
  normalizedName: string;
};

export type PaginatedPage<T> = {
  data: Array<T>;
  meta: {
    nextCursor: string | null;
  };
};

export type InfiniteData<T> = {
  pages: Array<PaginatedPage<T>>;
  pageParams: Array<string>;
};

export type SortByQueryParam = 'new' | 'trending_day' | 'trending_week' | 'top';
