import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavProps {
  items: NavItem[];
  className?: string;
}

interface UserType {
  name: string;
  email: string;
  avatar: string;
}


export function NavUser (
{
  user
}: {
  user: UserType
}) {
  return (
    <SidebarMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/profile" className="text-base">
                  <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                  <span>{user.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={5}
            className="bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-sm font-medium shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data[side=bottom]:slide-in-from-top-2"
          >
            <p>{user.email}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarMenu>
  );
};