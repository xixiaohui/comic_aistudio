'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, BookOpen, Share2, Heart, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { MangaCard } from '@/components/MangaCard';
import { MangaCardSkeleton } from '@/components/MangaCardSkeleton';
import { Manga } from '@/lib/types';
import { getImageUrl, formatRelativeDate } from '@/lib/utils';

export default function Detail() {
  const params = useParams();
  const id = params.id as string;
  const [manga, setManga] = useState<Manga | null>(null);
  const [recommendations, setRecommendations] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const [mangaRes, allRes] = await Promise.all([
          fetch(`/api/manga/${id}`),
          fetch('/api/manga'),
        ]);

        if (!mangaRes.ok) throw new Error('作品不存在');
        const mangaData = await mangaRes.json();
        const allData = await allRes.json();

        setManga(mangaData);
        setRecommendations(
          Array.isArray(allData)
            ? allData.filter((item: any) => item.id !== id).slice(0, 4)
            : []
        );
      } catch (err) {
        console.error('获取漫画详情失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMangaDetail();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级处理
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <div className="relative h-[60vh] w-full bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mt-20">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-8 bg-white/5 w-48 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-white/5 animate-pulse" style={{ width: `${90 - i * 10}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-7xl tracking-tighter uppercase italic">作品不存在</h1>
        <Link href="/" className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const statusLabel = manga.status === 'Ongoing' ? '连载中' : '已完结';

  return (
    <div className="pb-20">
      {/* 横幅封面 */}
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
              className="w-64 h-96 flex-shrink-0 overflow-hidden border border-white/10 shadow-2xl hidden md:block"
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
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  {manga.genres.map((g) => (
                    <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/60">
                      {g}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-kinetic-orange text-obsidian text-[10px] font-bold tracking-widest uppercase">
                    {statusLabel}
                  </span>
                </div>

                <h1 className="font-display text-8xl md:text-9xl tracking-tighter uppercase italic leading-[0.85] mb-8">
                  {manga.title}
                </h1>

                <div className="flex flex-wrap items-center gap-10">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-kinetic-orange fill-kinetic-orange" />
                    <span className="font-display text-3xl tracking-tight uppercase italic">
                      {manga.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-white/40" />
                    <span className="font-display text-3xl tracking-tight uppercase italic text-white/40">
                      共 {manga.chapters?.length || 0} 话
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mt-20">
        {/* 主内容 */}
        <div className="lg:col-span-2">
          <section className="mb-20">
            <h2 className="font-display text-4xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">
              作品简介
            </h2>
            <p className="text-white/60 text-xl leading-relaxed font-light italic">{manga.description}</p>
          </section>

          {manga.chapters && manga.chapters.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-4">
                <h2 className="font-display text-4xl tracking-tighter uppercase italic">章节列表</h2>
              </div>

              <div className="space-y-4">
                {manga.chapters.map((chapter) => (
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
                        <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                          {formatRelativeDate(chapter.releaseDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase group-hover:text-white/60 transition-colors">
                        立即阅读
                      </span>
                      <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-kinetic-orange transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 侧边栏 */}
        <div className="space-y-20">
          <section>
            <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">
              操作
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFavorited((v) => !v)}
                className={`flex items-center justify-center gap-3 py-4 font-display text-xl tracking-tight uppercase italic transition-colors ${
                  favorited
                    ? 'bg-white text-obsidian'
                    : 'bg-kinetic-orange text-obsidian hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-kinetic-orange text-kinetic-orange' : ''}`} />
                {favorited ? '已收藏' : '收藏'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 font-display text-xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors"
              >
                <Share2 className="w-5 h-5" />
                {copied ? '已复制！' : '分享'}
              </button>
            </div>
          </section>

          {recommendations.length > 0 && (
            <section>
              <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-8 border-b border-white/5 pb-4">
                猜你喜欢
              </h2>
              <div className="space-y-8">
                {recommendations.map((rec) => (
                  <MangaCard key={rec.id} manga={rec} variant="compact" />
                ))}
              </div>
            </section>
          )}

          <section className="p-8 bg-kinetic-orange/5 border border-kinetic-orange/10">
            <h2 className="font-display text-2xl tracking-tighter uppercase italic mb-4 text-kinetic-orange">
              开始阅读
            </h2>
            {manga.chapters && manga.chapters.length > 0 ? (
              <Link
                href={`/reader/${manga.id}/${manga.chapters[0].id}`}
                className="group inline-flex items-center gap-4 w-full px-6 py-4 bg-kinetic-orange text-obsidian font-display text-xl tracking-tight uppercase italic hover:bg-white transition-colors"
              >
                第一话
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <p className="text-white/40 text-sm">暂无章节，敬请期待。</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
