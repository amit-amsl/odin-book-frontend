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
  posts: Array<Post>;
  subscribers: Array<Subscriber>;
};

export type Post = {
  id: string;
  title: string;
  author: User;
  isNSFW: boolean;
  isSpoiler: boolean;
  upvotes: Array<Omit<User, 'username'>>;
  downvotes: Array<Omit<User, 'username'>>;
  createdAt: Date;
  _count: {
    upvotes: number;
    downvotes: number;
    comments: number;
  };
};

export type PostExtended = Post & {
  content: string;
  normalizedCommunityName: string;
  comments: Array<Comment>;
};

export type Comment = {
  id: string;
  author: User;
  parentCommentId: string | null;
  content: string;
  _count: {
    upvotes: number;
    downvotes: number;
  };
  upvotes: Array<Omit<User, 'username'>>;
  downvotes: Array<Omit<User, 'username'>>;
  createdAt: Date;
  replies: Array<Comment>;
};

export type Subscriber = {
  user: User;
  isModerator: boolean;
};
