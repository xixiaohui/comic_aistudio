"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, User, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Navbar = () => {
  const pathname = usePathname();
  
  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'BROWSE', path: '/browse' },
    { name: 'LATEST', path: '/latest' },
    { name: 'MY LIBRARY', path: '/library' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-kinetic-orange flex items-center justify-center rounded-sm transform group-hover:rotate-12 transition-transform">
            <Zap className="w-5 h-5 text-obsidian fill-obsidian" />
          </div>
          <span className="font-display text-2xl tracking-tighter">MANGAKINETIC</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-xs font-semibold tracking-widest transition-colors hover:text-kinetic-orange",
                pathname === link.path ? "text-kinetic-orange" : "text-white/60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-white/60 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-white/60 hover:text-white transition-colors">
          <User className="w-5 h-5" />
        </button>
        <button className="md:hidden text-white/60 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
