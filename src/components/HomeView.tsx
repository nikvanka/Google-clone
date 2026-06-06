/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, Mic, Camera, X, Plus, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SearchPreferences } from "../types";

interface HomeViewProps {
  onSearch: (query: string) => void;
  preferences: SearchPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<SearchPreferences>>;
}

const SHORTCUTS = [
  { name: "YouTube", url: "https://youtube.com", icon: "📺", bg: "bg-red-50 hover:bg-red-105" },
  { name: "Google Maps", url: "https://maps.google.com", icon: "🗺️", bg: "bg-green-50 hover:bg-green-105" },
  { name: "Gmail", url: "https://mail.google.com", icon: "✉️", bg: "bg-blue-50 hover:bg-blue-105" },
  { name: "Translate", url: "https://translate.google.com", icon: "🌐", bg: "bg-teal-50 hover:bg-teal-105" },
  { name: "Google Drive", url: "https://drive.google.com", icon: "💾", bg: "bg-yellow-50 hover:bg-yellow-105" },
  { name: "AI Studio", url: "https://ai.studio", icon: "🎓", bg: "bg-purple-50 hover:bg-purple-105" }
];

const FUN_LUCKY_TERMS = [
  "React 19 main features",
  "Latest breakthroughs in Quantum Computing",
  "How hot is the core of the Sun",
  "Generative AI trends 2026",
  "Mars Perseverance Rover progress",
  "History of Larry Page and Sergey Brin",
  "Vite JS framework guide"
];

