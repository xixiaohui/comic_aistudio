"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, Zap } from 'lucide-react';
import { Manga } from '@/lib/types';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact';
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, variant = 'default' }) => {
  const getImageUrl = (path: string) => {
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (variant === 'compact') {
    return (
      <Link href={`/manga/${manga.id}`} className="group flex gap-4 items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
        <div className="w-16 h-20 overflow-hidden rounded-md flex-shrink-0">
          <img 
            src={getImageUrl(manga.coverImage)} 
            alt={manga.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-sm tracking-tight leading-none group-hover:text-kinetic-orange transition-colors">{manga.title}</h4>
          <span className="text-[10px] text-white/40 uppercase tracking-widest">{manga.author}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-kinetic-orange fill-kinetic-orange" />
            <span className="text-[10px] font-bold">{manga.rating}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link href={`/manga/${manga.id}`} className="block">
        <div className="aspect-[2/3] overflow-hidden rounded-sm relative border border-white/5">
          <img 
            src={getImageUrl(manga.coverImage)} 
            alt={manga.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {manga.fresh && (
            <div className="absolute top-2 left-2 bg-kinetic-orange text-obsidian text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-tighter">
              FRESH
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-xl leading-none tracking-tighter mb-1 group-hover:text-kinetic-orange transition-colors">
              {manga.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">{manga.author}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-kinetic-orange fill-kinetic-orange" />
                <span className="text-[10px] font-bold">{manga.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
