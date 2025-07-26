import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StudioLayout from "@/components/StudioLayout";

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
        className={`${inter.variable} font-inter antialiased bg-studio-background text-white min-h-screen`}
        suppressHydrationWarning
      >
        <StudioLayout>{children}</StudioLayout>
      </body>
    </html>
  );
}