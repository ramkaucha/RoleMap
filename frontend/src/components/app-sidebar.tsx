"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ListPlus, LayoutDashboard, ClipboardListIcon, DatabaseIcon, SettingsIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: 'Ram Kaucha',
    email: 'me@ramkaucha.com',
    avatar: '/globe.svg'
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Track",
      url: "/track",
      icon: ListPlus
    }
  ],
  documents: [
    {
      title: "Documents",
      url: "#",
      icon: DatabaseIcon
    },
    {
      title: "Resume",
      url: "#",
      icon: ClipboardListIcon
    },
  ],
  navSecondary: [
    {
      "title": "Settings",
      "url": "/settings",
      icon: SettingsIcon
    }
  ]
}

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
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="mb-4 flex justify-center items-center">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}