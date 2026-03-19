'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Sparkles, Mail } from 'lucide-react';
import { MangaCard } from '@/components/MangaCard';
import { Manga } from '@/lib/types';

export default function Home() {
  const [mangaData, setMangaData] = useState<Manga[]>([]);
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

  if (loading) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <Zap className="w-12 h-12 text-kinetic-orange animate-pulse" />
        <h1 className="font-display text-4xl tracking-tighter uppercase italic">LOADING KINETIC TITLES...</h1>
      </div>
    );
  }

  const trendingManga = mangaData.filter(m => m.trending);
  const freshManga = mangaData.filter(m => m.fresh);
  const heroManga = mangaData[0] || null;

  if (!heroManga) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-4xl tracking-tighter uppercase italic">NO TITLES AVAILABLE</h1>
      </div>
    );
  }

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="pt-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(heroManga.bannerImage)} 
            alt={heroManga.title} 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end pb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-kinetic-orange text-obsidian text-[10px] font-bold tracking-widest uppercase">FEATURED RELEASE</span>
              <div className="flex items-center gap-1 text-kinetic-orange">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">MUST READ</span>
              </div>
            </div>
            
            <h1 className="font-display text-8xl md:text-[12rem] leading-[0.85] tracking-tighter uppercase italic mb-8">
              {heroManga.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 mb-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">AUTHOR</span>
                <span className="font-display text-2xl tracking-tight uppercase italic">{heroManga.author}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">GENRES</span>
                <div className="flex gap-2">
                  {heroManga.genres.map(g => (
                    <span key={g} className="font-display text-xl tracking-tight uppercase italic">{g}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">RATING</span>
                <span className="font-display text-2xl tracking-tight uppercase italic text-kinetic-orange">{heroManga.rating} / 5.0</span>
              </div>
            </div>

            <Link 
              href={`/manga/${heroManga.id}`}
              className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-kinetic-orange transition-colors duration-300"
            >
              START READING
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="mt-32">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-kinetic-orange" />
            <h2 className="font-display text-5xl tracking-tighter uppercase italic">TRENDING NOW</h2>
          </div>
          <Link href="/browse" className="group flex items-center gap-2 text-white/40 hover:text-kinetic-orange transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">VIEW ALL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {trendingManga.map((manga, idx) => (
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MangaCard manga={manga} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fresh Section */}
      <section className="mt-32">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-kinetic-orange" />
            <h2 className="font-display text-5xl tracking-tighter uppercase italic">FRESH FROM THE INK WELL</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freshManga.map((manga, idx) => (
            <motion.div
              key={manga.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-64 overflow-hidden bg-white/5 border border-white/5 hover:border-kinetic-orange/30 transition-colors"
            >
              <Link href={`/manga/${manga.id}`} className="flex h-full">
                <div className="w-40 h-full flex-shrink-0 overflow-hidden">
                  <img 
                    src={getImageUrl(manga.coverImage)} 
                    alt={manga.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-widest text-kinetic-orange uppercase">NEW CHAPTER</span>
                    <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">• 2 HOURS AGO</span>
                  </div>
                  <h3 className="font-display text-4xl tracking-tighter uppercase italic mb-2 group-hover:text-kinetic-orange transition-colors">{manga.title}</h3>
                  <p className="text-white/40 text-sm line-clamp-2 mb-4">{manga.description}</p>
                  <div className="flex gap-2">
                    {manga.genres.slice(0, 2).map(g => (
                      <span key={g} className="text-[10px] font-bold tracking-widest text-white/40 uppercase border border-white/10 px-2 py-1">{g}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mt-40 py-24 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Mail className="w-[600px] h-[600px] -rotate-12 translate-x-1/4 -translate-y-1/4" />
        </div>
        
        <div className="max-w-2xl">
          <h2 className="font-display text-7xl tracking-tighter uppercase italic mb-6">JOIN THE KINETIC CIRCLE</h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">Get early access to new releases, exclusive artwork, and the latest news from the world of MangaKinetic.</p>
          
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM" 
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 font-display text-xl tracking-tight uppercase italic focus:outline-none focus:border-kinetic-orange transition-colors"
            />
            <button className="px-10 py-4 bg-kinetic-orange text-obsidian font-display text-xl tracking-tight uppercase italic hover:bg-white transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
