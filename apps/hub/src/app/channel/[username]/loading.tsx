export default function ChannelLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Channel Header Skeleton */}
      <div className="mb-8">
        <div className="h-48 bg-gray-800 rounded-xl animate-pulse mb-4" />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-800 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-8 bg-gray-800 rounded animate-pulse w-1/3 mb-2" />
            <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4" />
          </div>
          <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-gray-800 mb-6">
        <div className="flex gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-20 bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}