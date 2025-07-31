import type { Metadata } from "next";
import { Inter, Afacad } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ClientLayout } from "../components/ClientLayout";

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
  title: "fabl.tv - AI Content Platform",
  description: "The ultimate platform for AI-generated content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${afacad.variable} font-inter antialiased bg-slate-900 text-white min-h-screen`}
          suppressHydrationWarning
        >
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
