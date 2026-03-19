import Link from 'next/link';
import { Star } from 'lucide-react';
import { Manga } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

interface MangaCardProps {
  manga: Manga;
  variant?: 'default' | 'compact';
}

export function MangaCard({ manga, variant = 'default' }: MangaCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/manga/${manga.id}`} className="group flex items-center gap-4">
        <div className="w-16 h-24 flex-shrink-0 overflow-hidden bg-white/5">
          <img
            src={getImageUrl(manga.coverImage)}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="font-display text-xl tracking-tighter uppercase italic truncate group-hover:text-kinetic-orange transition-colors">
            {manga.title}
          </h4>
          <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
            {manga.author}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-kinetic-orange fill-kinetic-orange" />
            <span className="text-xs font-bold text-kinetic-orange">{manga.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/manga/${manga.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <img
          src={getImageUrl(manga.coverImage)}
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="font-display text-sm tracking-widest uppercase italic border border-white px-4 py-2 text-white">
            READ NOW
          </span>
        </div>

        {/* Status badge */}
        {manga.trending && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-kinetic-orange text-obsidian text-[9px] font-bold tracking-widest uppercase">
            TRENDING
          </div>
        )}
        {manga.fresh && !manga.trending && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white text-obsidian text-[9px] font-bold tracking-widest uppercase">
            NEW
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl tracking-tighter uppercase italic leading-tight group-hover:text-kinetic-orange transition-colors line-clamp-2">
          {manga.title}
        </h3>
        <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
          {manga.author}
        </span>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-kinetic-orange fill-kinetic-orange" />
          <span className="text-xs font-bold text-kinetic-orange">{manga.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
