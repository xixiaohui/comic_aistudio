import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-40 pb-40 text-center flex flex-col items-center gap-8">
      <Zap className="w-16 h-16 text-kinetic-orange" />
      <h1 className="font-display text-[12rem] leading-none tracking-tighter uppercase italic text-white/5">
        404
      </h1>
      <div className="-mt-16 flex flex-col items-center gap-6">
        <h2 className="font-display text-6xl tracking-tighter uppercase italic">
          页面不存在
        </h2>
        <p className="text-white/40 text-lg max-w-md">
          您访问的页面不存在或已被移除，请返回首页继续浏览。
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors duration-300 mt-4"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
