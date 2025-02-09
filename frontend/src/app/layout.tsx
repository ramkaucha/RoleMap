import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import PageWrapper from "../components/PageWrapper";
import Providers from "./providers";
import Footer from "@/components/footer";
import { AppSideBar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Application Tracker",
  description: "Track your applications and get hired!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${poppins.variable} antialiased`}>
        <Providers>
          <div className="px-12 flex flex-col h-screen overflow-hidden">
            <div className="flex-none">
              <Navigation />
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarProvider>
                <div className="h-full flex">
                  <AppSideBar />
                  <div className="flex-1 overflow-auto">
                    <PageWrapper>{children}</PageWrapper>
                  </div>
                </div>
              </SidebarProvider>
            </div>
            <div className="flex-none">
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
