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
          PAGE NOT FOUND
        </h2>
        <p className="text-white/40 text-lg max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="group inline-flex items-center gap-4 px-10 py-5 bg-kinetic-orange text-obsidian font-display text-2xl tracking-tight uppercase italic hover:bg-white transition-colors duration-300 mt-4"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}
