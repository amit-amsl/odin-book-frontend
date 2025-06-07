import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/types/api';
import { format } from 'date-fns';

type ProfileDetailsMobileViewProps = {
  isProfileOfCurrentUser: boolean;
  userProfile: UserProfile;
};

export function ProfileDetailsMobileView({
  isProfileOfCurrentUser,
  userProfile,
}: ProfileDetailsMobileViewProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="my-4 w-full max-w-sm lg:hidden"
    >
      <AccordionItem
        value="item-1"
        className="bg-muted px-4 first:rounded-t-md last:rounded-b-md last:border-none"
      >
        <AccordionTrigger>Profile Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          {isProfileOfCurrentUser && (
            <div className="flex flex-col">
              <p className="text-muted-foreground font-semibold">
                {userProfile.email}
              </p>
              <p className="text-muted-foreground text-xs">account's email</p>
            </div>
          )}
          <div>
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
