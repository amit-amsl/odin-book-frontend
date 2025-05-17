import { Boxes, ChevronRight, Plus } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Link } from 'react-router';
import { useUserCommunities } from '@/features/user/api/get-user-communities';

export function AppSidebar() {
  const userCommunitiesQuery = useUserCommunities();

  const userCommunities = userCommunitiesQuery.data;

  return (
    <Sidebar className="top-[var(--header-height)] h-[calc(100svh-var(var(--header-height)))]">
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain />
        {/* Communities */}
        <Collapsible
          title="Communities"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                Communities{' '}
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={`/communities/create`}>
                        <Plus />
                        <span>Create a Community</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <div className="flex flex-col gap-1.5">
                    {userCommunities &&
                      userCommunities.map((community) => (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to={`/c/${community.normalizedName}`}>
                              <Boxes />
                              <span className="text-lg font-semibold">
                                {community.name}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </div>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Community</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
