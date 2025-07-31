"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, XIcon, ClockIcon, TrendingUpIcon, Loader2Icon } from "lucide-react";
import { useSearch, usePopularSearches, useSearchSuggestions } from "@/hooks/api/use-search";
import { useSearchHistory } from "@/hooks/use-search-history";
import { formatNumber } from "@fabl/utils";
import Link from "next/link";
import Image from "next/image";

interface SearchBoxProps {
  className?: string;
}

export function SearchBox({ className = "" }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: searchResults, isLoading } = useSearch(query);
  const { data: popularSearches } = usePopularSearches();
  const { data: searchSuggestions } = useSearchSuggestions(query);
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addToHistory(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestionsCount = searchSuggestions?.length || searchResults?.suggestions?.length || 0;
    const totalItems = (searchResults?.videos.length || 0) + 
                      suggestionsCount + 
                      (query ? 0 : history.length);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          // Handle selection based on index
          if (searchResults) {
            const videoCount = searchResults.videos.length;
            if (selectedIndex < videoCount) {
              router.push(`/video/${searchResults.videos[selectedIndex].id}`);
            } else {
              const suggestionIndex = selectedIndex - videoCount;
              const suggestions = searchSuggestions?.length > 0 ? searchSuggestions : searchResults?.suggestions || [];
              if (suggestionIndex < suggestions.length) {
                handleSearch(suggestions[suggestionIndex]);
              }
            }
          } else if (!query && selectedIndex < history.length) {
            handleSearch(history[selectedIndex]);
          }
          setIsOpen(false);
        } else {
          handleSearch(query);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const showDropdown = isOpen && (query || history.length > 0 || popularSearches);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for magical content..."
          className="w-full bg-[#1a1230] border border-purple-500/30 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-[#1a1230] rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {isLoading && query ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="w-6 h-6 animate-spin text-purple-400" />
            </div>
          ) : (
            <>
              {/* Search Results */}
              {searchResults && query && (
                <>
                  {/* Video Results */}
                  {searchResults.videos.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs text-gray-400 px-3 py-1 font-medium">Videos</div>
                      {searchResults.videos.map((video, index) => (
                        <Link
                          key={video.id}
                          href={`/video/${video.id}`}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            selectedIndex === index
                              ? "bg-purple-500/20"
                              : "hover:bg-purple-500/10"
                          }`}
                          onClick={() => {
                            addToHistory(query);
                            setIsOpen(false);
                          }}
                        >
                          <div className="relative w-20 h-12 flex-shrink-0 rounded overflow-hidden bg-slate-800">
                            {video.thumbnailUrl && (
                              <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium line-clamp-1">{video.title}</div>
                            <div className="text-xs text-gray-400">
                              {formatNumber(video.views)} views
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Search Suggestions */}
                  {(searchResults?.suggestions?.length > 0 || searchSuggestions?.length > 0) && (
                    <div className="p-2 border-t border-purple-500/10">
                      <div className="text-xs text-gray-400 px-3 py-1 font-medium">Suggestions</div>
                      {/* Use real-time suggestions if available, otherwise use search result suggestions */}
                      {(searchSuggestions && searchSuggestions.length > 0 ? searchSuggestions : searchResults?.suggestions || [])
                        .map((suggestion, index) => {
                          const itemIndex = (searchResults?.videos?.length || 0) + index;
                          return (
                            <button
                              key={suggestion}
                              onClick={() => handleSearch(suggestion)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                selectedIndex === itemIndex
                                  ? "bg-purple-500/20"
                                  : "hover:bg-purple-500/10"
                              }`}
                            >
                              <SearchIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{suggestion}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* Search History */}
              {!query && history.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-xs text-gray-400 font-medium">Recent Searches</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Clear all
                    </button>
                  </div>
                  {history.map((item, index) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedIndex === index
                          ? "bg-purple-500/20"
                          : "hover:bg-purple-500/10"
                      }`}
                    >
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <button
                        onClick={() => handleSearch(item)}
                        className="flex-1 text-left text-sm"
                      >
                        {item}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                        }}
                        className="text-gray-400 hover:text-purple-400"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {!query && !history.length && popularSearches && (
                <div className="p-2">
                  <div className="text-xs text-gray-400 px-3 py-1 font-medium">Trending Searches</div>
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSearch(item)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors flex items-center gap-2"
                    >
                      <TrendingUpIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}