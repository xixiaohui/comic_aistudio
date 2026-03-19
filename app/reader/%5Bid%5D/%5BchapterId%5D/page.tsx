// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, useScroll, useSpring } from 'motion/react';
// import { ChevronLeft, ChevronRight, Settings, Maximize2, Zap, ArrowLeft } from 'lucide-react';
// import { Manga, Chapter } from '@/lib/types';

// export default function Reader() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const chapterId = params.chapterId as string;
  
//   const [manga, setManga] = useState<Manga | null>(null);
//   const [chapter, setChapter] = useState<Chapter | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showControls, setShowControls] = useState(true);
  
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   });

//   useEffect(() => {
//     const fetchChapterData = async () => {
//       try {
//         setLoading(true);
//         // Fetch manga to get basic info and chapter list
//         const mResponse = await fetch(`/api/manga/${id}`);
//         const mData = await mResponse.json();
//         const mappedManga: Manga = {
//           id: mData.id,
//           title: mData.title,
//           author: mData.author,
//           description: mData.description,
//           coverImage: mData.cover_image,
//           bannerImage: mData.banner_image,
//           genres: mData.genres,
//           status: mData.status,
//           rating: parseFloat(mData.rating),
//           trending: mData.trending,
//           fresh: mData.fresh,
//           chapters: mData.chapters.map((c: any) => ({
//             id: c.id,
//             number: c.number,
//             title: c.title,
//             releaseDate: c.release_date,
//             pages: []
//           }))
//         };
//         setManga(mappedManga);

//         // Fetch pages for this chapter
//         const pResponse = await fetch(`/api/chapters/${chapterId}/pages`);
//         const pData = await pResponse.json();
        
//         const currentChapter = mappedManga.chapters.find(c => c.id === chapterId);
//         if (currentChapter) {
//           currentChapter.pages = pData.map((p: any) => p.image_path);
//           setChapter(currentChapter);
//         }
//       } catch (err) {
//         console.error('Failed to fetch chapter data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChapterData();
//   }, [id, chapterId]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const pageIndex = Math.floor(scrollPosition / windowHeight) + 1;
//       setCurrentPage(Math.min(pageIndex, chapter?.pages.length || 1));
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [chapter]);

//   if (loading) {
//     return (
//       <div className="pt-40 text-center flex flex-col items-center gap-6">
//         <Zap className="w-12 h-12 text-kinetic-orange animate-pulse" />
//         <h1 className="font-display text-4xl tracking-tighter uppercase italic">LOADING CHAPTER...</h1>
//       </div>
//     );
//   }

//   if (!manga || !chapter) {
//     return (
//       <div className="pt-40 text-center flex flex-col items-center gap-6">
//         <h1 className="font-display text-7xl tracking-tighter uppercase italic">CHAPTER NOT FOUND</h1>
//         <Link href="/" className="text-kinetic-orange font-bold tracking-widest uppercase hover:underline">RETURN HOME</Link>
//       </div>
//     );
//   }

//   const nextChapter = manga.chapters.find(c => c.number === chapter.number + 1);
//   const prevChapter = manga.chapters.find(c => c.number === chapter.number - 1);

//   const getImageUrl = (path: string) => {
//     if (!path) return '';
//     if (path.startsWith('http') || path.startsWith('data:')) return path;
//     return path.startsWith('/') ? path : `/${path}`;
//   };

//   return (
//     <div className="bg-obsidian min-h-screen">
//       {/* Top Bar */}
//       <motion.div 
//         initial={{ y: -100 }}
//         animate={{ y: showControls ? 0 : -100 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between"
//       >
//         <div className="flex items-center gap-6">
//           <Link href={`/manga/${manga.id}`} className="text-white/60 hover:text-kinetic-orange transition-colors">
//             <ArrowLeft className="w-6 h-6" />
//           </Link>
//           <div className="flex flex-col">
//             <h2 className="font-display text-xl tracking-tighter uppercase italic leading-none">{manga.title}</h2>
//             <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">CHAPTER {chapter.number}: {chapter.title}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-8">
//           <div className="hidden md:flex items-center gap-4">
//             <button 
//               disabled={!prevChapter}
//               onClick={() => router.push(`/reader/${manga.id}/${prevChapter?.id}`)}
//               className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
//             >
//               <ChevronLeft className="w-6 h-6" />
//             </button>
//             <div className="px-4 py-2 bg-white/5 border border-white/10 font-display text-xl tracking-tight">
//               PAGE {currentPage} / {chapter.pages.length}
//             </div>
//             <button 
//               disabled={!nextChapter}
//               onClick={() => router.push(`/reader/${manga.id}/${nextChapter?.id}`)}
//               className="p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
//             >
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <button className="p-2 text-white/40 hover:text-white transition-colors">
//               <Settings className="w-5 h-5" />
//             </button>
//             <button className="p-2 text-white/40 hover:text-white transition-colors">
//               <Maximize2 className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Progress Bar */}
//       <motion.div 
//         className="fixed top-0 left-0 right-0 h-1 bg-kinetic-orange z-[60] origin-left"
//         style={{ scaleX }}
//       />

//       {/* Content */}
//       <div className="max-w-4xl mx-auto pt-24 pb-40 flex flex-col items-center gap-0">
//         {chapter.pages.map((page, idx) => (
//           <div key={idx} className="w-full relative group">
//             <img 
//               src={getImageUrl(page)} 
//               alt={`Page ${idx + 1}`} 
//               className="w-full h-auto"
//               referrerPolicy="no-referrer"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Bottom Navigation */}
//       <div className="max-w-4xl mx-auto px-6 pb-40">
//         <div className="flex flex-col items-center gap-12 pt-20 border-t border-white/5">
//           <h3 className="font-display text-4xl tracking-tighter uppercase italic text-white/20">YOU'VE REACHED THE END OF THE CHAPTER</h3>
          
//           <div className="flex gap-6">
//             {prevChapter && (
//               <button 
//                 onClick={() => router.push(`/reader/${manga.id}/${prevChapter.id}`)}
//                 className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white font-display text-2xl tracking-tight uppercase italic hover:border-kinetic-orange transition-colors"
//               >
//                 <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
//                 PREVIOUS
//               </button>
//             )}
//             {nextChapter ? (
//               <button 
//                 onClick={() => router.push(`/reader/${manga.id}/${nextChapter.id}`)}
//                 className="group flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors"
//               >
//                 NEXT CHAPTER
//                 <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
//               </button>
//             ) : (
//               <Link 
//                 href={`/manga/${manga.id}`}
//                 className="group flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors"
//               >
//                 BACK TO DETAILS
//                 <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function Reader() {
  return (<>
    <h1>ceshui</h1>
  </>)
}