export default function HomeView({ onSearch, preferences, setPreferences }: HomeViewProps) {
  const [query, setQuery] = useState("");
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [isLensActive, setIsLensActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("Listening...");
  const [micVolume, setMicVolume] = useState<number[]>([15, 20, 15, 10]);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Autofocus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Web Speech API Integration for real-time voice recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = preferences.language === "en" ? "en-US" : preferences.language === "de" ? "de-DE" : "es-ES";

      rec.onstart = () => {
        setVoiceTranscript("Listening...");
        const interval = setInterval(() => {
          setMicVolume([
            Math.floor(Math.random() * 40) + 10,
            Math.floor(Math.random() * 60) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 30) + 10,
          ]);
        }, 120);
        (rec as any).intervalId = interval;
      };

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        setVoiceTranscript(transcript || "Listening...");
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setVoiceTranscript(`Error: ${event.error}. Try again.`);
        clearInterval((rec as any).intervalId);
      };

      rec.onend = () => {
        clearInterval((rec as any).intervalId);
        if (voiceTranscript && voiceTranscript !== "Listening..." && !voiceTranscript.startsWith("Error")) {
          setTimeout(() => {
            onSearch(voiceTranscript);
            setIsVoiceSearchActive(false);
          }, 800);
        } else {
          setTimeout(() => {
            setIsVoiceSearchActive(false);
          }, 1500);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [preferences.language, voiceTranscript]);

  const handleStartVoice = () => {
    if (recognitionRef.current) {
      setIsVoiceSearchActive(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition start failed, already running?", e);
      }
    } else {
      setIsVoiceSearchActive(true);
      setVoiceTranscript("Listening... (Speech API not supported in this window)");
      setTimeout(() => {
        setVoiceTranscript("React 19 custom hooks");
      }, 2000);
      setTimeout(() => {
        onSearch("React 19 custom hooks");
        setIsVoiceSearchActive(false);
      }, 4000);
    }
  };

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsVoiceSearchActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleFeelingLucky = () => {
    const randomIndex = Math.floor(Math.random() * FUN_LUCKY_TERMS.length);
    const keyword = FUN_LUCKY_TERMS[randomIndex];
    onSearch(keyword);
  };

  const selectLanguage = (langCode: string) => {
    setPreferences(prev => ({ ...prev, language: langCode }));
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-200 ${
      preferences.darkTheme 
        ? "bg-[#050505] text-[#e0e0e0] border border-white/5" 
        : "bg-white text-gray-800"
    }`}>
      
      {/* Top Header Controls (Dynamic dark style integration) */}
      <header className={`flex items-center justify-between p-5 text-sm font-medium ${
        preferences.darkTheme ? "text-neutral-400" : "text-gray-500"
      } select-none`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setPreferences(p => ({ ...p, darkTheme: !p.darkTheme }))}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              preferences.darkTheme ? "hover:bg-white/5 text-yellow-400" : "hover:bg-gray-100 text-gray-500"
            }`}
            title="Toggle theme visualizer"
          >
            {preferences.darkTheme ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <span className="font-mono text-2xs uppercase tracking-widest opacity-65">v2026.06</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Matrix</a>
          <a href="https://images.google.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Visuals</a>
          
          {/* Apps launcher icon grid representation */}
          <button className={`p-2 rounded-full cursor-pointer transition-colors ${
            preferences.darkTheme ? "hover:bg-white/5 text-neutral-400 hover:text-white" : "hover:bg-gray-100 text-gray-600"
          }`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6,8c1.1,0,2-0.9,2-2s-0.9-2-2-2S4,4.9,4,6S4.9,8,6,8z M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2S10,4.9,10,6S10.9,8,12,8z M18,8 c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S16.9,8,18,8z M6,14c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S4.9,14,6,14z M12,14c1.1,0,2-0.9,2-2 s-0.9-2-2-2s-2,0.9-2,2S10.9,14,12,14z M18,14c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S16.9,14,18,14z M6,20c1.1,0,2-0.9,2-2s-0.9-2-2-2 s-2,0.9-2,2S4.9,20,6,20z M12,20c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,20,12,20z M18,20c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2 S16.9,20,18,20z" />
            </svg>
          </button>

          {preferences.darkTheme ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-indigo-500/20 uppercase">
              GS
            </div>
          ) : (
            <button className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 hover:shadow-md transition-all cursor-pointer">
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-12 px-6">
        
        {/* Dynamic Glowing Logo Header layout */}
        <div className="mb-10 text-center select-none">
          {preferences.darkTheme ? (
            <h1 className="text-[92px] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30">
              AURA
            </h1>
          ) : (
            <div className="flex items-center space-x-1 tracking-tighter font-sans font-medium text-7xl md:text-8xl">
              <span className="text-blue-500 scale-102 inline-block">G</span>
              <span className="text-red-500 scale-98 inline-block">o</span>
              <span className="text-yellow-500 scale-100 inline-block">o</span>
              <span className="text-blue-500 scale-102 inline-block">g</span>
              <span className="text-green-500 scale-98 inline-block">l</span>
              <span className="text-red-500 scale-100 inline-block">e</span>
            </div>
          )}
          
          {preferences.darkTheme ? (
            <p className="text-indigo-400 text-xs tracking-[0.3em] font-bold uppercase mt-2 opacity-80 italic">Quantum Neural Index</p>
          ) : (
            <span className="text-xs text-blue-500 font-bold self-center bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-2">Search Engine Clone</span>
          )}
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="w-full max-w-[620px] mb-8">
          <div className="relative group">
            {/* Elegant dark focus visualizer glow config */}
            <div className={`flex items-center w-full px-5 py-3.5 rounded-full border transition-all duration-300 
              ${preferences.darkTheme 
                ? "bg-[#111111] border-white/10 focus-within:border-indigo-500/50 focus-within:bg-[#141414] focus-within:shadow-indigo-500/10 focus-within:ring-4 focus-within:ring-indigo-500/15"
                : "bg-white border-gray-200 focus-within:bg-white focus-within:border-transparent focus-within:ring-4 focus-within:ring-[#f1f3f4] group-hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]"
              }`}
            >
              <Search className="w-5 h-5 mr-3 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={preferences.darkTheme ? "Explore the digital void..." : "Search Google or type a URL..."}
                className={`w-full bg-transparent border-none outline-none text-base font-light ${
                  preferences.darkTheme ? "text-white placeholder-neutral-600" : "text-gray-900 placeholder-gray-400"
                }`}
              />
              
              <div className="flex items-center space-x-3.5 ml-2 text-neutral-500">
                {query && (
                  <button 
                    type="button" 
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full hover:bg-white/5 cursor-pointer text-neutral-400"
                  >
                    <X size={17} />
                  </button>
                )}
                
                {/* Voice search button */}
                <button
                  type="button"
                  onClick={handleStartVoice}
                  title="Search by voice"
                  className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  <Mic size={18} />
                </button>

                {/* Camera Google Lens option */}
                <button
                  type="button"
                  onClick={() => setIsLensActive(true)}
                  title="Search by image (Google Lens)"
                  className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Buttons Action Bar */}
        <div className="flex gap-4 mt-2 mb-10">
          <button
            onClick={() => onSearch(query.trim() || "Google Search Clone")}
            className={`px-6 py-2 rounded text-sm transition-all font-medium cursor-pointer border ${
              preferences.darkTheme 
                ? "bg-[#1a1a1a] hover:bg-[#252525] border-white/5 text-neutral-300" 
                : "bg-[#f8f9fa] border-gray-100 hover:bg-[#ebeeee] text-gray-800 shadow-sm"
            }`}
          >
            {preferences.darkTheme ? "Search Aura" : "Google Search"}
          </button>
          <button
            onClick={handleFeelingLucky}
            className={`px-6 py-2 rounded text-sm transition-all font-medium cursor-pointer border ${
              preferences.darkTheme 
                ? "bg-[#1a1a1a] hover:bg-[#252525] border-white/5 text-slate-350" 
                : "bg-[#f8f9fa] border-gray-100 hover:bg-[#ebeeee] text-gray-800 shadow-sm"
            }`}
          >
            {preferences.darkTheme ? "I'm Feeling Synchronized" : "I'm Feeling Lucky"}
          </button>
        </div>

        {/* Languages Offered */}
        <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-12">
          <span>Search interface dynamically index in:</span>
          <button onClick={() => selectLanguage("en")} className={`hover:underline cursor-pointer ${preferences.language === "en" ? "text-indigo-400 font-bold" : "text-neutral-400"}`}>English</button>
          <span>•</span>
          <button onClick={() => selectLanguage("es")} className={`hover:underline cursor-pointer ${preferences.language === "es" ? "text-indigo-400 font-bold" : "text-neutral-400"}`}>Español</button>
          <span>•</span>
          <button onClick={() => selectLanguage("de")} className={`hover:underline cursor-pointer ${preferences.language === "de" ? "text-indigo-400 font-bold" : "text-neutral-400"}`}>Deutsch</button>
        </div>

        {/* Dynamic Personal Shortcuts */}
        <div className="flex mt-8 gap-10">
          {SHORTCUTS.slice(0, 3).map((sc, i) => (
            <div
              key={i}
              onClick={() => window.open(sc.url, "_blank")}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                preferences.darkTheme 
                  ? "bg-[#111111] border-white/5 group-hover:border-indigo-500/50" 
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}>
                <span className={`text-xl font-bold ${
                  preferences.darkTheme 
                    ? i === 0 ? "text-indigo-500" : i === 1 ? "text-rose-500" : "text-emerald-500"
                    : "text-blue-500"
                }`}>
                  {i === 0 ? "X" : i === 1 ? "Δ" : "Φ"}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
                {i === 0 ? "Nexus" : i === 1 ? "Lab" : "Node"}
              </span>
            </div>
          ))}
          
          <button className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-dashed ${
              preferences.darkTheme 
                ? "bg-[#111111] border-white/10 group-hover:border-indigo-500/50" 
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}>
              <Plus size={16} className={preferences.darkTheme ? "text-neutral-500" : "text-gray-400"} />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Add</span>
          </button>
        </div>

      </main>

      {/* Footer Element */}
      <footer className={`${
        preferences.darkTheme ? "bg-[#080808] border-t border-white/5" : "bg-[#f2f2f2] border-t border-gray-200"
      } mt-auto`}>
        <div className={`px-8 py-3.5 text-xs text-neutral-500 border-b ${
          preferences.darkTheme ? "border-white/5" : "border-gray-250"
        }`}>
          United States {preferences.darkTheme && <span>• <span className="text-indigo-400/60">San Francisco Node</span></span>}
        </div>
        <div className="flex flex-wrap justify-between px-8 py-4 text-xs font-medium text-neutral-500">
          <div className="flex gap-6">
            <a href="https://about.google" target="_blank" rel="noreferrer" className="hover:text-neutral-300">About</a>
            <a href="https://ads.google.com" target="_blank" rel="noreferrer" className="hover:text-neutral-300">Advertising</a>
            <a href="https://business.google.com" target="_blank" rel="noreferrer" className="hover:text-neutral-300">Enterprise</a>
            <span className="text-indigo-400/40 hidden md:inline">Intelligence Agent Active</span>
          </div>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="https://policies.google.com/privacy" className="hover:text-neutral-300">Privacy</a>
            <a href="https://policies.google.com/terms" className="hover:text-neutral-300">Terms</a>
            <button onClick={() => setPreferences(p => ({ ...p, darkTheme: !p.darkTheme }))} className="hover:text-neutral-300 cursor-pointer">Settings</button>
          </div>
        </div>
      </footer>

      {/* AUDIO VOICE SEARCH MODAL OVERLAY */}
      <AnimatePresence>
        {isVoiceSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className={`rounded-2xl p-8 max-w-[420px] w-full mx-4 shadow-2xl flex flex-col items-center text-center border ${
                preferences.darkTheme 
                  ? "bg-[#0d0d0d] border-white/10 text-[#e0e0e0] shadow-indigo-500/5" 
                  : "bg-white text-gray-800 border-gray-100"
              }`}
            >
              <div className="w-full flex justify-end mb-1">
                <button
                  onClick={handleStopVoice}
                  className="p-1 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-6">Voice Grounding Search</span>

              <div className="flex items-end justify-center space-x-2 h-16 min-h-[64px] mb-8">
                {micVolume.map((vol, index) => (
                  <motion.div
                    key={index}
                    animate={{ height: `${vol}px` }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className={`w-2.5 rounded-full ${
                      index === 0 ? "bg-indigo-500 animate-pulse" :
                      index === 1 ? "bg-purple-500" :
                      index === 2 ? "bg-violet-500 animate-pulse" : "bg-blue-500"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xl font-normal text-gray-250 leading-relaxed mb-8 px-4 font-sans italic">
                "{voiceTranscript}"
              </p>

              <button
                onClick={handleStopVoice}
                className="px-6 py-2 bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-white font-medium text-xs rounded-full transition shadow-md cursor-pointer"
              >
                Cancel Listen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GOOGLE LENS / IMAGE UPLOAD FLOATING PANEL */}
      <AnimatePresence>
        {isLensActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 5 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 5 }}
              className={`rounded-2xl w-full max-w-[550px] mx-4 shadow-2xl border overflow-hidden ${
                preferences.darkTheme 
                  ? "bg-[#0d0d0d] border-white/10 text-neutral-300 shadow-indigo-500/5" 
                  : "bg-white text-gray-800 border-gray-150"
              }`}
            >
              <div className="flex items-center justify-between border-b px-6 py-4 border-white/5">
                <span className="text-sm font-medium flex items-center">
                  <Camera size={16} className="text-indigo-400 mr-2" />
                  Search any image via Quantum Grounding
                </span>
                <button
                  onClick={() => setIsLensActive(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="border-2 border-dashed border-white/5 rounded-xl p-8 flex flex-col items-center justify-center bg-[#111111]/60 text-center hover:bg-[#141414]/80 transition-colors duration-150 cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-115 transition-transform">
                    <Camera size={22} className="text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-250 mb-1">
                    Drag an image here or <span className="text-indigo-400 hover:underline">upload a file</span>
                  </p>
                  <p className="text-xs text-neutral-500">Supports PNG, JPG, GIF files up to 10MB</p>
                </div>

                <div className="mt-6">
                  <div className="text-4xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Try searching one of these:</div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        onSearch("Gemini API server code sample");
                        setIsLensActive(false);
                      }}
                      className="border border-white/5 rounded-lg p-2.5 flex flex-col items-center text-center bg-[#111111] hover:bg-[#191919] cursor-pointer transition"
                    >
                      <span className="text-lg">🤖</span>
                      <span className="text-4xs uppercase tracking-widest text-neutral-500 mt-1.5">Smart Robot</span>
                    </button>
                    <button
                      onClick={() => {
                        onSearch("Mount Everest travel itinerary facts");
                        setIsLensActive(false);
                      }}
                      className="border border-white/5 rounded-lg p-2.5 flex flex-col items-center text-center bg-[#111111] hover:bg-[#191919] cursor-pointer transition"
                    >
                      <span className="text-lg">🏔️</span>
                      <span className="text-4xs uppercase tracking-widest text-neutral-550 mt-1.5">Snow Peaks</span>
                    </button>
                    <button
                      onClick={() => {
                        onSearch("Historical facts Julius Caesar Rome");
                        setIsLensActive(false);
                      }}
                      className="border border-white/5 rounded-lg p-2.5 flex flex-col items-center text-center bg-[#111111] hover:bg-[#191919] cursor-pointer transition"
                    >
                      <span className="text-lg">🏺</span>
                      <span className="text-4xs uppercase tracking-widest text-neutral-550 mt-1.5">Roman Ruins</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111]/30 px-6 py-3.5 border-t border-white/5 flex justify-end text-3xs text-neutral-500">
                <span>Your uploaded photos will be analyzed securely under privacy terms.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
