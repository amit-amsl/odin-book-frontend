import { NavLink, useLocation } from 'react-router';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Home, ChartNoAxesColumnIncreasing } from 'lucide-react';

const items = [
  {
    title: 'Home',
    url: '/feed',
    icon: Home,
  },
  {
    title: 'All',
    url: '/c/all',
    icon: ChartNoAxesColumnIncreasing,
  },
];

export function NavMain() {
  const location = useLocation();

  return (
    <SidebarMenu className="p-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={location.pathname === item.url}>
            <NavLink to={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
