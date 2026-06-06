/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sitelink {
  label: string;
  url: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  sitelinks?: Sitelink[];
}

export interface AccordionItem {
  question: string;
  answer: string;
  sourceUrl?: string;
}

export interface KnowledgePanelAttribute {
  label: string;
  value: string;
}

export interface KnowledgePanel {
  title: string;
  subtitle: string;
  description: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  attributes: KnowledgePanelAttribute[];
}

export interface SearchResponse {
  query: string;
  answer?: string; // For featured snippet
  answerSourceUrl?: string; // Link for the featured snippet source
  answerSourceTitle?: string;
  results: SearchResult[];
  peopleAlsoAsk: AccordionItem[];
  relatedSearches: string[];
  knowledgePanel?: KnowledgePanel | null;
  searchTime: number; // in seconds, e.g. 0.35s
  totalResultsCount?: number; // e.g., 2,450,000
}

export interface SearchPreferences {
  safeSearch: 'active' | 'off';
  region: string;
  language: string;
  darkTheme: boolean;
}
