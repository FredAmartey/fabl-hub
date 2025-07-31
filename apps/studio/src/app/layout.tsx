import type { Metadata } from "next";
import { Inter, Afacad } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import StudioLayout from "@/components/StudioLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fabl Studio - Creator Dashboard",
  description: "Manage your content, analytics, and channel settings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${afacad.variable} font-afacad antialiased bg-[#0a0a0f] text-white min-h-screen`}
          suppressHydrationWarning
        >
          <StudioLayout>{children}</StudioLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
