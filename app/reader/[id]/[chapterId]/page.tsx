'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
import { ChevronLeft, ChevronRight, Settings, Zap, ArrowLeft, AlignJustify } from 'lucide-react';
import { Manga, Chapter } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

type ReadingMode = 'scroll' | 'page';

export default function Reader() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const chapterId = params.chapterId as string;

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>('scroll');
  const [showSettings, setShowSettings] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        const [mResponse, pResponse] = await Promise.all([
          fetch(`/api/manga/${id}`),
          fetch(`/api/chapters/${chapterId}/pages`),
        ]);

        const mData = await mResponse.json();
        const pData = await pResponse.json();

        setManga(mData);

        const currentChapter = mData.chapters?.find((c: any) => c.id === chapterId);
        if (currentChapter) {
          currentChapter.pages = Array.isArray(pData) ? pData.map((p: any) => p.imagePath) : [];
          setChapter(currentChapter);
        }
      } catch (err) {
        console.error('获取章节数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterData();
  }, [id, chapterId]);

  useEffect(() => {
    if (readingMode !== 'scroll') return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const pageIndex = Math.floor(scrollPosition / windowHeight) + 1;
      setCurrentPage(Math.min(pageIndex, chapter?.pages?.length || 1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapter, readingMode]);

  // 3秒无操作自动隐藏控制栏
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', show);
    window.addEventListener('touchstart', show);
    return () => {
      window.removeEventListener('mousemove', show);
      window.removeEventListener('touchstart', show);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <Zap className="w-12 h-12 text-kinetic-orange animate-pulse" />
        <h1 className="font-display text-4xl tracking-tighter uppercase italic">章节加载中...</h1>
      </div>
    );
  }

  if (!manga || !chapter) {
    return (
      <div className="pt-40 text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-7xl tracking-tighter uppercase italic">章节不存在</h1>
        <Link href="/" className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const nextChapter = manga.chapters?.find((c) => c.number === chapter.number + 1);
  const prevChapter = manga.chapters?.find((c) => c.number === chapter.number - 1);
  const pages = chapter.pages || [];

  return (
    <div className="bg-obsidian min-h-screen">
      {/* 阅读进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-kinetic-orange z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* 顶部控制栏 */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: showControls ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <Link
            href={`/manga/${manga.id}`}
            className="text-white/60 hover:text-kinetic-orange transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex flex-col">
            <h2 className="font-display text-xl tracking-tighter uppercase italic leading-none">
              {manga.title}
            </h2>
            <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
              第 {chapter.number} 话：{chapter.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-4">
            <button
              disabled={!prevChapter}
              onClick={() => router.push(`/reader/${manga.id}/${prevChapter?.id}`)}
              className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
              title="上一话"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="px-4 py-2 bg-white/5 border border-white/10 font-display text-xl tracking-tight">
              第 {currentPage} / {pages.length || '?'} 页
            </div>
            <button
              disabled={!nextChapter}
              onClick={() => router.push(`/reader/${manga.id}/${nextChapter?.id}`)}
              className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
              title="下一话"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="阅读设置"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setReadingMode((m) => (m === 'scroll' ? 'page' : 'scroll'))}
              className="p-2 text-white/40 hover:text-white transition-colors"
              title={readingMode === 'scroll' ? '切换为翻页模式' : '切换为滚动模式'}
            >
              <AlignJustify className="w-5 h-5" />
            </button>

            {/* 设置面板 */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 bg-kinetic-gray border border-white/10 p-6 min-w-[200px] z-10">
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">阅读模式</p>
                {(['scroll', 'page'] as ReadingMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => { setReadingMode(mode); setShowSettings(false); }}
                    className={`w-full text-left font-display text-xl tracking-tight uppercase italic py-2 transition-colors ${
                      readingMode === mode ? 'text-kinetic-orange' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode === 'scroll' ? '连续滚动' : '逐页翻阅'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 漫画页面内容 */}
      <div className="max-w-4xl mx-auto pt-24 pb-40 flex flex-col items-center">
        {pages.length === 0 ? (
          <div className="py-40 text-center">
            <p className="font-display text-3xl tracking-tighter uppercase italic text-white/20">
              本章暂无页面内容
            </p>
          </div>
        ) : (
          pages.map((page, idx) => (
            <div key={idx} className="w-full relative">
              <img
                src={getImageUrl(page)}
                alt={`第 ${idx + 1} 页`}
                className="w-full h-auto"
                referrerPolicy="no-referrer"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))
        )}
      </div>

      {/* 底部章节导航 */}
      <div className="max-w-4xl mx-auto px-6 pb-40">
        <div className="flex flex-col items-center gap-12 pt-20 border-t border-white/5">
          <h3 className="font-display text-4xl tracking-tighter uppercase italic text-white/20">
            本话已阅读完毕
          </h3>

          <div className="flex gap-6 flex-wrap justify-center">
            {prevChapter && (
              <button
                onClick={() => router.push(`/reader/${manga.id}/${prevChapter.id}`)}
                className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white font-display text-2xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                上一话
              </button>
            )}
            {nextChapter ? (
              <button
                onClick={() => router.push(`/reader/${manga.id}/${nextChapter.id}`)}
                className="group flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors"
              >
                下一话
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            ) : (
              <Link
                href={`/manga/${manga.id}`}
                className="group flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors"
              >
                返回作品详情
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
