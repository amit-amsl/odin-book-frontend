import { Button } from '@/components/ui/button';

export default function FeedRoute() {
  return (
    <div className="bg-background min-h-dvh w-full">
      <nav className="flex max-w-3xs flex-col items-end justify-center gap-2">
        <Button variant={'link'}>Home</Button>
        <Button variant={'link'}>Feed</Button>
        <Button variant={'link'}>Profile</Button>
      </nav>
    </div>
  );
}
