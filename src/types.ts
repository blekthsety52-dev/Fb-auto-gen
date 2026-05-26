/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Tone = 
  | "Casual" 
  | "Funny" 
  | "Inspirational" 
  | "Heartfelt" 
  | "Professional" 
  | "Witty" 
  | "Promotional"
  | "Urgent"
  | "Mysterious";

export type Language = 
  | "Taglish" 
  | "English" 
  | "Tagalog" 
  | "Bisaya" 
  | "Spanish" 
  | "Japanese"
  | "Korean";

export type Length = "Short" | "Medium" | "Long";

export type Audience = 
  | "General" 
  | "Millennials" 
  | "Gen Z" 
  | "Parents" 
  | "Professionals" 
  | "Customers" 
  | "Students"
  | "Mindanaoan / Local";

export type PostType = 
  | "Casual status" 
  | "Storytime / Reflection" 
  | "Product launch / Sale" 
  | "Event announcement" 
  | "Question / Ask for tips" 
  | "Quote of the day" 
  | "Behind the scenes";

export interface CaptionSettings {
  topic: string;
  tone: Tone | string;
  language: Language;
  length: Length;
  includeEmojis: boolean;
  includeHashtags: boolean;
  addCta: boolean;
  audience: Audience | string;
  postType: PostType | string;
  count: number;
}

export interface GeneratedCaptionOption {
  id: string;
  caption: string;
  explanation: string;
}

export interface SavedCaption {
  id: string;
  caption: string;
  topic: string;
  tone: string;
  language: string;
  savedAt: string;
}

export interface PresetGradient {
  id: string;
  name: string;
  cssClass: string;
  textClass: string;
}

export interface UserPresetProfile {
  name: string;
  avatarUrl: string;
  verified: boolean;
  privacy: "public" | "friends" | "private";
}
