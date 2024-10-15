import type { Metadata } from "next";
import localFont from "next/font/local";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster} from "sonner";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "URLMind - Your Personal AI-Powered Knowledge Base",
  description:
    "Create your own knowledge base from your favorite URLs and get AI-powered answers instantly with URLMind.",
  keywords: [
    "AI",
    "knowledge base",
    "URL",
    "personalized learning",
    "artificial intelligence",
  ],
  authors: [{ name: "Keerthan Kumar C" }],
  icons: {
    icon: {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <Providers>
        <html lang="en">
          <head>
            <link rel="icon" href="/public/icon.svg" type="image/svg+xml" />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Toaster position="top-center" richColors />
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
