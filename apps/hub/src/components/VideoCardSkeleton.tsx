export function VideoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1a1230] animate-pulse">
      <div className="aspect-video bg-slate-800/50"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-800/50 rounded w-full"></div>
        <div className="h-4 bg-slate-800/50 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800/50 rounded w-1/2 mt-3"></div>
      </div>
    </div>
  );
}