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
      <body className={`${geistMono.variable} ${poppins.variable} antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen overflow-hidden px-12">
            <div>
              <Navigation />
            </div>
            <div className="flex-1 flex justify-center items-center w-full">
              <AuthenticatedLayout>
                <PageWrapper>{children}</PageWrapper>
              </AuthenticatedLayout>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
