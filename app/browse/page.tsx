'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronDown, Grid, List, Zap } from 'lucide-react';
import { MangaCard } from '@/components/MangaCard';
import { MangaCardSkeleton } from '@/components/MangaCardSkeleton';
import { Manga } from '@/lib/types';

type SortOption = 'newest' | 'rating' | 'trending';
type ViewMode = 'grid' | 'list';

export default function Browse() {
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch('/api/manga');
        const data = await response.json();
        setMangaData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch manga:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  // Derive all genres dynamically from data
  const genres = useMemo(() => {
    const all = new Set<string>(['ALL']);
    mangaData.forEach((m) => m.genres.forEach((g) => all.add(g.toUpperCase())));
    return Array.from(all);
  }, [mangaData]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'NEWEST',
    rating: 'TOP RATED',
    trending: 'TRENDING',
  };

  const filteredAndSorted = useMemo(() => {
    let result = mangaData.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === 'ALL' || m.genres.some((g) => g.toUpperCase() === selectedGenre);
      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'trending') {
      result = [...result].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }
    // 'newest' keeps API order (already sorted by created_at DESC)

    return result;
  }, [mangaData, searchQuery, selectedGenre, sortBy]);

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="h-24 bg-white/5 animate-pulse mb-16 w-3/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {Array.from({ length: 10 }).map((_, i) => (
            <MangaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-display text-8xl md:text-9xl tracking-tighter uppercase italic leading-none mb-6">
            BROWSE THE ARCHIVE
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Explore our curated collection of high-end manga, from cyberpunk thrillers to epic fantasies.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
            {filteredAndSorted.length} TITLES FOUND
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-kinetic-orange border-kinetic-orange text-obsidian'
                  : 'bg-white/5 border-white/10 hover:border-kinetic-orange'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 border transition-colors ${
                viewMode === 'list'
                  ? 'bg-kinetic-orange border-kinetic-orange text-obsidian'
                  : 'bg-white/5 border-white/10 hover:border-kinetic-orange'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-kinetic-orange transition-colors" />
          <input
            type="text"
            placeholder="SEARCH TITLES OR AUTHORS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-16 py-6 font-display text-2xl tracking-tight uppercase italic focus:outline-none focus:border-kinetic-orange transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-4 font-display text-xl tracking-tight uppercase italic border transition-all duration-300 ${
                selectedGenre === genre
                  ? 'bg-kinetic-orange border-kinetic-orange text-obsidian'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 font-display text-xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors whitespace-nowrap"
          >
            <Filter className="w-5 h-5" />
            SORT: {sortLabels[sortBy]}
            <ChevronDown className={`w-5 h-5 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 bg-kinetic-gray border border-white/10 z-10 min-w-full">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                  className={`w-full px-6 py-4 text-left font-display text-xl tracking-tight uppercase italic transition-colors ${
                    sortBy === opt ? 'text-kinetic-orange' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sortLabels[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {filteredAndSorted.map((manga, idx) => (
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05 }}
            >
              <MangaCard manga={manga} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAndSorted.map((manga, idx) => (
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (idx % 10) * 0.04 }}
            >
              <MangaCard manga={manga} variant="compact" />
            </motion.div>
          ))}
        </div>
      )}

      {filteredAndSorted.length === 0 && (
        <div className="py-40 text-center flex flex-col items-center gap-6">
          <Zap className="w-12 h-12 text-white/10" />
          <h2 className="font-display text-4xl tracking-tighter uppercase italic text-white/20">
            NO TITLES MATCH YOUR SEARCH
          </h2>
          <button
            onClick={() => { setSearchQuery(''); setSelectedGenre('ALL'); }}
            className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
