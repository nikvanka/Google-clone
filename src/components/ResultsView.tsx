/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SearchResponse, SearchPreferences } from "../types";
import { ArrowRight, ChevronDown, ChevronUp, AlertTriangle, Key, ExternalLink } from "lucide-react";

interface ResultsViewProps {
  data: SearchResponse;
  isLoading: boolean;
  preferences: SearchPreferences;
  onSearch: (query: string) => void;
}

function getDomainAndBreadcrumb(urlStr: string) {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.replace("www.", "");
    const paths = url.pathname.split("/").filter(Boolean);
    const breadcrumb = [host, ...paths].slice(0, 3).join("  ›  ");
    return {
      domain: host,
      breadcrumb: breadcrumb || host,
      favicon: `https://www.google.com/s2/favicons?sz=64&domain=${host}`
    };
  } catch (e) {
    return {
      domain: "external",
      breadcrumb: "web link",
      favicon: ""
    };
  }
}

export default function ResultsView({ data, isLoading, preferences, onSearch }: ResultsViewProps) {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isSimulated = !(data as any).isApiKeyConfigured;

  return (
    <div className={`w-full min-h-screen transition-colors duration-200 ${
      preferences.darkTheme ? "bg-[#050505] text-[#e0e0e0]" : "bg-white text-gray-800"
    }`}>
      
      {/* 1. Results Stats and Alerts Info */}
      <div className={`px-4 md:px-[164px] py-4 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 border-b ${
        preferences.darkTheme 
          ? "text-neutral-500 border-white/5" 
          : "text-gray-500 border-gray-100"
      }`}>
        <span>
          About {data.totalResultsCount?.toLocaleString() || "143,000"} results ({data.searchTime.toFixed(2)} seconds)
          {preferences.darkTheme && <span className="text-indigo-400/60 ml-1.5">• Aura Quantum Index Online</span>}
        </span>
        
        {/* API Warning if simulated */}
        {isSimulated && (
          <div className={`flex items-center space-x-1.5 font-bold tracking-wide uppercase text-[10px] ${
            preferences.darkTheme ? "text-indigo-400/80" : "text-amber-600"
          }`}>
            <AlertTriangle size={13} className="text-indigo-400" />
            <span>High-Fidelity Simulator Active</span>
          </div>
        )}
      </div>

      {/* 2. Main Dual Column Grid Container (Results Left, Knowledge Panel Right) */}
      <div className="px-4 md:px-[164px] py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14">
        
        {/* Left Hand: Main Results Column */}
        <div className="lg:col-span-7 space-y-10 max-w-[652px]">
          
          {/* Key Setup Help Banner */}
          {isSimulated && (
            <div className={`border p-5 rounded-2xl flex items-start space-x-3.5 text-xs leading-relaxed transition-all ${
              preferences.darkTheme 
                ? "bg-[#111111]/45 border-white/5 text-neutral-300" 
                : "bg-amber-50/50 border-amber-200 text-gray-700 font-sans"
            }`}>
              <Key className={`${preferences.darkTheme ? "text-indigo-400" : "text-amber-500"} shrink-0 mt-0.5`} size={17} />
              <div>
                <p className={`font-bold mb-1 ${preferences.darkTheme ? "text-white" : "text-gray-900"}`}>
                  Unlock Real-Time Grounded Web Search
                </p>
                <p className="mb-2 text-2xs text-neutral-450">Currently showing simulated responses. To connect real-time live Google Search results powered by Gemini, insert your <strong className={`${preferences.darkTheme ? "text-indigo-400" : "text-gray-900"} font-semibold`}>GEMINI_API_KEY</strong> inside the <strong className="font-semibold">Settings &gt; Secrets</strong> menu in the AI Studio sidebar panel.</p>
                <a 
                  href="https://ai.studio" 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`font-semibold flex items-center hover:underline ${
                    preferences.darkTheme ? "text-indigo-400" : "text-blue-600"
                  }`}
                >
                  Get a Free Gemini Developer Key <ExternalLink size={11} className="ml-1" />
                </a>
              </div>
            </div>
          )}

          {/* Featured Snippet Section */}
          {data.answer && (
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${
              preferences.darkTheme 
                ? "bg-[#0d0d0d] border-white/5 hover:border-indigo-500/30 shadow-2xl shadow-indigo-500/5" 
                : "bg-gray-50/75 border-gray-200"
            }`}>
              <div className="text-[10px] uppercase tracking-widest mb-3.5 font-bold flex items-center gap-2 select-none">
                <span className={`w-2 h-2 rounded-full ${preferences.darkTheme ? "bg-indigo-500 animate-pulse" : "bg-blue-500"}`}></span>
                <span className={preferences.darkTheme ? "text-indigo-400" : "text-gray-500"}>Featured Snippet Answer</span>
              </div>

              {/* Snippet parsed summary text */}
              <div className={`text-base leading-relaxed mb-4 ${
                preferences.darkTheme ? "text-[#e0e0e0] font-light" : "text-gray-900"
              }`}>
                <p className="whitespace-pre-line">{data.answer}</p>
              </div>

              {/* Source Link details */}
              {data.answerSourceUrl && (
                <div className={`border-t pt-4 ${preferences.darkTheme ? "border-white/5" : "border-gray-200/50"}`}>
                  <a 
                    href={data.answerSourceUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group"
                  >
                    <div className="flex items-center space-x-2 text-2xs mb-1.5 text-neutral-450">
                      {getDomainAndBreadcrumb(data.answerSourceUrl).favicon && (
                        <img 
                          src={getDomainAndBreadcrumb(data.answerSourceUrl).favicon} 
                          alt="source icon" 
                          className="w-4 h-4 rounded bg-white shadow-sm"
                          onError={(e) => { (e.target as any).style.display = 'none'; }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="truncate max-w-[400px]">
                        {getDomainAndBreadcrumb(data.answerSourceUrl).breadcrumb}
                      </span>
                    </div>
                    <div className={`text-base font-semibold group-hover:underline transition-all ${
                      preferences.darkTheme ? "text-indigo-400 group-hover:text-indigo-300" : "text-blue-600"
                    }`}>
                      {data.answerSourceTitle || "Read more about this source"}
                    </div>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* People Also Ask Accordion */}
          {data.peopleAlsoAsk && data.peopleAlsoAsk.length > 0 && (
            <div className="space-y-4">
              <h2 className={`text-sm tracking-wider uppercase font-semibold pb-2 border-b ${
                preferences.darkTheme ? "text-neutral-400 border-white/5" : "text-gray-900 border-gray-150"
              }`}>
                People also ask
              </h2>
              
              <div className={`divide-y ${preferences.darkTheme ? "divide-white/5" : "divide-gray-150"}`}>
                {data.peopleAlsoAsk.map((item, idx) => {
                  const isOpen = openAccordions.includes(idx);
                  return (
                    <div key={idx} className="py-3.5">
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className={`w-full flex items-center justify-between text-left font-medium text-xs py-1 cursor-pointer select-none transition-colors ${
                          preferences.darkTheme 
                            ? "text-neutral-200 hover:text-indigo-400" 
                            : "text-gray-850 hover:text-blue-600"
                        }`}
                      >
                        <span>{item.question}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isOpen && (
                        <div className={`mt-3 text-2xs leading-relaxed pl-3.5 border-l-2 py-1 pt-2 space-y-3 font-sans ${
                          preferences.darkTheme 
                            ? "text-neutral-400 border-indigo-500/50 bg-[#111111]/30" 
                            : "text-gray-700 border-blue-500 bg-gray-50/30"
                        }`}>
                          <p>{item.answer}</p>
                          {item.sourceUrl && (
                            <div className="pt-1.5 text-3xs text-neutral-500">
                              <span>Source Context: </span>
                              <a 
                                href={item.sourceUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={`hover:underline font-bold ${
                                  preferences.darkTheme ? "text-indigo-400" : "text-blue-600"
                                }`}
                              >
                                {getDomainAndBreadcrumb(item.sourceUrl).domain}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Core Web Results List */}
          <div className="space-y-9">
            {data.results.map((result, idx) => {
              const { breadcrumb, favicon } = getDomainAndBreadcrumb(result.url);
              return (
                <div key={idx} className="group min-h-[50px] flex flex-col items-start leading-normal">
                  
                  {/* Category Pathing & Favicon */}
                  <div className="flex items-center space-x-2.5 text-2xs mb-1.5 text-neutral-500 select-none">
                    <div className={`w-5.5 h-5.5 flex items-center justify-center rounded-full border ${
                      preferences.darkTheme 
                        ? "bg-[#111111] border-white/5" 
                        : "bg-gray-50 border-gray-150"
                    }`}>
                      {favicon ? (
                        <img 
                          src={favicon} 
                          alt="icon" 
                          className="w-3.5 h-3.5 rounded-sm bg-white" 
                          onError={(e) => { (e.target as any).src = "https://www.google.com/favicon.ico"; }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-[9px]">🔗</span>
                      )}
                    </div>
                    <span className="truncate font-mono tracking-wide max-w-[280px] sm:max-w-[450px]">
                      {breadcrumb}
                    </span>
                  </div>

                  {/* Main Link Header */}
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block"
                  >
                    <h3 className={`text-base font-semibold group-hover:underline transition-colors leading-snug ${
                      preferences.darkTheme 
                        ? "text-indigo-400 group-hover:text-indigo-350" 
                        : "text-blue-800"
                    }`}>
                      {result.title}
                    </h3>
                  </a>

                  {/* Snippet Content */}
                  <p className={`text-2xs mt-1.5 leading-relaxed tracking-wider font-light ${
                    preferences.darkTheme ? "text-neutral-400" : "text-gray-650"
                  }`}>
                    {result.snippet}
                  </p>

                  {/* Sitelinks Box */}
                  {result.sitelinks && result.sitelinks.length > 0 && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 mt-4.5 ml-4 pl-4 border-l-2 ${
                      preferences.darkTheme ? "border-indigo-500/20" : "border-slate-100"
                    }`}>
                      {result.sitelinks.map((link, j) => (
                        <div key={j} className="text-2xs">
                          <a 
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`hover:underline font-bold block mb-0.5 ${
                              preferences.darkTheme ? "text-indigo-400/95" : "text-blue-700"
                            }`}
                          >
                            {link.label}
                          </a>
                          <span className="text-3xs text-neutral-500 leading-none">Access search indexing cluster category resources securely.</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Related Searches Pills Section */}
          <div className={`pt-8 border-t ${preferences.darkTheme ? "border-white/5" : "border-gray-150"}`}>
            <h2 className={`text-sm tracking-wider uppercase font-semibold mb-4 ${
              preferences.darkTheme ? "text-neutral-400" : "text-gray-850"
            }`}>
              Related searches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => onSearch(term)}
                  className={`px-5 py-3.5 rounded-full text-xs text-left font-semibold cursor-pointer border hover:-translate-y-0.5 active:translate-y-0 transition-all ${
                    preferences.darkTheme 
                      ? "bg-[#111111] border-white/5 hover:bg-[#191919] hover:border-indigo-500/20 text-neutral-300" 
                      : "bg-[#f1f3f4] border-gray-100 hover:bg-[#ebeeee] text-gray-800 shadow-2xs"
                  }`}
                >
                  <span className={preferences.darkTheme ? "text-indigo-455 mr-1" : "mr-1"}>🔍</span> {term}
                </button>
              ))}
            </div>
          </div>

          {/* Premium "Aura" and "Google" styled hybrid runner */}
          <div className="py-14 flex flex-col items-center select-none">
            {preferences.darkTheme ? (
              <div className="flex items-center space-x-1.5 mb-2.5 font-bold tracking-[0.25em] text-sm text-neutral-500 uppercase">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">Aura Global Runner</span>
              </div>
            ) : (
              <div className="flex items-center space-x-0.5 text-2xl font-bold mb-2">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </div>
            )}
            <div className={`flex items-center space-x-4 text-xs font-semibold ${
              preferences.darkTheme ? "text-indigo-400" : "text-blue-600"
            }`}>
              <button onClick={() => onSearch(data.query)} className={`hover:underline cursor-pointer font-extrabold px-3 py-1 rounded ${
                preferences.darkTheme ? "bg-indigo-500/10 text-indigo-400" : "bg-blue-50"
              }`}>1</button>
              <button onClick={() => onSearch(`${data.query} review`)} className="hover:underline cursor-pointer">2</button>
              <button onClick={() => onSearch(`${data.query} wiki`)} className="hover:underline cursor-pointer">3</button>
              <button onClick={() => onSearch(`${data.query} news`)} className="hover:underline cursor-pointer">4</button>
              <button onClick={() => onSearch(data.query)} className="text-neutral-500 flex items-center gap-1 hover:text-neutral-300">
                Next <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

        {/* Right Hand Sidebar: Knowledge Panel Panel */}
        <div className="lg:col-span-5 shrink-0">
          {data.knowledgePanel ? (
            <div className={`rounded-2xl border p-5 sticky top-28 transition-all ${
              preferences.darkTheme 
                ? "bg-[#0c0c0c] border-white/5 text-neutral-300 shadow-2xl shadow-indigo-500/5 hover:border-indigo-500/20" 
                : "bg-white border-gray-200 text-gray-850 shadow-sm"
            }`}>
              
              {/* Title Header */}
              <div className={`pb-3.5 border-b flex items-start justify-between ${
                preferences.darkTheme ? "border-white/5" : "border-gray-100"
              }`}>
                <div>
                  <h2 className={`text-base font-bold leading-tight ${preferences.darkTheme ? "text-white" : "text-gray-900"}`}>
                    {data.knowledgePanel.title}
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#6366f1] mt-1 opacity-80 leading-none">
                    {data.knowledgePanel.subtitle}
                  </p>
                </div>
                {data.knowledgePanel.sourceUrl && (
                  <a 
                    href={data.knowledgePanel.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                      preferences.darkTheme ? "hover:bg-white/5 text-neutral-400 hover:text-indigo-400" : "hover:bg-gray-150 text-gray-400 hover:text-blue-500"
                    }`}
                    title="Read Wiki Page"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {/* Wikipedia summary statement */}
              <p className={`text-2xs leading-relaxed mt-4 font-light ${
                preferences.darkTheme ? "text-neutral-300" : "text-gray-700"
              }`}>
                {data.knowledgePanel.description}
              </p>
              
              <div className="mt-2 text-3xs text-neutral-500">
                Source Document: <a href={data.knowledgePanel.sourceUrl} target="_blank" rel="noreferrer" className={`underline ${
                  preferences.darkTheme ? "text-indigo-400/80 hover:text-indigo-300" : "text-blue-600"
                }`}>{data.knowledgePanel.source}</a>
              </div>

              {/* Key Value Attributes list */}
              <div className={`mt-5 pt-4 space-y-3 border-t ${preferences.darkTheme ? "border-white/5" : "border-gray-100"}`}>
                {data.knowledgePanel.attributes.map((attr, index) => (
                  <div key={index} className="text-2xs grid grid-cols-3 gap-1">
                    <span className="font-extrabold text-indigo-400/60 uppercase tracking-widest text-[9px] block self-start">
                      {attr.label}
                    </span>
                    <span className={`col-span-2 ${preferences.darkTheme ? "text-neutral-200" : "text-gray-800"}`}>
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feedbacks */}
              <div className={`mt-6 pt-3 flex items-center justify-between text-3xs border-t ${
                preferences.darkTheme ? "border-white/5 text-neutral-500" : "border-gray-100 text-gray-400"
              }`}>
                <span>Claimed profile data verified</span>
                <button className="hover:underline">Feedback</button>
              </div>

            </div>
          ) : (
            // Sidebar helper banner in desktop layout
            <div className={`hidden lg:block border border-dashed p-6 rounded-2xl text-center select-none ${
              preferences.darkTheme ? "border-white/5 bg-[#0c0c0c]/40 text-neutral-500" : "border-gray-200 text-gray-400"
            }`}>
              <p className="text-2xs font-bold uppercase tracking-widest mb-1 text-neutral-500">Aura Graph Node</p>
              <p className="text-3xs text-neutral-500 leading-relaxed max-w-sm mx-auto">Query a major corporation, library platform, historical figure (e.g. "Google", "Julius Caesar") to populate full information attributes safely.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
