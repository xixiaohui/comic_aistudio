'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/browse', label: 'BROWSE' },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-obsidian/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="w-6 h-6 text-kinetic-orange group-hover:scale-110 transition-transform" />
          <span className="font-display text-2xl tracking-tighter uppercase italic">
            Manga<span className="text-kinetic-orange">Kinetic</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs font-bold tracking-widest uppercase transition-colors duration-200',
                pathname === link.href
                  ? 'text-kinetic-orange'
                  : 'text-white/50 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/browse"
            className="hidden md:flex p-2 text-white/40 hover:text-kinetic-orange transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-obsidian/95 backdrop-blur-md px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'font-display text-3xl tracking-tighter uppercase italic',
                pathname === link.href ? 'text-kinetic-orange' : 'text-white/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
