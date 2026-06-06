/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, X, Settings2, SlidersHorizontal, Sun, Moon } from "lucide-react";
import { SearchPreferences } from "../types";

interface SearchHeaderProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  onGoHome: () => void;
  preferences: SearchPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<SearchPreferences>>;
  category: string;
  setCategory: (cat: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "🔍 All", active: true },
  { id: "news", label: "📰 News" },
  { id: "images", label: "🖼️ Images" },
  { id: "videos", label: "🎥 Videos" },
  { id: "maps", label: "🗺️ Maps" },
  { id: "shopping", label: "🏷️ Shopping" }
];

export default function SearchHeader({
  initialQuery,
  onSearch,
  onGoHome,
  preferences,
  setPreferences,
  category,
  setCategory
}: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleToggleTheme = () => {
    setPreferences(prev => ({ ...prev, darkTheme: !prev.darkTheme }));
  };

  const handleToggleSafeSearch = () => {
    setPreferences(prev => ({
      ...prev,
      safeSearch: prev.safeSearch === "active" ? "off" : "active"
    }));
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
      preferences.darkTheme 
        ? "bg-[#050505] border-white/5" 
        : "bg-white border-gray-200"
    }`}>
      
      {/* Top Main Row */}
      <div className="flex flex-col md:flex-row md:items-center px-4 md:px-10 py-4 gap-4 justify-between">
        
        {/* Left Google Logo and Search Bar */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-8 gap-3 max-w-[850px]">
          {/* Logo */}
          <div 
            onClick={onGoHome}
            className="flex items-center space-x-1.5 select-none cursor-pointer tracking-tighter shrink-0 font-bold text-xl"
          >
            {preferences.darkTheme ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter">AURA</span>
            ) : (
              <div className="flex items-center space-x-0.5">
                <span className="text-blue-500 font-sans font-extrabold text-2xl">G</span>
                <span className="text-red-500 font-sans font-extrabold text-2xl">o</span>
                <span className="text-yellow-500 font-sans font-extrabold text-2xl">o</span>
                <span className="text-blue-500 font-sans font-extrabold text-2xl">g</span>
                <span className="text-green-500 font-sans font-extrabold text-2xl">l</span>
                <span className="text-red-500 font-sans font-extrabold text-2xl">e</span>
              </div>
            )}
            {preferences.darkTheme && (
              <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-extrabold px-1.5 py-0.5 bg-[#111111] border border-white/5 rounded-full">
                index
              </span>
            )}
          </div>

          {/* Input Box Pill wrapper */}
          <form onSubmit={handleSubmit} className="flex-1 w-full max-w-[692px]">
            <div className={`flex items-center w-full px-4.5 py-2.5 rounded-full border transition-all duration-300 ${
              preferences.darkTheme
                ? "bg-[#111111] border-white/10 focus-within:border-indigo-500/50 focus-within:bg-[#141414] focus-within:ring-4 focus-within:ring-indigo-500/15"
                : "bg-white border-gray-200 focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)]"
            }`}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`w-full bg-transparent border-none outline-none text-sm ${
                  preferences.darkTheme ? "text-white placeholder-neutral-500 font-light" : "text-gray-900"
                }`}
              />
              
              <div className="flex items-center space-x-3 ml-2 text-neutral-400">
                {query && (
                  <button 
                    type="button" 
                    onClick={() => setQuery("")}
                    className="p-1 hover:bg-white/5 rounded-full cursor-pointer transition-colors"
                  >
                    <X size={15} />
                  </button>
                )}
                <div className={`w-[1px] h-5 hidden sm:block ${
                  preferences.darkTheme ? "bg-white/5" : "bg-gray-200"
                }`}></div>
                <button 
                  type="submit" 
                  title="Search"
                  className={`hover:scale-110 active:scale-95 cursor-pointer hidden sm:block transition-transform ${
                    preferences.darkTheme ? "text-indigo-455" : "text-blue-500"
                  }`}
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Settings and Controls */}
        <div className="flex items-center space-x-3 self-end md:self-auto text-neutral-400">
          <button 
            onClick={handleToggleTheme}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              preferences.darkTheme ? "hover:bg-white/5 text-yellow-400" : "hover:bg-gray-100 text-gray-500"
            }`}
            title="Toggle theme visualizer"
          >
            {preferences.darkTheme ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`p-2 rounded-full cursor-pointer transition-all flex items-center space-x-1.5 text-xs font-medium border ${
                preferences.darkTheme
                  ? "hover:bg-white/5 border-white/5"
                  : "hover:bg-gray-100 border-transparent"
              } ${
                showSettingsMenu 
                  ? preferences.darkTheme 
                    ? "bg-[#141414] border-white/10 text-white" 
                    : "bg-gray-150 border-gray-300"
                  : ""
              }`}
            >
              <Settings2 size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Float Settings Panel */}
            {showSettingsMenu && (
              <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border p-4 select-none z-50 ${
                preferences.darkTheme 
                  ? "bg-[#0c0c0c] border-[#1f1f21] text-neutral-200" 
                  : "bg-white border-gray-200 text-gray-700"
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 border-white/5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e3e3e3]">Search Filters</span>
                  <SlidersHorizontal size={14} className="text-neutral-500" />
                </div>

                <div className="space-y-4 text-xs font-medium">
                  {/* Safe Search toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">SafeSearch Filter</p>
                      <p className="text-3xs text-neutral-500 leading-tight">Filters explicit/unsafe query results</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={preferences.safeSearch === "active"}
                        onChange={handleToggleSafeSearch}
                        className="sr-only peer" 
                      />
                      <div className={`w-9 h-5 rounded-full peer transition-all duration-200 relative
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                        peer-checked:after:translate-x-full
                        ${preferences.darkTheme
                          ? "bg-neutral-800 border border-white/5 peer-checked:bg-indigo-600 after:border-neutral-700"
                          : "bg-gray-200 after:border-gray-300 after:border peer-checked:bg-blue-600"
                        }
                      `}></div>
                    </label>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <p className="font-semibold mb-1.5">Search Language</p>
                    <select 
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className={`w-full border rounded p-1.5 text-2xs focus:outline-none focus:ring-1 ${
                        preferences.darkTheme
                          ? "bg-[#111111] border-white/10 text-neutral-300 focus:ring-indigo-500"
                          : "bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500"
                      }`}
                    >
                      <option value="en">English (US)</option>
                      <option value="de">Deutsch (German)</option>
                      <option value="es">Español (Spanish)</option>
                    </select>
                  </div>

                  {/* Region selection indicator */}
                  <div>
                    <p className="font-semibold">Search Region</p>
                    <p className={`text-2xs mt-0.5 font-bold uppercase tracking-wider ${
                      preferences.darkTheme ? "text-indigo-400" : "text-[#4285f4]"
                    }`}>United States Node</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {preferences.darkTheme ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-indigo-500/20 uppercase cursor-pointer">
              GS
            </div>
          ) : (
            <button className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs Row */}
      <div className="flex overflow-x-auto px-4 md:px-[164px] scrollbar-none divide-x-0">
        <div className="flex space-x-6 text-2xs tracking-wide select-none shrink-0 font-medium select-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`pb-3 pt-1 border-b-[3px] font-bold cursor-pointer transition text-center whitespace-nowrap uppercase tracking-wider text-[10px] ${
                category === cat.id
                  ? preferences.darkTheme
                    ? "border-indigo-500 text-indigo-400"
                    : "border-blue-600 text-blue-600"
                  : preferences.darkTheme
                    ? "border-transparent text-neutral-500 hover:text-neutral-200"
                    : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

    </header>
  );
}
