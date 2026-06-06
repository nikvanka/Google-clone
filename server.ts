/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid startup crashes if key is initially absent
let ai: GoogleGenAI | null = null;
const isApiKeyPresent = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

if (isApiKeyPresent) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized Gemini GenAI SDK on the search backend.");
  } catch (err) {
    console.error("Warning: Error occurred during Gemini initialization:", err);
  }
} else {
  console.log("No GEMINI_API_KEY configured yet. Running search clone in High-Fidelity Simulator mode.");
}

// -------------------------------------------------------------
// HELPER: Simulated Dynamic Search Result Generator (High-Fidelity Fallback)
// -------------------------------------------------------------
function generateSimulatedResults(q: string): any {
  const query = q.trim();
  const normalizedQuery = query.toLowerCase();

  // Create customized detailed results for specific well-known tech topics
  if (normalizedQuery.includes("react")) {
    return {
      query,
      answer: "React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.",
      answerSourceUrl: "https://react.dev",
      answerSourceTitle: "React – Official Site",
      results: [
        {
          title: "React – Build once, write anywhere",
          url: "https://react.dev",
          snippet: "React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.",
          sitelinks: [
            { label: "Documentation", url: "https://react.dev/reference/react" },
            { label: "Getting Started", url: "https://react.dev/learn" },
            { label: "Hooks API", url: "https://react.dev/reference/react/hooks" },
            { label: "Blogs", url: "https://react.dev/blog" }
          ]
        },
        {
          title: "React (software) - Wikipedia",
          url: "https://en.wikipedia.org/wiki/React_(software)",
          snippet: "React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components."
        },
        {
          title: "Getting Started with React – MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started",
          snippet: "In this article we'll say hello to React. We'll discover some of the background detail about where React came from, its core principles, and write our first React app."
        },
        {
          title: "facebook/react: A declarative, efficient, and flexible JavaScript library...",
          url: "https://github.com/facebook/react",
          snippet: "React is a JavaScript library for building user interfaces. It is declarative: React makes it painless to create interactive UIs. Design simple views for each state."
        },
        {
          title: "React Course - Beginner's Tutorial for 2026",
          url: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          snippet: "Learn React from scratch in this comprehensive tutorial course. Go from zero knowledge to a fully functioning frontend engineer building production applications."
        }
      ],
      peopleAlsoAsk: [
        {
          question: "Is React difficult to learn?",
          answer: "React has a moderate learning curve. If you already have a solid foundation in HTML, CSS, and basic JavaScript (specifically ES6 features like arrow tasks, destructuring, and array methods), learning React is relatively straightforward. Its logical component structure makes building applications intuitive once the basics of props, state, and hooks are mastered.",
          sourceUrl: "https://react.dev/learn"
        },
        {
          question: "Who uses React in production?",
          answer: "React is widely considered the industry standard for web clients. It is used as the frontend engine by major tech giants including Meta, Netflix, Airbnb, Uber, Pinterest, Twitter, Reddit, and thousands of other modern full-stack businesses.",
          sourceUrl: "https://react.dev/community"
        },
        {
          question: "What is React 19's main feature?",
          answer: "React 19 introduces native support for Async Actions, useActions hooks, Server Components as a standard pattern, automatic resource preloading, asset loading optimizations, and better error reporting for server-side hydration mismatches.",
          sourceUrl: "https://react.dev/blog/2024/12/05/react-19"
        }
      ],
      relatedSearches: [
        "react documentation",
        "react architecture guide",
        "react learning roadmap 2026",
        "react components library",
        "vite react framework tutorial",
        "tailwind style in react"
      ],
      knowledgePanel: {
        title: "React",
        subtitle: "Software Library",
        description: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. Originally created by Jordan Walke, a software engineer at Facebook, it was open-sourced in 2013 and has since become one of the most widely adopted front-end web frameworks in existence.",
        source: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/React_(software)",
        attributes: [
          { label: "Original author", value: "Jordan Walke" },
          { label: "Developer", value: "Meta and community" },
          { label: "Initial release", value: "May 29, 2013; 13 years ago" },
          { label: "Written in", value: "JavaScript, TypeScript" },
          { label: "License", value: "MIT License" }
        ],
        imageUrl: ""
      },
      searchTime: 0.12,
      totalResultsCount: 312000000
    };
  }

  if (normalizedQuery.includes("google") && !normalizedQuery.includes("clone")) {
    return {
      query,
      answer: "Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.",
      answerSourceUrl: "https://www.google.com",
      answerSourceTitle: "Google LLC",
      results: [
        {
          title: "Google",
          url: "https://www.google.com",
          snippet: "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.",
          sitelinks: [
            { label: "About Google", url: "https://about.google/" },
            { label: "Google Careers", url: "https://careers.google.com/" },
            { label: "Google Store", url: "https://store.google.com/" },
            { label: "Google Blog", url: "https://blog.google/" }
          ]
        },
        {
          title: "Google - Wikipedia",
          url: "https://en.wikipedia.org/wiki/Google",
          snippet: "Google LLC is an American multinational technology company. It was founded on September 4, 1998, by American computer scientists Larry Page and Sergey Brin while they were PhD students."
        },
        {
          title: "Google Services & Products Directory",
          url: "https://about.google/products/",
          snippet: "Explore a helpful list of all products, services, hardware and technologies developed by Google, ranging from Gmail, Android and YouTube, to Google Lens and Google Cloud."
        },
        {
          title: "Google Official Blog - News, Stories & Announcements",
          url: "https://blog.google/",
          snippet: "Get the latest official news, company announcements, feature updates, and product launches directly from the source inside Google's corporate communications team."
        }
      ],
      peopleAlsoAsk: [
        {
          question: "Who originally founded Google?",
          answer: "Google was founded in September 1998 by Larry Page and Sergey Brin while they were PhD students at Stanford University in California. Together they own about 14 percent of its publicly listed shares and control 56 percent of the stockholder voting power through supervoting stock.",
          sourceUrl: "https://en.wikipedia.org/wiki/Google"
        },
        {
          question: "What is Google's parent company?",
          answer: "Alphabet Inc. is Google's parent company, founded on October 2, 2015, during a high-profile corporate restructuring designed to make the company's core operations cleaner and more accountable while giving non-search ventures independent leadership.",
          sourceUrl: "https://abc.xyz"
        }
      ],
      relatedSearches: [
        "google history timeline",
        "alphabet company structure",
        "google stock news",
        "larry page and sergey brin",
        "google search how it works"
      ],
      knowledgePanel: {
        title: "Google",
        subtitle: "Technology Company",
        description: "Google LLC is an American technology conglomerate that specializes in internet-related services. These include search engines, ads, cloud architectures, hardware products, operating systems, and various digital platforms like YouTube, Chrome, and Android.",
        source: "Wikipedia",
        sourceUrl: "https://en.wikipedia.org/wiki/Google",
        attributes: [
          { label: "Founders", value: "Larry Page, Sergey Brin" },
          { label: "Founded", value: "September 4, 1998, Menlo Park, CA" },
          { label: "Headquarters", value: "Googleplex, Mountain View, CA" },
          { label: "Parent", value: "Alphabet Inc." },
          { label: "CEO", value: "Sundar Pichai (Dec 2015–Present)" }
        ],
        imageUrl: ""
      },
      searchTime: 0.08,
      totalResultsCount: 22400000000
    };
  }

  // A general high-quality mock SERP for any random queries
  return {
    query,
    answer: `Search simulation results for '**${query}**'. Providing a clean layout with fast keyword parsing. If you want actual real-time Google search results, you can configure your **GEMINI_API_KEY** secret inside Google AI Studio.`,
    answerSourceUrl: "https://ai.studio",
    answerSourceTitle: "Google AI Studio Developer Panel",
    results: [
      {
        title: `What is the significance of ${query}? - Complete Guide`,
        url: `https://www.example-encyclopedia.org/wiki/${encodeURIComponent(query)}`,
        snippet: `Explore the historical context, modern relevance, definitions, and theories relating to ${query}. Read expert analysis on how it is shaping the future of industrial developments in 2026.`,
        sitelinks: [
          { label: `Overview of ${query}`, url: "#" },
          { label: "Recent Practical Cases", url: "#" },
          { label: "Critique and Future Scope", url: "#" }
        ]
      },
      {
        title: `Official Resources and Information on ${query}`,
        url: `https://www.official-${normalizedQuery.replace(/[^a-z0-9]/g, "")}.org`,
        snippet: `Access verified data files, system instructions, documentation, downloadable content, support channels, and FAQs specifically designed for individuals studying ${query}.`
      },
      {
        title: `Recent News, Discoveries and Innovation relating to ${query}`,
        url: `https://technews-weekly.com/articles/the-importance-of-${encodeURIComponent(normalizedQuery)}`,
        snippet: `Reports are coming in showing major developments regarding ${query}. Industry figures are highlighting a massive rise in search volumes and technological applications starting this year.`
      },
      {
        title: `How to get started with ${query}: Step-by-Step Tutorial`,
        url: `https://learn-anything-hub.com/courses/${normalizedQuery.replace(/[^a-z0-9]/g, "-")}`,
        snippet: `A free complete training module on ${query}. Learn key setup tips, architectural secrets, design guidelines, and optimize your overall configuration from absolute scratch.`
      },
      {
        title: `The Ultimate Discussion Forums: Talk about ${query}`,
        url: `https://community-forums.net/t/${normalizedQuery.replace(/[^a-z0-9]/g, "-")}`,
        snippet: `Read threads and posts from community-oriented researchers. Engage in discussions, browse user queries, check common pitfalls, and share tips about ${query}.`
      }
    ],
    peopleAlsoAsk: [
      {
        question: `How does ${query} work under the hood?`,
        answer: `At an architectural level, ${query} relies on processing structured instructions, patterns, or contextual frameworks. By analyzing the input constraints and routing information to dynamic processing units, it achieves fast, optimized feedback and maintains performance overheads.`,
        sourceUrl: "#"
      },
      {
        question: `What are the typical use cases of ${query}?`,
        answer: `${query} is widely applicable across academic, commercial, and technical disciplines. It resolves common pain points like data ambiguity, system scaling limitations, and general information retrieval bottlenecks in local environments.`,
        sourceUrl: "#"
      }
    ],
    relatedSearches: [
      `${query} examples`,
      `${query} beginners tips`,
      `why is ${query} popular`,
      `latest research paper on ${query}`,
      `alternative solutions to ${query}`,
      `${query} tutorial free`
    ],
    knowledgePanel: {
      title: query.charAt(0).toUpperCase() + query.slice(1),
      subtitle: "Universal Subject Query",
      description: `The query '${query}' represents a subject, entity, or search target within our dynamic browser interface. This simulated profile is powered by the server's high-speed contextual routing engine.`,
      source: "Search Knowledge Graph",
      sourceUrl: "#",
      attributes: [
        { label: "Categorization", value: "Dynamic Search Term" },
        { label: "Search Relevance", value: "High Priority" },
        { label: "Context Match", value: "Matched in 0.05 seconds" },
        { label: "Index Status", value: "Fully Crawled" }
      ]
    },
    searchTime: 0.05,
    totalResultsCount: Math.floor(Math.random() * 8500000) + 120000
  };
}

