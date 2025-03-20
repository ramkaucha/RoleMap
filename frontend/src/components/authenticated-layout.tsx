'use client';

import { useSession } from 'next-auth/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSideBar } from '@/components/app-sidebar';
import { useAuth } from "@/app/context/AuthContext";

export default function AuthenticatedLayout({
  children
}: {
    children: React.ReactNode;
}) {
  // const { status } = useSession();
  // const isLoggedIn = status === 'authenticated';
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center overflow-auto px-12">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-full w-full">
        <AppSideBar />
        <div className="flex-1 overflow-auto p-6 w-full">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
