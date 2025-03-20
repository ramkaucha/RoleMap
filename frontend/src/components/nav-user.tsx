import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import { useAuth } from '@/app/context/AuthContext';
import { ChevronUp, LogOut, Settings, User2 } from 'lucide-react';

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

export function NavUser({ user }: { user: UserType }) {
  const { logout } = useAuth();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2 /> {user.name}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-popper-anchor-width] min-w-[160px] bg-white dark:bg-slate-800 rounded-md shadow-lg p-1.5 border border-gray-200 dark:border-slate-700"
          >
            <DropdownMenuItem className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-slate-700" />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
