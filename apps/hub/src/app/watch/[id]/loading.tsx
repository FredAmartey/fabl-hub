
export default function VideoLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Skeleton */}
          <div className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
          
          {/* Video Info Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2" />
          </div>
          
          {/* Engagement Actions Skeleton */}
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-40 h-24 bg-gray-800 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}