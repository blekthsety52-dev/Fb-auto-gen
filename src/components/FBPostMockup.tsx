/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Globe, 
  Users, 
  Lock, 
  CheckCircle, 
  MoreHorizontal, 
  Sparkles,
  Heart,
  Smile,
  ImageIcon,
  Trash2,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PresetGradient, UserPresetProfile } from "../types";
import { GRADIENTS } from "../data";

interface FBPostMockupProps {
  caption: string;
  profile: UserPresetProfile;
  useGradient: boolean;
  selectedGradientId: string;
  attachedImage: string | null;
  onRemoveAttachedImage?: () => void;
  onAttachImage?: (url: string) => void;
  tone: string;
}

const REACTIONS = [
  { name: "Like", emoji: "👍", color: "text-blue-500" },
  { name: "Heart", emoji: "❤️", color: "text-red-500" },
  { name: "Care", emoji: "🥰", color: "text-orange-500" },
  { name: "Haha", emoji: "😆", color: "text-yellow-500" },
  { name: "Wow", emoji: "😮", color: "text-amber-500" },
  { name: "Sad", emoji: "😢", color: "text-blue-400" },
  { name: "Angry", emoji: "😡", color: "text-red-600" }
];

export default function FBPostMockup({
  caption,
  profile,
  useGradient,
  selectedGradientId,
  attachedImage,
  onRemoveAttachedImage,
  onAttachImage,
  tone
}: FBPostMockupProps) {
  const [activeReaction, setActiveReaction] = useState<typeof REACTIONS[number] | null>(null);
  const [showReactionsBar, setShowReactionsBar] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 200) + 45);
  const [commentsCount] = useState(Math.floor(Math.random() * 40) + 12);
  const [sharesCount] = useState(Math.floor(Math.random() * 15) + 3);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse gradient details
  const activeGradient = GRADIENTS.find(g => g.id === selectedGradientId) || GRADIENTS[0];

  const handleLikeClick = () => {
    if (hasLiked) {
      setActiveReaction(null);
      setLikesCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      const defaultLike = REACTIONS[0];
      setActiveReaction(defaultLike);
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const selectReaction = (reaction: typeof REACTIONS[number]) => {
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
    }
    setActiveReaction(reaction);
    setShowReactionsBar(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPrivacyIcon = () => {
    switch (profile.privacy) {
      case "friends":
        return <Users size={12} className="text-gray-500 dark:text-gray-400" />;
      case "private":
        return <Lock size={12} className="text-gray-500 dark:text-gray-400" />;
      default:
        return <Globe size={12} className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const getPrivacyLabel = () => {
    switch (profile.privacy) {
      case "friends": return "Friends";
      case "private": return "Only me";
      default: return "Public";
    }
  };

  // Determine if mockup content should be centered white text (Facebook style short text gradients)
  const isShortTextGradient = useGradient && !attachedImage && caption.length < 180;

  return (
    <div id="fb-mockup-card" className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-md overflow-hidden self-start transition-colors">
      
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
              <span className="text-[9px] text-white font-bold">f</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm hover:underline cursor-pointer text-gray-950 dark:text-zinc-50">
                {profile.name || "My Page"}
              </span>
              {profile.verified && (
                <CheckCircle size={14} className="fill-blue-500 text-white" />
              )}
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
              <span>Just now</span>
              <span>•</span>
              <div className="flex items-center gap-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 p-0.5 rounded transition" title={getPrivacyLabel()}>
                {renderPrivacyIcon()}
              </div>
            </div>
          </div>
        </div>

        <button className="text-gray-500 dark:text-zinc-400 p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Text & Gradient Stage */}
      <div className="relative">
        {isShortTextGradient ? (
          // Traditional FB Gradient status post (Large, centered bold white text)
          <div className={`w-full min-h-[260px] flex items-center justify-center p-8 text-center transition-all ${activeGradient.cssClass}`}>
            <p className={`font-bold text-lg md:text-xl lg:text-2xl leading-relaxed break-words max-w-[90%] select-text leading-snug ${activeGradient.textClass}`}>
              {caption || "What's on your mind?"}
            </p>
          </div>
        ) : (
          // Regular text post
          <div>
            <div className="px-4 pt-1 pb-3 text-sm md:text-base text-gray-900 dark:text-zinc-150 whitespace-pre-wrap break-words leading-relaxed select-text">
              {caption || (
                <span className="text-gray-400 italic">
                  Generate captions to preview your beautiful crop here...
                </span>
              )}
            </div>

            {/* Gradient background with caption text nested, but used as general decorative block if caption is longer */}
            {useGradient && !attachedImage && caption.length >= 180 && (
              <div className={`w-full h-24 mb-3 opacity-80 ${activeGradient.cssClass} flex items-center justify-center px-4`}>
                <div className="flex items-center gap-2 text-white font-medium text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Interactive Gradient Accent Enabled ({activeGradient.name})</span>
                </div>
              </div>
            )}

            {/* Attached Image Section */}
            {attachedImage && (
              <div className="relative border-y border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 overflow-hidden max-h-[460px] flex items-center justify-center">
                <img 
                  src={attachedImage} 
                  alt="Facebook Post Media" 
                  className="w-full h-full object-cover cursor-zoom-in"
                />
                
                {onRemoveAttachedImage && (
                  <button 
                    onClick={onRemoveAttachedImage}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-600 border border-white/20 text-white rounded-full transition shadow-lg"
                    title="Remove Photo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Intelligence Indicators & Stats bar */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-400 select-none">
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
          <div className="flex items-center -space-x-1">
            <span className="w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white border border-white dark:border-zinc-900" title="Like">👍</span>
            <span className="w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white border border-white dark:border-zinc-900" title="Love">❤️</span>
            <span className="w-4.5 h-4.5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-zinc-900 border border-white dark:border-zinc-900" title="Haha">😆</span>
          </div>
          <span>
            {activeReaction ? `${activeReaction.emoji} You and ${likesCount - 1} others` : `${likesCount} likes`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="cursor-pointer hover:underline">{commentsCount} comments</span>
          <span>•</span>
          <span className="cursor-pointer hover:underline">{sharesCount} shares</span>
        </div>
      </div>

      {/* Interactive Activity bar (Real-time reactions drawer) */}
      <div className="px-1 py-1 flex items-center justify-between text-xs md:text-sm font-medium text-gray-600 dark:text-zinc-300 relative select-none">
        
        {/* Likers Hover Overlay Container */}
        <div 
          className="flex-1 relative"
          onMouseEnter={() => setShowReactionsBar(true)}
          onMouseLeave={() => setShowReactionsBar(false)}
        >
          {/* Reaction picker bar */}
          <AnimatePresence>
            {showReactionsBar && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: -45, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: "spring", damping: 18, stiffness: 220 }}
                className="absolute left-4 bottom-full z-30 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full py-1.5 px-2.5 flex items-center gap-2.5 shadow-2xl"
              >
                {REACTIONS.map((reac, idx) => (
                  <motion.button
                    key={reac.name}
                    whileHover={{ scale: 1.4, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={() => selectReaction(reac)}
                    className="text-2xl cursor-pointer p-0.5 focus:outline-none"
                    title={reac.name}
                  >
                    <span>{reac.emoji}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Like Button Trigger */}
          <button 
            onClick={handleLikeClick}
            className={`w-full py-2.5 px-2 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-lg transition active:scale-95 ${activeReaction ? activeReaction.color : 'text-gray-600 dark:text-zinc-300'}`}
          >
            {activeReaction ? (
              <span className="text-base transform scale-110">{activeReaction.emoji}</span>
            ) : (
              <ThumbsUp size={16} />
            )}
            <span className="text-xs md:text-sm">{activeReaction ? activeReaction.name : "Like"}</span>
          </button>
        </div>

        {/* Comment button */}
        <button className="flex-1 py-2.5 px-2 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-lg transition text-gray-600 dark:text-zinc-300">
          <MessageSquare size={16} />
          <span className="text-xs md:text-sm">Comment</span>
        </button>

        {/* Share button */}
        <div className="flex-1 relative group">
          <button className="w-full py-2.5 px-2 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800/60 rounded-lg transition text-gray-600 dark:text-zinc-300">
            <Share2 size={16} />
            <span className="text-xs md:text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Copy Actions Quick Panel */}
      <div className="bg-gray-50 dark:bg-zinc-950/40 p-3 border-t border-gray-150 dark:border-zinc-800/80 flex items-center justify-between gap-4">
        <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono leading-none">
          Tone Accent: <strong className="text-blue-600 dark:text-blue-400 capitalize">{tone}</strong>
        </span>

        <div className="flex items-center gap-2">
          {/* Quick Copy to Clipboard */}
          <button
            onClick={handleCopy}
            disabled={!caption}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border shadow-sm transition-all ${
              copied 
                ? "bg-green-500 hover:bg-green-600 border-green-500 text-white" 
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy Caption"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
