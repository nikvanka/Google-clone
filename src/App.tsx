/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import SearchHeader from "./components/SearchHeader";
import ResultsView from "./components/ResultsView";
import { SearchResponse, SearchPreferences } from "./types";
import { Search, Compass, AlertCircle } from "lucide-react";

export default function App() {
  const [view, setView] = useState<"home" | "results">("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load preferences from localStorage or default
  const [preferences, setPreferences] = useState<SearchPreferences>(() => {
    try {
      const saved = localStorage.getItem("google_search_prefs");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      safeSearch: "active",
      region: "US",
      language: "en",
      darkTheme: false
    };
  });

  // Save preferences changes
  useEffect(() => {
    localStorage.setItem("google_search_prefs", JSON.stringify(preferences));
    
    // Apply theme class to document element for Tailwind styles
    if (preferences.darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences]);

  // Execute actual search query
  const handleSearch = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;

    setQuery(targetQuery);
    setIsLoading(true);
    setFetchError(null);
    setView("results");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: targetQuery,
          safeSearch: preferences.safeSearch
        })
      });

      if (!res.ok) {
        throw new Error(`Search system error. Status: ${res.status}`);
      }

      const parsedData: SearchResponse = await res.json();
      setSearchResponse(parsedData);
    } catch (err: any) {
      console.error("Error fetching search results:", err);
      setFetchError(err.message || "Failed to contact query processing server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    setQuery("");
    setSearchResponse(null);
    setFetchError(null);
    setView("home");
    setCategory("all");
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-150 ${preferences.darkTheme ? "bg-[#050505] text-[#e0e0e0]" : "bg-white text-gray-900"}`}>
      
      {/* View router representation */}
      {view === "home" ? (
        <HomeView 
          onSearch={handleSearch} 
          preferences={preferences} 
          setPreferences={setPreferences} 
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top Sticky Header */}
          <SearchHeader
            initialQuery={query}
            onSearch={handleSearch}
            onGoHome={handleGoHome}
            preferences={preferences}
            setPreferences={setPreferences}
            category={category}
            setCategory={setCategory}
          />

          {/* Core Body */}
          <main className="flex-1">
            {isLoading ? (
              /* Shimmering Google Skeleton Loading Screens (Adapted to Elegant Obsidian/Dark Theme) */
              <div className="px-4 md:px-[164px] py-10 max-w-[652px] space-y-9">
                <div className={`h-3 w-44 rounded animate-pulse mb-6 ${
                  preferences.darkTheme ? "bg-white/5" : "bg-gray-200"
                }`}></div>
                
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-3">
                    {/* favicon and path */}
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-5 h-5 rounded-full animate-pulse ${
                        preferences.darkTheme ? "bg-white/5" : "bg-gray-250"
                      }`}></div>
                      <div className={`h-2.5 w-36 rounded animate-pulse ${
                        preferences.darkTheme ? "bg-white/5" : "bg-gray-200"
                      }`}></div>
                    </div>
                    {/* title */}
                    <div className={`h-4 w-[75%] rounded animate-pulse ${
                      preferences.darkTheme ? "bg-indigo-500/10" : "bg-blue-200/65"
                    }`}></div>
                    {/* double description list */}
                    <div className={`h-2.5 w-full rounded animate-pulse ${
                      preferences.darkTheme ? "bg-white/5" : "bg-gray-150"
                    }`}></div>
                    <div className={`h-2.5 w-[92%] rounded animate-pulse ${
                      preferences.darkTheme ? "bg-white/5" : "bg-gray-150"
                    }`}></div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              /* Severe Error Reporting Overlay */
              <div className="px-4 md:px-[164px] py-14 max-w-[652px] flex flex-col items-center text-center">
                <AlertCircle className="text-red-500 w-12 h-12 mb-4 animate-bounce" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Query Processing Interrupted</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{fetchError}</p>
                <button
                  onClick={() => handleSearch(query)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow cursor-pointer transition-colors"
                >
                  Retry Search
                </button>
              </div>
            ) : searchResponse ? (
              /* Active Results SERP Page */
              <ResultsView
                data={searchResponse}
                isLoading={isLoading}
                preferences={preferences}
                onSearch={handleSearch}
              />
            ) : (
              /* Empty result block fallback */
              <div className="px-4 md:px-[164px] py-14 max-w-[652px] text-center text-gray-400">
                <Compass className={`w-12 h-12 mx-auto mb-3 animate-spin duration-3000 ${
                  preferences.darkTheme ? "text-[#3f3f46]" : "text-gray-300"
                }`} />
                <p className="text-xs">No active results loaded. Enter a query to trigger facts.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
