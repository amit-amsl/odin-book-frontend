import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { Link } from 'react-router';

export default function FeedRoute() {
  return (
    <ScrollArea className="">
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 20 }).map((_, i, arr) => (
          <>
            <Link to={'/'}>
              <div className="hover:bg-accent/50 flex gap-3 rounded-lg p-3 text-left transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Button asChild variant={'ghost'} size={'icon'}>
                    <ArrowBigUp className="size-4 hover:stroke-amber-400" />
                  </Button>
                  <span>996</span>
                  <Button asChild variant={'ghost'} size={'icon'}>
                    <ArrowBigDown className="size-4 hover:stroke-indigo-400" />
                  </Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-1">
                    <Link
                      to={'/'}
                      className="text-muted-foreground transition-colors hover:text-cyan-600"
                    >
                      c/skrillex
                    </Link>
                    <span>•</span>
                    <span>11h ago</span>
                  </div>
                  <div className="text-sm font-semibold tracking-tight sm:text-base">
                    [FRESH ALBUM] Skrillex - FUCK U SKRILLEX YOU THINK UR ANDY
                    WARHOL BUT YOUR NOT!!
                  </div>
                  <div className="flex gap-3">
                    <Button variant={'link'}>11 comments</Button>
                    <Button variant={'link'}>share</Button>
                  </div>
                </div>
              </div>
            </Link>
            <Separator className="" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
