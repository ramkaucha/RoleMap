import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import PageWrapper from "../components/PageWrapper";
import Providers from "./providers";
import Footer from "@/components/footer";
import AuthenticatedLayout from '../components/authenticated-layout';

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
  title: "RoleMap",
  description: "Track your applications and get hired!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${poppins.variable} antialiased h-screen overflow-hidden`}>
        <Providers>
          <div className="flex flex-col h-screen overflow-hidden">
            <div className="flex-none">
              <Navigation />
            </div>
            <div className="flex-1 overflow-hidden px-12">
              <AuthenticatedLayout>
                <PageWrapper className="h-full">{children}</PageWrapper>
              </AuthenticatedLayout>
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

