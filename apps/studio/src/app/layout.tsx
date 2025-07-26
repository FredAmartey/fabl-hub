import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StudioLayoutEnhanced from "@/components/StudioLayoutEnhanced";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Fabl Studio - Creator Dashboard",
  description: "Manage your content, analytics, and channel settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-inter antialiased bg-[#FAFAF8] text-black min-h-screen`}
        suppressHydrationWarning
      >
        <StudioLayoutEnhanced>{children}</StudioLayoutEnhanced>
      </body>
    </html>
  );
}