import { VideoCardSkeleton } from "@/components/VideoCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="px-6 py-4">
      <div className="mb-6">
        <div className="h-8 bg-slate-800/50 rounded w-1/3 animate-pulse mb-2"></div>
        <div className="h-5 bg-slate-800/50 rounded w-1/4 animate-pulse"></div>
      </div>
      
      <div className="mb-6">
        <div className="h-10 bg-slate-800/50 rounded w-24 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}