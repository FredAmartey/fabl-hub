"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { InfiniteVideoGrid } from "@/components/InfiniteVideoGrid";
import { useInfiniteVideoList } from "@/hooks/use-videos";
import { useUrlState } from "@/hooks/use-url-state";
import { ChevronDownIcon } from "lucide-react";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "views", label: "View Count" },
  { value: "date", label: "Upload Date" },
];

const durationOptions = [
  { value: "all", label: "Any duration" },
  { value: "short", label: "Under 4 minutes" },
  { value: "medium", label: "4-20 minutes" },
  { value: "long", label: "Over 20 minutes" },
];

const uploadDateOptions = [
  { value: "all", label: "Any time" },
  { value: "hour", label: "Last hour" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [filters, setFilters] = useUrlState({
    sort: "relevance",
    duration: "all",
    date: "all"
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteVideoList({ 
    search: query,
    orderBy: filters.sort === "views" ? "views" : filters.sort === "date" ? "createdAt" : undefined,
    order: filters.sort === "views" ? "desc" : filters.sort === "date" ? "desc" : undefined,
    limit: 20 
  });

  const allVideos = data?.pages
    ?.flatMap(page => page?.data || [])
    ?.filter(video => video && video.id) || [];


  const activeFilterCount = [
    filters.sort !== "relevance",
    filters.duration !== "all",
    filters.date !== "all"
  ].filter(Boolean).length;

  return (
    <div className="px-6 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          Search results for &ldquo;<span className="text-purple-400">{query}</span>&rdquo;
        </h1>
        {!isLoading && (
          <p className="text-gray-400">
            About {allVideos.length * 10} results
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1230] hover:bg-purple-500/20 rounded-lg transition-colors"
        >
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/30 rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-[#1a1230] rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Sort by</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ sort: e.target.value })}
                  className="w-full bg-[#0f0a1e] border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Duration</label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ duration: e.target.value })}
                  className="w-full bg-[#0f0a1e] border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Date */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Upload date</label>
                <select
                  value={filters.date}
                  onChange={(e) => setFilters({ date: e.target.value })}
                  className="w-full bg-[#0f0a1e] border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  {uploadDateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilters({ 
                    sort: "relevance",
                    duration: "all",
                    date: "all"
                  });
                }}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <InfiniteVideoGrid
        videos={allVideos}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        onLoadMore={fetchNextPage}
        emptyMessage={`No results found for "${query}"`}
      />

      {/* Related Searches */}
      {!isLoading && allVideos.length > 0 && (
        <div className="mt-12 p-6 bg-[#1a1230] rounded-xl">
          <h3 className="text-lg font-medium mb-4">Related searches</h3>
          <div className="flex flex-wrap gap-2">
            {[
              `${query} tutorial`,
              `${query} for beginners`,
              `best ${query}`,
              `how to ${query}`,
              `${query} 2024`
            ].map((suggestion) => (
              <a
                key={suggestion}
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full text-sm transition-colors"
              >
                {suggestion}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}