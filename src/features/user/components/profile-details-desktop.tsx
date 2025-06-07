import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Share2 } from 'lucide-react';
import { UserProfile } from '@/types/api';

type ProfileDetailsDesktopCardProps = {
  isProfileOfCurrentUser: boolean;
  userProfile: UserProfile;
};

export function ProfileDetailsDesktopCard({
  isProfileOfCurrentUser,
  userProfile,
}: ProfileDetailsDesktopCardProps) {
  return (
    <aside className="hidden max-w-xs grow lg:block">
      <Card className="bg-accent pt-0 shadow-none">
        <div className="flex">
          <svg
            className="rounded-t-xl"
            xmlns="http://www.w3.org/2000/svg"
            width="350"
            height="100"
          >
            <defs>
              <linearGradient
                id="gradient"
                x1="0.854"
                y1="0.146"
                x2="0.146"
                y2="0.854"
              >
                <stop offset="0.000" stopColor="rgb(34, 73, 71)" />
                <stop offset="0.167" stopColor="rgb(43, 72, 70)" />
                <stop offset="0.333" stopColor="rgb(54, 71, 68)" />
                <stop offset="0.500" stopColor="rgb(66, 72, 64)" />
                <stop offset="0.667" stopColor="rgb(80, 74, 60)" />
                <stop offset="0.833" stopColor="rgb(92, 77, 58)" />
                <stop offset="1.000" stopColor="rgb(104, 81, 57)" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="350" height="100" fill="url(#gradient)" />
          </svg>
        </div>
        <CardHeader>
          <CardTitle className="text-lg">Profile Details</CardTitle>
          {isProfileOfCurrentUser && (
            <CardDescription>
              <div className="flex flex-col">
                <p className="text-muted-foreground font-semibold">
                  {userProfile.email}
                </p>
                <p className="text-muted-foreground text-xs">account's email</p>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-6">
            <div className="flex flex-col">
              <p className="text-foreground font-semibold">
                {userProfile.totalPostCredit}
              </p>
              <p className="text-muted-foreground text-xs">Post credit</p>
            </div>
            <div className="flex flex-col">
              <p className="text-foreground font-semibold">
                {userProfile.totalCommentCredit}
              </p>
              <p className="text-muted-foreground text-xs">Comment credit</p>
            </div>
            <div className="flex flex-col">
              <p className="text-foreground font-semibold">
                {format(userProfile.createdAt, 'PPP')}
              </p>
              <p className="text-muted-foreground text-xs">Cake day</p>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground text-xs font-semibold">
              Trophy Case
            </h3>
            <p className="text-xs">Not implemented yet!</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant={'outline'} size={'sm'}>
            <Share2 />
            Share
          </Button>
        </CardFooter>
      </Card>
    </aside>
  );
}