// -------------------------------------------------------------
// MAIN API ENDPOINTS
// -------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    isApiKeyConfigured: isApiKeyPresent,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/search", async (req, res) => {
  const { q, safeSearch = 'active' } = req.body;
  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Missing required 'q' search query parameter." });
    return;
  }

  const queryTimeStart = Date.now();
  console.log(`Processing search query q="${q}" [SafeSearch: ${safeSearch}]`);

  // Simple hardcoded safety check for clearly offensive or dangerous terms
  const lowerQuery = q.toLowerCase();
  if (safeSearch === 'active' && (lowerQuery.includes("brutality") || lowerQuery.includes("hacks") || lowerQuery.includes("exploit"))) {
    res.json({
      query: q,
      answer: "This results entry was hidden because your SafeSearch setting is turned on. To view these queries, you can switch SafeSearch to 'off' in the Settings Menu.",
      results: [
        {
          title: "SafeSearch Filter Active - Result Unavailable",
          url: "https://support.google.com/websearch/answer/510",
          snippet: "This search term matches filters configured under SafeSearch guidelines. You can toggle SafeSearch limits inside our top-right Settings dropdown."
        }
      ],
      peopleAlsoAsk: [
        {
          question: "How do I turn off SafeSearch?",
          answer: "Click the gear (settings) icon in the top right of the Google Search Clone screen, and toggle the 'SafeSearch' checkbox to active or inactive."
        }
      ],
      relatedSearches: ["google search settings", "safesearch filters"],
      searchTime: 0.02,
      totalResultsCount: 1,
      isApiKeyConfigured: isApiKeyPresent
    });
    return;
  }

  // 1. FALLBACK MODE: If no API key is PRESENT, use the high-fidelity simulator
  if (!ai) {
    const response = generateSimulatedResults(q);
    response.isApiKeyConfigured = false;
    res.json(response);
    return;
  }

  // 2. LIVE GROUNDED GEMINI SEARCH MODE
  try {
    const prompt = `
Query: "${q}"
You are generating a complete search engine results payload for a Google Search engine clone. 
A web ground search is active. Using your Google Search Grounding tool outputs as context, respond with a meticulously formed JSON object of the search results for the user query. Make sure the results look indistinguishable from real, professional search engine listings, containing URLs, page titles, informative descriptive snippets, and sitelinks where appropriate.

Provide a complete response strictly in JSON format. Do not prepend markdown formatting identifiers unless required by the response format. Your JSON output must match exactly the following structure:

{
  "query": "the original search query text",
  "answer": "A clear, concise, direct response summarizing the answer (1-3 lines in clean markdown text, no headings, bolding is ok) representing a Google 'Featured Snippet' block. If the query is an open query that has no single factual resolution (e.g. 'wikipedia' or 'best movies'), leave this field empty.",
  "answerSourceUrl": "The URL of the page that contains or confirms the featured snippet answer",
  "answerSourceTitle": "The simple title/name of the website for the featured snippet",
  "results": [
    {
      "title": "A highly descriptive, realistic clickable page title",
      "url": "A real, authentic complete URL matching this result from search facts",
      "snippet": "An elegant, descriptive meta description snippet explaining the content of this webpage.",
      "sitelinks": [
        { "label": "Sublink Title (e.g. Documentation, Pricing, Sign-in)", "url": "URL for the sublink" }
      ] // Include 3-4 sitelinks ONLY for the first 1-2 prominent results in the list if applicable, others can omit it.
    }
  ],
  "peopleAlsoAsk": [
    {
      "question": "A typical follow-up question related to this search terms",
      "answer": "A neat, detailed paragraph (2-4 sentences) that clearly resolves this specific question.",
      "sourceUrl": "Source link for the question text"
    }
  ],
  "relatedSearches": [
    "search suggestion phrase 1",
    "search suggestion phrase 2"
  ],
  "knowledgePanel": {
    "title": "Name of the prominent entity, person, or organization if applicable (otherwise leave knowledgePanel out or make it null)",
    "subtitle": "Short description category, e.g. American entrepreneur, Programming language",
    "description": "An introductory overview summarizing who or what this entity is (Wikipedia style).",
    "source": "Wikipedia",
    "sourceUrl": "URL pointing to the source article page",
    "imageUrl": "Leave empty or provide a public URL of a clean image",
    "attributes": [
      { "label": "Key label 1", "value": "Value 1" },
      { "label": "Key label 2", "value": "Value 2" }
    ]
  },
  "totalResultsCount": 2450000
}

Respond ONLY with the raw JSON string matching the instructions.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING },
            answer: { type: Type.STRING },
            answerSourceUrl: { type: Type.STRING },
            answerSourceTitle: { type: Type.STRING },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  sitelinks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        url: { type: Type.STRING }
                      },
                      required: ["label", "url"]
                    }
                  }
                },
                required: ["title", "url", "snippet"]
              }
            },
            peopleAlsoAsk: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            relatedSearches: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            knowledgePanel: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                description: { type: Type.STRING },
                source: { type: Type.STRING },
                sourceUrl: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                attributes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                }
              },
              required: ["title", "subtitle", "description", "source", "sourceUrl", "attributes"]
            },
            totalResultsCount: { type: Type.INTEGER }
          },
          required: ["query", "results", "peopleAlsoAsk", "relatedSearches", "totalResultsCount"]
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty text response from Gemini API.");
    }

    const parsedData = JSON.parse(textResponse.trim());
    parsedData.searchTime = ((Date.now() - queryTimeStart) / 1000);
    parsedData.isApiKeyConfigured = true;

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini grounding API failed, generating graceful high-fidelity simulated response instead:", error);
    
    // Graceful fallback to rich mock object in case of API failure (e.g. key expired or quota limits)
    const fallbackData = generateSimulatedResults(q);
    fallbackData.isApiKeyConfigured = isApiKeyPresent;
    fallbackData.apiErrorDetected = true;
    fallbackData.apiErrorMessage = error.message || error.toString();
    
    res.json(fallbackData);
  }
});

// -------------------------------------------------------------
// VITE AND DEVELOPMENT DEV SERVER SETUP
// -------------------------------------------------------------

async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Google Search Clone running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch(err => {
  console.error("Fatal: failed to initialize server:", err);
  process.exit(1);
});
