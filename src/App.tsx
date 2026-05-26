/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  RotateCw, 
  Star, 
  Trash2, 
  Sliders, 
  Image as ImageIcon, 
  Share2, 
  Volume2, 
  Check, 
  HelpCircle, 
  Plus, 
  CornerDownRight, 
  Smartphone, 
  Lightbulb, 
  MessageSquare, 
  ExternalLink,
  Languages,
  Users2,
  ChevronRight,
  Send,
  Lock,
  Globe,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import FBPostMockup from "./components/FBPostMockup";
import { GRADIENTS, PROFILE_AVATARS, TOPIC_SUGGESTIONS, generateLocalFallback } from "./data";
import { Tone, Language, Length, Audience, PostType, CaptionSettings, GeneratedCaptionOption, SavedCaption } from "./types";

export default function App() {
  // Input Settings State
  const [topic, setTopic] = useState<string>("opening my cute small coffee shop in Davao today");
  const [selectedTone, setSelectedTone] = useState<string>("Casual");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Taglish");
  const [selectedLength, setSelectedLength] = useState<Length>("Medium");
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true);
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [addCta, setAddCta] = useState<boolean>(true);
  const [selectedAudience, setSelectedAudience] = useState<Audience | string>("General");
  const [selectedPostType, setSelectedPostType] = useState<PostType | string>("Casual status");
  const [optionCount, setOptionCount] = useState<number>(4);

  // App & Mockup Customization State
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState<number>(0);
  const [profileName, setProfileName] = useState<string>("Mindanao Coffee Hub");
  const [profileVerified, setProfileVerified] = useState<boolean>(true);
  const [profilePrivacy, setProfilePrivacy] = useState<"public" | "friends" | "private">("public");
  
  const [useFBGradient, setUseFBGradient] = useState<boolean>(false);
  const [fbGradientId, setFbGradientId] = useState<string>("classic-blue");
  const [attachedImage, setAttachedImage] = useState<string | null>("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80");
  
  // Operational States
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"generate" | "saved">("generate");
  const [generatedOptions, setGeneratedOptions] = useState<GeneratedCaptionOption[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [savedFavorites, setSavedFavorites] = useState<SavedCaption[]>([]);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  
  // Refinement states
  const [selectedOptionForRefine, setSelectedOptionForRefine] = useState<number | null>(0);
  const [refinementInstruction, setRefinementInstruction] = useState<string>("");
  const [refining, setRefining] = useState<boolean>(false);
  const [refinementSuccessMsg, setRefinementSuccessMsg] = useState<string>("");

  // Status logs
  const [aiStatus, setAiStatus] = useState<"Real AI (Gemini 3.5)" | "Offline Engine">("Real AI (Gemini 3.5)");
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Load favorites from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fb_saved_captions");
      if (stored) {
        setSavedFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved captions", e);
    }
    
    // Test server status / key status
    logSystem("System initialized. Loading FB Caption Studio engine...");
  }, []);

  // Save favorites to LocalStorage
  const saveFavoritesToStorage = (updated: SavedCaption[]) => {
    setSavedFavorites(updated);
    try {
      localStorage.setItem("fb_saved_captions", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist saved captions", e);
    }
  };

  const logSystem = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  // Preset topic templates selection helper
  const selectSuggestion = (sug: string) => {
    setTopic(sug);
    logSystem(`Applied preset suggestion: "${sug}"`);
    // Contextually switch attachments for standard presets
    if (sug.includes("coffee") || sug.includes("cheesecake")) {
      setAttachedImage("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80");
      setUseFBGradient(false);
    } else if (sug.includes("sunset") || sug.includes("beach")) {
      setAttachedImage("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80");
      setUseFBGradient(false);
    } else if (sug.includes("desk") || sug.includes("hiring")) {
      setAttachedImage("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80");
      setUseFBGradient(false);
    } else if (sug.includes("family") || sug.includes("reunion")) {
      setAttachedImage("https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80");
      setUseFBGradient(false);
    } else {
      setAttachedImage(null);
    }
  };

  // Generate captions logic
  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please offer a valid topic or state on what your post is about.");
      return;
    }

    setLoading(true);
    logSystem(`Triggering caption generation... Tone: ${selectedTone}, Language: ${selectedLanguage}`);

    try {
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone: selectedTone,
          language: selectedLanguage,
          length: selectedLength,
          includeEmojis,
          includeHashtags,
          addCta,
          audience: selectedAudience,
          postType: selectedPostType,
          count: optionCount
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.captions && Array.isArray(data.captions)) {
          const processed = data.captions.map((item: any, idx: number) => ({
            id: `gen-${Date.now()}-${idx}`,
            caption: item.caption,
            explanation: item.explanation || "Strategically optimized copy."
          }));
          setGeneratedOptions(processed);
          setActivePreviewIndex(0);
          setSelectedOptionForRefine(0);
          setAiStatus("Real AI (Gemini 3.5)");
          logSystem(`Successfully auto-generated ${processed.length} premium options using Gemini 3.5 Flash!`);
        } else {
          throw new Error("Incorrect payload layout from API.");
        }
      } else {
        // Fallback to offline template engine if endpoint is offline or credentials aren't set yet
        const localData = Array.from({ length: optionCount }).map((_, idx) => {
          const capText = generateLocalFallback(
            topic,
            selectedTone,
            selectedLanguage,
            selectedLength,
            includeEmojis,
            includeHashtags,
            addCta
          );
          return {
            id: `local-${Date.now()}-${idx}`,
            caption: capText,
            explanation: `[Local Engine Fallback] Procedural prompt style ${idx + 1}`
          };
        });
        setGeneratedOptions(localData);
        setActivePreviewIndex(0);
        setSelectedOptionForRefine(0);
        setAiStatus("Offline Engine");
        logSystem("Endpoint unavailable/pending secret setup. Fallback generated via Local Engine template.");
      }
    } catch (error) {
      console.warn("Generation failed, falling back to local template generator:", error);
      // Construct fallback option arrays
      const localData = Array.from({ length: optionCount }).map((_, idx) => {
        const capText = generateLocalFallback(
          topic,
          selectedTone,
          selectedLanguage,
          selectedLength,
          includeEmojis,
          includeHashtags,
          addCta
        );
        return {
          id: `local-${Date.now()}-${idx}`,
          caption: capText,
          explanation: `[Resilient Fallback] Option ${idx + 1}`
        };
      });
      setGeneratedOptions(localData);
      setActivePreviewIndex(0);
      setSelectedOptionForRefine(0);
      setAiStatus("Offline Engine");
      logSystem("Connected local backup logic. Enjoy these high-performing options.");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate a single option in-place
  const handleRegenerateItem = async (indexToRegen: number) => {
    logSystem(`Regenerating item slot #${indexToRegen + 1}...`);
    try {
      const response = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone: selectedTone,
          language: selectedLanguage,
          length: selectedLength,
          includeEmojis,
          includeHashtags,
          addCta,
          audience: selectedAudience,
          postType: selectedPostType,
          count: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.captions && data.captions[0]) {
          const newItem = {
            id: `gen-single-${Date.now()}`,
            caption: data.captions[0].caption,
            explanation: data.captions[0].explanation || "Refreshed strategy."
          };
          const updated = [...generatedOptions];
          updated[indexToRegen] = newItem;
          setGeneratedOptions(updated);
          logSystem(`Successfully refreshed slot #${indexToRegen + 1} with a new direction.`);
          return;
        }
      }
      
      // Fallback
      const localTxt = generateLocalFallback(
        topic,
        selectedTone,
        selectedLanguage,
        selectedLength,
        includeEmojis,
        includeHashtags,
        addCta
      );
      const updated = [...generatedOptions];
      updated[indexToRegen] = {
        id: `local-single-${Date.now()}`,
        caption: localTxt,
        explanation: "[Offline refreshed direction]"
      };
      setGeneratedOptions(updated);
      logSystem(`Slot #${indexToRegen + 1} recalculated using backup blueprints.`);
    } catch (e) {
      // Direct offline fallback replacement
      const localTxt = generateLocalFallback(
        topic,
        selectedTone,
        selectedLanguage,
        selectedLength,
        includeEmojis,
        includeHashtags,
        addCta
      );
      const updated = [...generatedOptions];
      updated[indexToRegen] = {
        id: `local-single-${Date.now()}`,
        caption: localTxt,
        explanation: "[Offline fallback refreshed]"
      };
      setGeneratedOptions(updated);
      logSystem(`Slot #${indexToRegen + 1} updated with local backup.`);
    }
  };

  // Refine / Tweak the selected caption using specific instructions
  const handleRefineCaption = async () => {
    if (selectedOptionForRefine === null || !generatedOptions[selectedOptionForRefine]) {
      alert("Please select a caption below to apply instructions to.");
      return;
    }
    if (!refinementInstruction.trim()) {
      alert("Type a guidance, for example: 'Translate to English', 'make it sound extremely funny', or 'add local Davao slang'.");
      return;
    }

    setRefining(true);
    setRefinementSuccessMsg("");
    const targetCaption = generatedOptions[selectedOptionForRefine].caption;
    logSystem(`Applying edit to option ${selectedOptionForRefine + 1}: ${refinementInstruction.slice(0, 30)}...`);

    try {
      const response = await fetch("/api/refine-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalCaption: targetCaption,
          instruction: refinementInstruction,
          language: selectedLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refinedCaption) {
          const updated = [...generatedOptions];
          updated[selectedOptionForRefine] = {
            ...updated[selectedOptionForRefine],
            caption: data.refinedCaption,
            explanation: data.changesMade || `Tuned: "${refinementInstruction}"`
          };
          setGeneratedOptions(updated);
          setRefinementSuccessMsg("Successfully tuned!");
          setRefinementInstruction("");
          logSystem(`Optimized caption loaded. Update: ${data.changesMade || "Polished successfully"}`);
        }
      } else {
        // Mock a basic offline tuning
        const updated = [...generatedOptions];
        const prev = updated[selectedOptionForRefine].caption;
        updated[selectedOptionForRefine] = {
          ...updated[selectedOptionForRefine],
          caption: `${prev}\n\n✨ [Polished: ${refinementInstruction}] ✨`,
          explanation: `Refinement mocked: "${refinementInstruction}"`
        };
        setGeneratedOptions(updated);
        setRefinementSuccessMsg("Tuned (Offline Mode)");
        setRefinementInstruction("");
      }
    } catch (err) {
      const updated = [...generatedOptions];
      const prev = updated[selectedOptionForRefine].caption;
      updated[selectedOptionForRefine] = {
        ...updated[selectedOptionForRefine],
        caption: `${prev}\n\n📍 Edited: ${refinementInstruction}`,
        explanation: "Offline modification completed"
      };
      setGeneratedOptions(updated);
      setRefinementSuccessMsg("Applied local change");
      setRefinementInstruction("");
    } finally {
      setRefining(false);
      setTimeout(() => setRefinementSuccessMsg(""), 3500);
    }
  };

  // Trigger default load on startup
  useEffect(() => {
    handleGenerate();
  }, []);

  // Save / Toggle Favorite state
  const toggleFavorite = (option: GeneratedCaptionOption | SavedCaption) => {
    const isSaved = savedFavorites.some(f => f.caption === option.caption);
    if (isSaved) {
      const filtered = savedFavorites.filter(f => f.caption !== option.caption);
      saveFavoritesToStorage(filtered);
      logSystem("Removed caption from favorites.");
    } else {
      const newFav: SavedCaption = {
        id: `fav-${Date.now()}`,
        caption: option.caption,
        topic: topic,
        tone: selectedTone,
        language: selectedLanguage,
        savedAt: new Date().toLocaleDateString()
      };
      saveFavoritesToStorage([newFav, ...savedFavorites]);
      logSystem("Added caption to persistent favorites! ⭐");
    }
  };

  // Copy all generated options
  const copyAllOptions = () => {
    if (generatedOptions.length === 0) return;
    const combinedText = generatedOptions.map((o, i) => `=== OPTION ${i + 1} ===\n${o.caption}`).join("\n\n");
    navigator.clipboard.writeText(combinedText);
    setCopiedAll(true);
    logSystem("Copied all generated options to clipboard.");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Selection profiles for avatar info
  const handleSelectAvatarProfile = (idx: number) => {
    setSelectedAvatarIdx(idx);
    setProfileName(PROFILE_AVATARS[idx].name);
    logSystem(`Switched persona to: ${PROFILE_AVATARS[idx].name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 transition-colors">
      
      {/* 
        ===================================================================
        HEADER SECTION: Built with "Bold Typography" design theme aesthetic
        ===================================================================
      */}
      <header className="p-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 bg-white gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
            Facebook Post Studio V2.5
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
            CAPTION<span className="text-blue-600">.AI</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          {/* Quick Stats Banner inside header */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-bold uppercase tracking-tight text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${aiStatus === "Real AI (Gemini 3.5)" ? "bg-green-500" : "bg-orange-400 animate-pulse"}`}></span>
              {aiStatus}
            </span>
            <span className="text-slate-200">|</span>
            <span>⭐ {savedFavorites.length} Saved</span>
          </div>

          <button 
            onClick={() => {
              setTopic("opening my cute small coffee shop in Davao today");
              setSelectedTone("Casual");
              setSelectedLanguage("Taglish");
              setSelectedLength("Medium");
              setIncludeEmojis(true);
              setIncludeHashtags(true);
              setAddCta(true);
              setSelectedPostType("Casual status");
              setOptionCount(4);
              logSystem("Reset input settings to original Davao coffee shop theme.");
            }}
            className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase cursor-pointer tracking-tight transition"
            title="Reset to default fields"
          >
            Reset Fields
          </button>

          <a 
            href="#faq-section"
            className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-white flex items-center justify-center font-bold text-xs uppercase tracking-tight transition-all"
          >
            How it works
          </a>
        </div>
      </header>

      {/* 
        ===================================================================
        MAIN INTERFACE: Responsive layout matching the v2 blueprint look
        ===================================================================
      */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-visible">
        
        {/*
          =======================================
          LEFT: Controls & Advanced Prompters
          =======================================
        */}
        <section className="md:col-span-5 p-6 md:p-8 bg-white border-r border-slate-200 flex flex-col gap-6 overflow-y-auto">
          
          {/* The Hook (Main Topic Textarea) */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                The Core Hook / Topic
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {topic.length} characters
              </span>
            </div>
            
            <textarea 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-base font-medium focus:border-blue-500 hover:border-slate-200 outline-none transition-all resize-none text-slate-800"
              placeholder="e.g., Opening our rustic backyard coffee nook, cozy family dinner table, beautiful Mindanaon sunset beach vacation..."
            />

            {/* Suggestions Badges */}
            <div className="mt-2.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 inline-block mb-1.5 mr-2">
                Quick Prompters:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {TOPIC_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestion(sug)}
                    className="text-xs px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer transition select-none leading-none inline-flex items-center gap-1"
                  >
                    <Plus size={10} className="text-slate-400" />
                    <span>{sug.split(' ').slice(0, 3).join(' ')}...</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tone Selector: Built with interactive high contrast chips */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">
              Select Post Vibe & Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Casual", "Funny", "Inspirational", "Heartfelt", "Witty", "Professional", "Promotional", "Urgent", "Mysterious"].map((tone) => {
                const isActive = selectedTone === tone;
                return (
                  <button
                    key={tone}
                    onClick={() => {
                      setSelectedTone(tone);
                      logSystem(`Changed tone target to: ${tone}`);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-tight cursor-pointer transition-all ${
                      isActive 
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm" 
                        : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {tone}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language & Length Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Language */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Language Style
              </label>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value as Language);
                    logSystem(`Target language adjusted to: ${e.target.value}`);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold uppercase tracking-tight focus:border-blue-500 outline-none text-slate-700 cursor-pointer"
                >
                  <option value="Taglish">Taglish (🇵🇭 Colloquial)</option>
                  <option value="English">English (🇬🇧 Standard)</option>
                  <option value="Tagalog">Tagalog (🇵🇭 Filipino)</option>
                  <option value="Bisaya">Bisaya (🇵🇭 Custom Cebuano)</option>
                  <option value="Spanish">Español (🇪🇸 Spanish)</option>
                  <option value="Japanese">日本語 (🇯🇵 Japanese)</option>
                  <option value="Korean">한국어 (🇰🇷 Korean)</option>
                </select>
              </div>
            </div>

            {/* Length Control via Segmented Controller */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Caption Length
              </label>
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
                {["Short", "Medium", "Long"].map((len) => {
                  const isActive = selectedLength === len;
                  return (
                    <button
                      key={len}
                      onClick={() => {
                        setSelectedLength(len as Length);
                        logSystem(`Changed scope of length to: ${len}`);
                      }}
                      className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold uppercase tracking-tight cursor-pointer transition-all ${
                        isActive 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-500 hover:text-slate-850"
                      }`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Advanced prompt injection parameters */}
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
              Advanced Prompt Parameters (Gemini Tuning)
            </span>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Audience */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Audience</label>
                <select 
                  value={selectedAudience} 
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                >
                  <option value="General">General / Everyone</option>
                  <option value="Millennials">Millennials</option>
                  <option value="Gen Z">Gen Z (Gen-Z slang)</option>
                  <option value="Professionals">B2B Professionals</option>
                  <option value="Parents">Parents / Families</option>
                  <option value="Customers">Active Customers</option>
                  <option value="Mindanaoan / Local">Mindanaoan / Local</option>
                </select>
              </div>

              {/* Post Type */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Post Structure</label>
                <select 
                  value={selectedPostType} 
                  onChange={(e) => setSelectedPostType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                >
                  <option value="Casual status">Casual Status</option>
                  <option value="Storytime / Reflection">Storytelling reflection</option>
                  <option value="Product launch / Sale">Launch / Sale Deal</option>
                  <option value="Behind the scenes">Behind the Scenes</option>
                  <option value="Question / Ask for tips">Question / Tip Ask</option>
                  <option value="Quote of the day">Quote of the day</option>
                </select>
              </div>
            </div>

            {/* Slider Option Array Range */}
            <div className="mb-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                <span>Captions to Generate</span>
                <span className="text-blue-600 bg-blue-50 px-1.5 rounded">{optionCount} Variations</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="5" 
                value={optionCount} 
                onChange={(e) => setOptionCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Interactive Switch Toggles */}
            <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
              {/* Emojis */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs font-semibold text-slate-650 flex items-center gap-1.5">
                  <span>✨</span> Include Emojis
                </span>
                <input 
                  type="checkbox" 
                  checked={includeEmojis} 
                  onChange={(e) => setIncludeEmojis(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>

              {/* Hashtags */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs font-semibold text-slate-650 flex items-center gap-1.5">
                  <span>#️⃣</span> Include Hashtags
                </span>
                <input 
                  type="checkbox" 
                  checked={includeHashtags} 
                  onChange={(e) => setIncludeHashtags(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>

              {/* Call to action */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-xs font-semibold text-slate-650 flex items-center gap-1.5">
                  <span>🎯</span> Ask Call-To-Action (CTA)
                </span>
                <input 
                  type="checkbox" 
                  checked={addCta} 
                  onChange={(e) => setAddCta(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Trigger Generate Button */}
          <div className="mt-auto pt-2">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-5 rounded-2xl text-lg font-black tracking-tight uppercase shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                loading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-250 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <RotateCw className="animate-spin" size={20} />
                  <span>Synthesizing Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="fill-white" />
                  <span>Generate Magic Captions</span>
                </>
              )}
            </button>
          </div>
          
        </section>

        {/*
          =============================================
          RIGHT: Output & Live Interactive Post Preview
          =============================================
        */}
        <section className="md:col-span-7 p-6 md:p-8 flex flex-col gap-6 bg-slate-50 overflow-y-auto">
          
          {/* Output Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("generate")}
                className={`py-2 text-sm font-extrabold uppercase tracking-widest cursor-pointer border-b-2 transition-all ${
                  activeTab === "generate" 
                    ? "border-blue-600 text-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                Generated Options ({generatedOptions.length})
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-2 text-sm font-extrabold uppercase tracking-widest cursor-pointer border-b-2 transition-all ${
                  activeTab === "saved" 
                    ? "border-blue-600 text-slate-900 animate-pulse" 
                    : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                Saved Favorites ⭐ ({savedFavorites.length})
              </button>
            </div>

            {activeTab === "generate" && generatedOptions.length > 0 && (
              <button
                onClick={copyAllOptions}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition uppercase tracking-wider flex items-center gap-1.5"
                title="Copy all variants"
              >
                {copiedAll ? <Check size={14} /> : <Copy size={13} />}
                <span>{copiedAll ? "Copied All!" : "Copy All Variants"}</span>
              </button>
            )}
          </div>

          {/* Tab Screen Core */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Primary List Section (Left half of right side) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {activeTab === "generate" ? (
                // Screen A: Generated variations list
                <>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-250">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Ready to Use Code Variations
                    </span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      FEED OPTIMIZED
                    </span>
                  </div>

                  {generatedOptions.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center text-slate-500">
                      <Info className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="font-bold text-slate-700 mb-1">No captions yet</p>
                      <p className="text-xs">Type your topic to the left and click "Generate Magic" button.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
                      {generatedOptions.map((opt, i) => {
                        const isCurrentlyActive = activePreviewIndex === i;
                        return (
                          <div 
                            key={opt.id}
                            onClick={() => {
                              setActivePreviewIndex(i);
                              setSelectedOptionForRefine(i);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative group ${
                              isCurrentlyActive 
                                ? "bg-white border-slate-900 shadow-sm" 
                                : "bg-slate-50 border-slate-100/80 hover:bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                                Option {i + 1}
                              </span>
                              <div className="flex items-center gap-1 select-none">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(opt);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-amber-500 transition"
                                  title="Add to Favorites"
                                >
                                  <Star 
                                    size={14} 
                                    className={savedFavorites.some(f => f.caption === opt.caption) ? "fill-amber-400 text-amber-500" : ""} 
                                  />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRegenerateItem(i);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-500 transition"
                                  title="Regenerate this specific slot"
                                >
                                  <RotateCw size={14} />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm font-semibold text-slate-800 line-clamp-3 leading-relaxed mb-2 selection:bg-blue-100">
                              {opt.caption}
                            </p>

                            <p className="text-[10px] text-slate-400 italic flex items-center gap-1 border-t border-slate-100 pt-1.5 mt-1">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              Strategy: {opt.explanation}
                            </p>
                            
                            {isCurrentlyActive && (
                              <div className="absolute right-3 bottom-1.5">
                                <span className="text-[9px] font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-1 py-0.5 rounded">
                                  Live in Feed
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                // Screen B: Saved Favorites List
                <>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      ⭐ Persistent Saved Assets
                    </span>
                  </div>

                  {savedFavorites.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-2xl text-center text-slate-500">
                      <Star className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="font-bold text-slate-700 mb-1">No starred captions yet</p>
                      <p className="text-xs">Click the star button on any generated caption to persist them here!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1">
                      {savedFavorites.map((fav, i) => (
                        <div 
                          key={fav.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white relative hover:shadow-xs transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              Saved on {fav.savedAt}
                            </span>
                            <div className="flex gap-1">
                              {/* Load in Preview button */}
                              <button
                                onClick={() => {
                                  // Find or create in active generation
                                  const tempOption = { id: `fav-opt`, caption: fav.caption, explanation: "Loaded from favorites list." };
                                  setGeneratedOptions(prev => {
                                    if (prev.length === 0) return [tempOption];
                                    return prev;
                                  });
                                  setActivePreviewIndex(0);
                                  setActiveTab("generate");
                                  logSystem("Loaded saved favorite directly into active preview pane!");
                                }}
                                className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded transition"
                              >
                                Preview
                              </button>
                              
                              <button
                                onClick={() => {
                                  let filtered = savedFavorites.filter(f => f.id !== fav.id);
                                  saveFavoritesToStorage(filtered);
                                  logSystem("Removed from favorites database.");
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 transition"
                                title="Delete favorite"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-slate-800 break-words mb-2 leading-relaxed whitespace-pre-wrap selection:bg-blue-100">
                            {fav.caption}
                          </p>

                          <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-1.5 mt-1 select-none">
                            <span className="text-[9px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                              Tone: {fav.tone || "Casual"}
                            </span>
                            <span className="text-[9px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                              Language: {fav.language || "Taglish"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Tweak / Fine-Tuning Box */}
              {generatedOptions.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-xs flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-500" />
                      Tweak Active Caption
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-extrabold uppercase">
                      Option {selectedOptionForRefine !== null ? selectedOptionForRefine + 1 : "?"} SELECTED
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Need the caption modified? Enter any custom request below such as <em className="text-slate-700">"make it short and funny"</em> or <em className="text-slate-700">"translate to pure Bisaya"</em>.
                  </p>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={refinementInstruction}
                      onChange={(e) => setRefinementInstruction(e.target.value)}
                      placeholder="e.g., make it more Taglish, expand on coffee aroma..."
                      className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white text-slate-900 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRefineCaption();
                      }}
                    />
                    <button
                      onClick={handleRefineCaption}
                      disabled={refining || !refinementInstruction.trim()}
                      className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-xl text-white cursor-pointer transition select-none ${
                        refining || !refinementInstruction.trim()
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:scale-[0.97]"
                      }`}
                    >
                      {refining ? "Tuning..." : "Apply ✨"}
                    </button>
                  </div>

                  {refinementSuccessMsg && (
                    <span className="text-center font-bold text-xs text-green-600 bg-green-50 rounded p-1.5 animate-bounce block">
                      {refinementSuccessMsg}
                    </span>
                  )}
                </div>
              )}

            </div>

            {/* LIVE PREVIEW COLUMN: Right half of right side */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Preview Setup Panel */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3.5">
                  Live Mockup Customizer
                </span>

                {/* Persona Switcher row */}
                <div className="mb-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Select Posting Persona
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {PROFILE_AVATARS.map((prof, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectAvatarProfile(i)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all whitespace-nowrap ${
                          selectedAvatarIdx === i 
                            ? "bg-slate-900 border-slate-905 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-350"
                        }`}
                      >
                        <img src={prof.url} className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span>{prof.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Verified & Privacy */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Account Shield</label>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                      <button 
                        onClick={() => setProfileVerified(true)}
                        className={`flex-1 py-1 text-center font-bold text-[10px] rounded-md transition ${profileVerified ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-550'}`}
                      >
                        Verified ✓
                      </button>
                      <button 
                        onClick={() => setProfileVerified(false)}
                        className={`flex-1 py-1 text-center font-bold text-[10px] rounded-md transition ${!profileVerified ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-550'}`}
                      >
                        Standard
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Post Privacy</label>
                    <select 
                      value={profilePrivacy}
                      onChange={(e) => setProfilePrivacy(e.target.value as any)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      <option value="public">🌍 Public (Davao/Mindanao)</option>
                      <option value="friends">👥 Friends</option>
                      <option value="private">🔒 Only Me</option>
                    </select>
                  </div>
                </div>

                {/* Traditional FB Colored Status style trigger */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-650 flex items-center gap-1">
                      🎨 FB Traditional Colored Post
                    </span>
                    <input 
                      type="checkbox"
                      checked={useFBGradient}
                      onChange={(e) => {
                        setUseFBGradient(e.target.checked);
                        if (e.target.checked) setAttachedImage(null);
                        logSystem(e.target.checked ? "Activated high-impact colored post standard preview." : "Deactivated colored post mode.");
                      }}
                      className="sr-only peer"
                      id="fb-gradient-toggle"
                    />
                    <label htmlFor="fb-gradient-toggle" className="relative w-8 h-4 bg-gray-200 rounded-full cursor-pointer peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></label>
                  </div>

                  {useFBGradient && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {GRADIENTS.map((grad) => (
                        <button
                          key={grad.id}
                          onClick={() => setFbGradientId(grad.id)}
                          className={`w-6 h-6 rounded-full cursor-pointer border hover:scale-105 transition ${grad.cssClass} ${fbGradientId === grad.id ? "ring-2 ring-blue-600 ring-offset-1 border-white" : "border-slate-300"}`}
                          title={grad.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual Attachment picker */}
                {!useFBGradient && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Embed Image Attachment</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Cafe Shop", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80" },
                        { label: "Island Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80" },
                        { label: "Developer", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80" },
                        { label: "None / Just Text", url: null }
                      ].map((img, idx) => {
                        const isSelected = attachedImage === img.url;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setAttachedImage(img.url);
                              logSystem(`Selected post image anchor: "${img.label}"`);
                            }}
                            className={`flex flex-col items-center justify-center p-1 rounded-lg border cursor-pointer hover:border-slate-350 transition-all ${
                              isSelected 
                                ? "border-blue-600 bg-blue-50/50" 
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            {img.url ? (
                              <img src={img.url} className="w-full h-8 rounded object-cover mb-0.5" />
                            ) : (
                              <div className="w-full h-8 bg-slate-100 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold mb-0.5">TEXT ONLY</div>
                            )}
                            <span className="text-[7.5px] font-bold text-slate-500 uppercase truncate max-w-full">{img.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Feed Preview Mockup wrapper */}
              <div className="flex flex-col">
                <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5 select-none">
                  <Smartphone size={14} className="text-slate-400" />
                  Live Facebook Feed Preview
                </label>

                {/* Render Mockup Component */}
                <FBPostMockup
                  caption={
                    generatedOptions.length > 0 && activePreviewIndex < generatedOptions.length 
                      ? generatedOptions[activePreviewIndex].caption 
                      : "Type a topic on the left and hit generate..."
                  }
                  profile={{
                    name: profileName,
                    avatarUrl: PROFILE_AVATARS[selectedAvatarIdx].url,
                    verified: profileVerified,
                    privacy: profilePrivacy
                  }}
                  useGradient={useFBGradient}
                  selectedGradientId={fbGradientId}
                  attachedImage={attachedImage}
                  onRemoveAttachedImage={() => {
                    setAttachedImage(null);
                    logSystem("Removed mockup photo. Switch to general text layout.");
                  }}
                  tone={selectedTone}
                />
              </div>

            </div>

          </div>

          {/* FAQ & Instructional Area */}
          <section id="faq-section" className="bg-white border border-slate-200 p-6 rounded-2xl mt-4 text-left">
            <h3 className="font-extrabold text-sm uppercase tracking-wide text-slate-700 mb-3 flex items-center gap-1.5">
              <Lightbulb size={16} className="text-yellow-500 fill-yellow-100" />
              Frequently Asked Questions (FAQ) & Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-650 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">What makes a great Facebook post copy?</h4>
                <p className="leading-relaxed">
                  Facebook favors stories, questions, and relational copy. Use the <strong className="text-blue-600">Taglish</strong> or <strong className="text-blue-600">Bisaya</strong> language options if targeting Filipino/Mindanaoan audiences for organic engagement. Keep it under 250 characters if using background gradients.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">How do I test different visual looks?</h4>
                <p className="leading-relaxed">
                  Toggle the <strong className="text-slate-800">FB Traditional Colored Post</strong> checkbox to see high-impact solid colors. Otherwise, embed pre-selected photo models to preview standard graphical updates instantly.
                </p>
              </div>
            </div>
          </section>

          {/* Real-time System Debug Terminal logs for design premiumness */}
          <div className="bg-slate-900 text-stone-300 font-mono text-[10px] p-4 rounded-xl shadow-inner mt-2 border border-slate-800">
            <span className="text-slate-500 flex items-center gap-1.5 mb-2 border-b border-slate-800 pb-1.5 uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              FB Studio Server Activity Log
            </span>
            <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-1">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* 
        ===================================================================
        FOOTER SECTION: High-quality status and credits info
        ===================================================================
      */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap gap-8 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              SYSTEM: AI PIPELINE CONNECTED
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Gemini model: <strong className="text-slate-800">gemini-3.5-flash</strong>
            </span>
          </div>
        </div>

        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
          Designed for Facebook Feed Ranker v14.2 & Organic Growth
        </div>
      </footer>

    </div>
  );
}
