import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/features/user/api/get-user-profile';
import { useUser } from '@/lib/auth';
import { LockKeyhole, Bookmark, SquareChartGantt } from 'lucide-react';
import { useParams } from 'react-router';
import { SubmittedPosts } from '@/features/user/components/submitted-posts';
import { Bookmarks } from '@/features/user/components/bookmarks';
import { ProfileDetailsMobileView } from '@/features/user/components/profile-details-mobile';
import { ProfileDetailsDesktopCard } from '@/features/user/components/profile-details-desktop';
import { ProfileEditDialog } from '@/features/user/components/profile-edit-dialog';

export default function UserProfileRoute() {
  const params = useParams();
  const userName = params.username as string;
  const { user } = useUser();

  const isProfileOfCurrentUser = user?.username === userName;

  const userProfileQuery = useUserProfile(userName);

  if (userProfileQuery.isLoading) return <div>loading...</div>;

  const userProfile = userProfileQuery.data;

  if (!userProfile) return null;

  return (
    <div className="flex justify-between gap-3 p-3">
      <div className="flex grow flex-col gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-28">
              <AvatarImage src={userProfile.avatarUrl} />
              <AvatarFallback className="text-5xl">TD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {userName}
              </h1>
              <span className="text-muted-foreground text-sm">
                u/{userName}
              </span>
              {isProfileOfCurrentUser && (
                <ProfileEditDialog
                  username={user?.username}
                  avatarUrl={userProfile.avatarUrl}
                />
              )}
            </div>
          </div>
          <ProfileDetailsMobileView
            userProfile={userProfile}
            isProfileOfCurrentUser={isProfileOfCurrentUser}
          />
        </div>
        <Tabs defaultValue="submittedPosts" className="my-4">
          <TabsList className="bg-background flex items-center justify-start rounded-none border-b p-0">
            <TabsTrigger
              value="submittedPosts"
              className="bg-background data-[state=active]:border-b-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none"
            >
              <SquareChartGantt />
              Submitted Posts
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="bg-background data-[state=active]:border-b-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none"
              disabled={!isProfileOfCurrentUser}
            >
              {!isProfileOfCurrentUser ? <LockKeyhole /> : <Bookmark />}
              Bookmarks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="submittedPosts">
            <SubmittedPosts username={userName} />
          </TabsContent>
          <TabsContent value="bookmarks">
            <Bookmarks username={userName} />
          </TabsContent>
        </Tabs>
      </div>
      <ProfileDetailsDesktopCard
        userProfile={userProfile}
        isProfileOfCurrentUser={isProfileOfCurrentUser}
      />
    </div>
  );
}
