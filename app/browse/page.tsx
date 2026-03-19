'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronDown, Grid, List, Zap } from 'lucide-react';
import { MangaCard } from '@/components/MangaCard';
import { Manga } from '@/lib/types';

export default function Browse() {
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch('/api/manga');
        const data = await response.json();
        setMangaData(data);
      } catch (err) {
        console.error('Failed to fetch manga:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchManga();
  }, []);

  const genres = ['ALL', 'ACTION', 'SCI-FI', 'FANTASY', 'MYSTERY', 'SUPERNATURAL', 'PSYCHOLOGICAL', 'THRILLER', 'ADVENTURE'];
  
  const filteredManga = mangaData.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'ALL' || m.genres.some(g => g.toUpperCase() === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <Zap className="w-12 h-12 text-kinetic-orange animate-pulse" />
        <h1 className="font-display text-4xl tracking-tighter uppercase italic">LOADING KINETIC TITLES...</h1>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="font-display text-8xl md:text-9xl tracking-tighter uppercase italic leading-none mb-6">BROWSE THE ARCHIVE</h1>
          <p className="text-white/40 text-lg leading-relaxed">Explore our curated collection of high-end manga, from cyberpunk thrillers to epic fantasies.</p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">{filteredManga.length} TITLES FOUND</span>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/5 border border-white/10 hover:border-kinetic-orange transition-colors">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 border border-white/10 hover:border-kinetic-orange transition-colors">
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
            placeholder="SEARCH TITLES, AUTHORS, OR GENRES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-16 py-6 font-display text-2xl tracking-tight uppercase italic focus:outline-none focus:border-kinetic-orange transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {genres.map(genre => (
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

        <button className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 font-display text-xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors">
          <Filter className="w-5 h-5" />
          SORT BY: NEWEST
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
        {filteredManga.map((manga, idx) => (
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

      {filteredManga.length === 0 && (
        <div className="py-40 text-center flex flex-col items-center gap-6">
          <h2 className="font-display text-4xl tracking-tighter uppercase italic text-white/20">NO TITLES MATCH YOUR SEARCH</h2>
          <button 
            onClick={() => {setSearchQuery(''); setSelectedGenre('ALL');}}
            className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
