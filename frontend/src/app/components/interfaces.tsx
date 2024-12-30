type ButtonVariants = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export interface PageItem {
  name: string;
  route: string;
  current: boolean;
  variant: ButtonVariants;
}

export interface NavigationProps {
  isAuthenticated: boolean;
  currentPath?: string;
}
