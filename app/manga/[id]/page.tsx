'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, Clock, BookOpen, Share2, Heart, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { MangaCard } from '@/components/MangaCard';
import { Manga } from '@/lib/types';

export default function Detail() {
  const params = useParams();
  const id = params.id as string;
  const [manga, setManga] = useState<Manga | null>(null);
  const [recommendations, setRecommendations] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const response = await fetch(`/api/manga/${id}`);
        if (!response.ok) throw new Error('Manga not found');
        const m = await response.json();
        
        setManga(m);

        // Fetch recommendations (just all manga for now)
        const recResponse = await fetch('/api/manga');
        const recData = await recResponse.json();
        setRecommendations(recData.filter((item: any) => item.id !== id).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch manga detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMangaDetail();
  }, [id]);
  
  if (loading) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <Zap className="w-12 h-12 text-kinetic-orange animate-pulse" />
        <h1 className="font-display text-4xl tracking-tighter uppercase italic">LOADING DETAILS...</h1>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-7xl tracking-tighter uppercase italic">MANGA NOT FOUND</h1>
        <Link href="/" className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline">RETURN HOME</Link>
      </div>
    );
  }

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getImageUrl(manga.bannerImage)} 
            alt={manga.title} 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row items-end gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-64 h-96 flex-shrink-0 overflow-hidden rounded-sm border border-white/10 shadow-2xl hidden md:block"
            >
              <img 
                src={getImageUrl(manga.coverImage)} 
                alt={manga.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  {manga.genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60">{g}</span>
                  ))}
                  <span className="px-3 py-1 bg-kinetic-orange text-obsidian text-[10px] font-bold tracking-widest uppercase">{manga.status}</span>
                </div>
                
                <h1 className="font-display text-8xl md:text-9xl tracking-tighter uppercase italic leading-[0.85] mb-8">{manga.title}</h1>
                
                <div className="flex flex-wrap items-center gap-10">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-kinetic-orange fill-kinetic-orange" />
                    <span className="font-display text-3xl tracking-tight uppercase italic">{manga.rating} / 5.0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-white/40" />
                    <span className="font-display text-3xl tracking-tight uppercase italic text-white/40">UPDATED 2D AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-white/40" />
                    <span className="font-display text-3xl tracking-tight uppercase italic text-white/40">{manga.chapters?.length || 0} CHAPTERS</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mt-20">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <section className="mb-20">
            <h2 className="font-display text-4xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">SYNOPSIS</h2>
            <p className="text-white/60 text-xl leading-relaxed font-light italic">
              {manga.description}
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-4">
              <h2 className="font-display text-4xl tracking-tighter uppercase italic">CHAPTERS</h2>
              <button className="text-xs font-bold tracking-widest uppercase text-white/40 hover:text-kinetic-orange transition-colors">SORT: NEWEST</button>
            </div>

            <div className="space-y-4">
              {manga.chapters?.map((chapter, idx) => (
                <Link 
                  key={chapter.id}
                  href={`/reader/${manga.id}/${chapter.id}`}
                  className="group flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-kinetic-orange/30 hover:bg-white/[0.07] transition-all duration-300"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-display text-4xl tracking-tighter uppercase italic text-white/10 group-hover:text-kinetic-orange/20 transition-colors">
                      {String(chapter.number).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-display text-2xl tracking-tight uppercase italic group-hover:text-kinetic-orange transition-colors">
                        {chapter.title}
                      </h3>
                      <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">{chapter.releaseDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase group-hover:text-white/60 transition-colors">READ NOW</span>
                    <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-kinetic-orange transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-20">
          <section>
            <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">ACTIONS</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 bg-kinetic-orange text-obsidian font-display text-xl tracking-tight uppercase italic hover:bg-white transition-colors">
                <Heart className="w-5 h-5" />
                FAVORITE
              </button>
              <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 font-display text-xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors">
                <Share2 className="w-5 h-5" />
                SHARE
              </button>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">YOU MAY ALSO LIKE</h2>
            <div className="space-y-8">
              {recommendations.map(rec => (
                <MangaCard key={rec.id} manga={rec} variant="compact" />
              ))}
            </div>
          </section>

          <section className="p-8 bg-kinetic-orange/5 border border-kinetic-orange/10">
            <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-4 text-kinetic-orange">KINETIC STATS</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">READERS</span>
                <span className="font-display text-2xl tracking-tight uppercase italic">124.5K</span>
              </div>
              <div className="w-full h-1 bg-white/5">
                <div className="w-[85%] h-full bg-kinetic-orange" />
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">ENGAGEMENT</span>
                <span className="font-display text-2xl tracking-tight uppercase italic">HIGH</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
