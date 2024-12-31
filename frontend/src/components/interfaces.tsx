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

export interface RegisterFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_picture?: string | null;
  profile_picture_type?: ProfilePictureType | null;
}

export enum ProfilePictureType {
  LOCAL = "local",
  URL = "url",
  S3 = "s3",
}

export interface RegisterFormProps {
  setError: (error: string) => void;
}
