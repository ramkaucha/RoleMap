"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { NavigationProps, PageItem } from "./interfaces";
import { loggedOutButtons } from "../config/pages";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSideBar } from "./app-sidebar";
import { FileUser } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navigation({ isAuthenticated, currentPath = "/" }: NavigationProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center"
    >
      <div className="py-2 hidden sm:block flex-col">
        <a href="#" className="text-2xl font-bold flex flex-row" onClick={() => router.push("/")}>
          <FileUser className="mt-1 mr-1" />
          AT
        </a>
      </div>
      <div className="flex md:space-x-2">
        {pages.map((item) => (
          <Button
            size="sm"
            variant={item.variant}
            key={item.name}
            onClick={() => handleClick(item)}
            aria-current={item.current ? "page" : undefined}
            className="my-4 leading-none font-semibold"
          >
            {item.name}
          </Button>
        ))}
        <div className="my-4 ml-2">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
