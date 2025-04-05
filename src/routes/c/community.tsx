import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router';

export function CommunityRoute() {
  const params = useParams();
  const communityName = params.communityName as string;

  return (
    <div>
      <header className="bg-muted flex flex-col shadow-sm">
        <div className="h-48 w-full p-3">
          <img
            className="h-full w-full rounded-sm object-cover"
            src="https://styles.redditmedia.com/t5_2s7cz/styles/bannerBackgroundImage_27yjhkspg7se1.jpg"
            alt=""
          />
        </div>
        <div className="relative flex gap-4 p-4">
          <Avatar className="md:border-muted size-16 md:absolute md:top-[-60px] md:left-10 md:size-24 md:border-[5px]">
            <AvatarImage src="https://b.thumbs.redditmedia.com/9aAIqRjSQwF2C7Xohx1u2Q8nAUqmUsHqdYtAlhQZsgE.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-2 md:mt-5 md:flex-row md:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold md:text-4xl">
                c/{communityName}
              </h1>
              <div className="flex gap-3 text-xs md:text-sm">
                <p>57k members</p>
                <p>
                  <span className="inline-flex size-2 rounded-full bg-green-400"></span>
                  <span> 233 online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button>
                <Plus />
                Create post
              </Button>
              <Button>Join</Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
