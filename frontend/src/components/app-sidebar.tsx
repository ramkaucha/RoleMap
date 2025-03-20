'use client';

import { useAuth } from '@/app/context/AuthContext';
import {
  ListPlus,
  LayoutDashboard,
  ClipboardListIcon,
  DatabaseIcon,
  SettingsIcon,
  Plus,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavDocuments } from './nav-documents';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

const data = {
  user: {
    name: 'Ram Kaucha',
    email: 'me@ramkaucha.com',
    avatar: '/globe.svg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Track',
      url: '/track',
      icon: ListPlus,
    },
  ],
  documents: [
    {
      title: 'Documents',
      url: '#',
      icon: DatabaseIcon,
    },
    {
      title: 'Resume',
      url: '#',
      icon: ClipboardListIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: SettingsIcon,
    },
  ],
};

export function AppSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">
                  <span className="sidebar-expanded-only">RoleMap.</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="w-full gap-2" variant="default">
                  <Plus className="h-4 w-4" />
                  <span className="sidebar-expanded-only">Application</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-sm font-medium shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data[side=bottom]:slide-in-from-top-2"
              >
                <p>New Application</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
