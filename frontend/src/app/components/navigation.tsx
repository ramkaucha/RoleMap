"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { NavigationProps, PageItem } from "./interfaces";
import { loggedOutButtons } from "../config/pages";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSideBar } from "./app-sidebar";

const MotionButton = motion(Button);

export default function Navigation({ isAuthenticated, currentPath = "/" }: NavigationProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [pages, setPages] = useState(() =>
    loggedOutButtons.map((page) => ({
      ...page,
      current: page.route === currentPath,
    }))
  );

  const handleClick = (item: PageItem) => {
    setPages(
      pages.map((page) => ({
        ...page,
        current: page.name === item.name,
      }))
    );

    router.push(item.route);
  };

  return (
    <nav className="flex justify-between items-center">
      <SidebarProvider>
        <AppSideBar />
        <SidebarTrigger />
      </SidebarProvider>
      {/* <div className="py-2 hidden sm:block">
        <a href="#" className="text-2xl font-bold" onClick={() => router.push("/")}>
          AT
        </a>
      </div> */}
      <div className="py-2 hidden sm:block"></div>
      <div className="flex md:space-x-2">
        {pages.map((item) => (
          <MotionButton
            variant={item.variant}
            key={item.name}
            onClick={() => handleClick(item)}
            aria-current={item.current ? "page" : undefined}
            className="text-md px-4 my-4 leading-none font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.name}
          </MotionButton>
        ))}
      </div>
    </nav>
  );
}
