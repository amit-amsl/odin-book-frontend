import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2 } from 'lucide-react';

export function PostRoute() {
  return (
    <div className="flex max-w-3xl flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Avatar className="size-10">
            <AvatarImage src="https://b.thumbs.redditmedia.com/9aAIqRjSQwF2C7Xohx1u2Q8nAUqmUsHqdYtAlhQZsgE.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <h2 className="text-sm font-semibold">r/skrillex</h2>
              <time className="text-muted-foreground">3 hr ago</time>
            </div>
            <p className="text-xs">johndoejohnjon</p>
          </div>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">
          [FRESH ALBUM] Skrillex - FUCK U SKRILLEX YOU THINK UR ANDY WARHOL BUT
          YOUR NOT!!
        </h1>
        <p className="text-sm">
          FUS is an amazing gift to the fans and people need to stop whining.
          none of these tracks were ever going to see the light of day but he
          wanted to give them to you guys before Atlantic had them forever. The
          amount of people complaining about this album, saying "why aren't they
          full length" like ??? you could have received LITERALLY NOTHING from
          the man. he owes you NOTHING. people are so entitled to others art its
          sickening. grow TF up! he has tons of new music and probably another
          album release coming before the end of 2025. not to mention 2 other
          albums in the last 2 years. how many artists can say they released 3
          ALBUMS of work in the last 2.5 years? virtually zero. none of the
          tracks in FUS are getting finished, that was the whole point of
          releasing them this way. this i can all but guarantee. smh bunch of
          adult children in here lol im 200x more excited for some new music
          (nitepunk, joyride, isoxo) than hearing the second drop of a song i
          first heard in 2013...
        </p>
        <div className="flex gap-4">
          <div className="bg-muted-foreground/20 space-x-1 rounded-2xl">
            <Button asChild variant={'ghost'} size={'icon'}>
              <ArrowBigUp
                strokeWidth={1.2}
                className="hover:stroke-amber-400"
              />
            </Button>
            <span className="text-sm font-semibold">1.2k</span>
            <Button asChild variant={'ghost'} size={'icon'}>
              <ArrowBigDown
                strokeWidth={1.2}
                className="hover:stroke-indigo-400"
              />
            </Button>
          </div>
          <Button
            className="bg-muted-foreground/20 rounded-2xl"
            variant={'ghost'}
          >
            <MessageCircle className="size-5" />
            <span>2</span>
          </Button>
          <Button
            className="bg-muted-foreground/20 rounded-2xl"
            variant={'ghost'}
          >
            <Share2 className="size-5" />
            Share
          </Button>
        </div>
      </div>
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-1">
          <Avatar className="size-8">
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold">Frequent_Calendar810</span>
          <span>•</span>
          <time className="text-muted-foreground text-xs">11h ago</time>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-9 flex flex-col gap-3">
          <p className="text-sm">
            Yes. Free to use for personal and commercial projects. No
            attribution required.
          </p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Button
                asChild
                className="size-7"
                variant={'ghost'}
                size={'icon'}
              >
                <ArrowBigUp
                  strokeWidth={1.2}
                  className="hover:stroke-amber-400"
                />
              </Button>
              <span className="text-sm font-semibold">1.2k</span>
              <Button
                asChild
                className="size-7"
                variant={'ghost'}
                size={'icon'}
              >
                <ArrowBigDown
                  strokeWidth={1.2}
                  className="hover:stroke-indigo-400"
                />
              </Button>
            </div>
            <Button variant={'ghost'}>
              <MessageCircle />
              Reply
            </Button>
          </div>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1">
              <Avatar className="size-8">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold">
                Frequent_Calendar810
              </span>
              <span>•</span>
              <time className="text-muted-foreground text-xs">11h ago</time>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-9 flex flex-col gap-3">
              <p className="text-sm">
                Yes. Free to use for personal and commercial projects. No
                attribution required.
              </p>
              <div className="flex items-center gap-1">
                <Button
                  asChild
                  className="size-7"
                  variant={'ghost'}
                  size={'icon'}
                >
                  <ArrowBigUp
                    strokeWidth={1.2}
                    className="hover:stroke-amber-400"
                  />
                </Button>
                <span className="text-sm font-semibold">1.2k</span>
                <Button
                  asChild
                  className="size-7"
                  variant={'ghost'}
                  size={'icon'}
                >
                  <ArrowBigDown
                    strokeWidth={1.2}
                    className="hover:stroke-indigo-400"
                  />
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-1">
          <Avatar className="size-8">
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold">Frequent_Calendar810</span>
          <span>•</span>
          <time className="text-muted-foreground text-xs">11h ago</time>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-9 flex flex-col gap-3">
          <p className="text-sm">
            Yes. Free to use for personal and commercial projects. No
            attribution required.
          </p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Button
                asChild
                className="size-7"
                variant={'ghost'}
                size={'icon'}
              >
                <ArrowBigUp
                  strokeWidth={1.2}
                  className="hover:stroke-amber-400"
                />
              </Button>
              <span className="text-sm font-semibold">1.2k</span>
              <Button
                asChild
                className="size-7"
                variant={'ghost'}
                size={'icon'}
              >
                <ArrowBigDown
                  strokeWidth={1.2}
                  className="hover:stroke-indigo-400"
                />
              </Button>
            </div>
            <Button variant={'ghost'}>
              <MessageCircle />
              Reply
            </Button>
          </div>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-1">
              <Avatar className="size-8">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold">
                Frequent_Calendar810
              </span>
              <span>•</span>
              <time className="text-muted-foreground text-xs">11h ago</time>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-9 flex flex-col gap-3">
              <p className="text-sm">
                Yes. Free to use for personal and commercial projects. No
                attribution required.
              </p>
              <div className="flex items-center gap-1">
                <Button
                  asChild
                  className="size-7"
                  variant={'ghost'}
                  size={'icon'}
                >
                  <ArrowBigUp
                    strokeWidth={1.2}
                    className="hover:stroke-amber-400"
                  />
                </Button>
                <span className="text-sm font-semibold">1.2k</span>
                <Button
                  asChild
                  className="size-7"
                  variant={'ghost'}
                  size={'icon'}
                >
                  <ArrowBigDown
                    strokeWidth={1.2}
                    className="hover:stroke-indigo-400"
                  />
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
