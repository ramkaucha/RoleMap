"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ListPlus, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Track",
    url: "/track",
    icon: ListPlus,
  },
];

export function AppSideBar() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" className="font-poppins">
      <SidebarHeader className="flex justify-end p-2">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>RoleMap</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
                <TooltipProvider key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url} className="text-base">
                            <item.icon className="h-10 w-10" />
                            <span className="text-md">{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={5}
                      className="bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-sm font-medium shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data[side=bottom]:slide-in-from-top-2 "
                    >
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
