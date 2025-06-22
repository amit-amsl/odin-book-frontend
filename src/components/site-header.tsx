import { Bot, SidebarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useSidebar } from './ui/sidebar';
import { Link } from 'react-router';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-[var(--header-height)] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 !h-8" />
        <Link
          className="flex flex-1 items-center justify-center gap-2 select-none"
          to={'/'}
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Bot className="size-6" />
          </div>
          <h3 className="text-3xl font-semibold tracking-tight">Tidder</h3>
        </Link>
      </div>
    </header>
  );
}
