export function MangaCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-white/5 w-4/5" />
        <div className="h-3 bg-white/5 w-2/5" />
        <div className="h-3 bg-white/5 w-1/4 mt-1" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] w-full bg-white/5 animate-pulse flex flex-col justify-end pb-20 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="h-4 bg-white/10 w-48" />
        <div className="h-24 bg-white/10 w-3/4" />
        <div className="h-6 bg-white/10 w-1/3" />
        <div className="h-14 bg-white/10 w-52" />
      </div>
    </div>
  );
}
