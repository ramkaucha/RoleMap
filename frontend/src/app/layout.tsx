import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";
import { getServerSession } from "next-auth";
import PageWrapper from "./components/PageWrapper";
import Providers from "./providers";

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
        <Providers>
          <div className="px-12 flex flex-col min-h-screen">
            <div className="container mx-auto flex-1 flex flex-col">
              <Navigation isAuthenticated={session !== null} />
              <PageWrapper>{children}</PageWrapper>
            </div>
            <h1>Footer.</h1>
          </div>
        </Providers>
      </body>
    </html>
  );
}
