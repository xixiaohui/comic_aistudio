import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "漫画动力 MangaKinetic",
  description: "高端动感漫画阅读平台，探索海量精品漫画作品",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-obsidian text-white selection:bg-kinetic-orange selection:text-obsidian`}>
        <Navbar />
        <main className="container mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
