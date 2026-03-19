import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaKinetic",
  description: "A high-end, kinetic editorial manga reading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-obsidian text-white selection:bg-kinetic-orange selection:text-obsidian`}>
        <Navbar />
        <main className="container mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
