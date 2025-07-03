import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MorphioAI",
  description: "Repurpose smarter, grow faster. MorphioAI turns one piece of content into an audience across platforms.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  keywords: ['AI', 'content repurposing', 'social media', 'content creation', 'marketing automation'],
  authors: [{ name: 'MorphioAI Team' }],
  openGraph: {
    title: 'MorphioAI',
    description: 'Repurpose smarter, grow faster. Transform your content across all social media platforms with AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={null}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
