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

export function NavSecondary (
  {
    items,
    className
  }: NavProps)
{
  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => (
          <TooltipProvider key={item.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-base">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={5}
                className="bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-sm font-medium shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data[side=bottom]:slide-in-from-top-2"
              >
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
