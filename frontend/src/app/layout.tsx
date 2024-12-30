import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={`mx-auto px-5`}
            // ${session === null ? "sm:w-[50%]" : " "}`}
          >
            <Navigation isAuthenticated={session !== null} />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
