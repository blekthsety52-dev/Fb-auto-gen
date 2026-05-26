import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI client (server-side only)
// Always include httpOptions with User-Agent for tracking
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Real AI capabilities will fall back to smart local template generators.");
}

// 1. API Endpoint: Auto-generate captions utilizing Gemini 3.5 Flash
app.post("/api/generate-captions", async (req, res) => {
  try {
    const {
      topic,
      tone = "Casual",
      language = "Taglish",
      length = "Medium",
      includeEmojis = true,
      includeHashtags = true,
      addCta = true,
      audience = "General",
      postType = "Casual status",
      count = 4
    } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Topic is required to generate captions." });
    }

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API client is not configured. Please set GEMINI_API_KEY."
      });
    }

    // Construct prompt based on choices to generate high-performing FB copies
    const lengthGuide = {
      Short: "very concise (1-2 short sentences, under 120 characters), punchy, ideal for quick scrolling.",
      Medium: "well-balanced (3-5 sentences, under 350 characters), divided cleanly with line breaks, highly legible.",
      Long: "detailed and rich (6-10 sentences, storytelling style, under 1000 characters) with line-breaks and bullet points where helpful."
    }[length as "Short" | "Medium" | "Long"] || "moderate length with line breaks.";

    const systemInstruction = 
      `You are an expert Facebook Copywriter and Social Media Analyst specializing in high-converting, deeply engaging, and organic-feeling social media posts.
      Your target platform is Facebook, which means the text should feel personal, conversational, and highly relatable. Avoid robotic, soundalike corporate hype.
      
      You will write captions in ${language} language. Note instructions for local/regional languages:
      - Taglish: Blend English and conversational Tagalog/Filipino seamlessly, the way young, active social media users in the Philippines actually talk and post (natural, warm, expressive, with optional Pinoy pop-culture vibes).
      - Tagalog: Conversational, smooth, natural Filipino, avoiding archaic or overly complex words unless intended for specific effect.
      - Bisaya: Warm, authentic, conversational Cebuano (common in Davao, Cebu, and Mindanao), using local expressions the way real folks chat.
      - English: Extremely engaging, friendly, and captivating. Use hooks.
      
      Generate exactly ${count} completely distinct options. Each option must follow the requested Tone (${tone}), Target Audience (${audience}), and Post Type (${postType}).
      
      Formatting and structured guidelines:
      - Target Length: ${lengthGuide}
      - Emojis: ${includeEmojis ? "Yes, include a few well-placed highly relevant emojis to capture attention (do not spam too many)." : "No emojis at all."}
      - Call-to-Action (CTA): ${addCta ? "End with an engaging, interactive question or call to action to prompt comments organically." : "No explicit call-to-action requested."}
      - Hashtags: ${includeHashtags ? "Add 2 to 4 highly relevant, highly search-friendly hashtags at the absolute bottom, separated by a line break." : "Do not include any hashtags."}
      
      Make each of the ${count} options use a different creative angle, hook, or narrative focus so the user has beautiful, varied choices. Do not repeat identical hooks or phrases.`;

    const userPrompt = `Generate ${count} distinct Facebook captions about this topic: "${topic}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              caption: {
                type: Type.STRING,
                description: "The complete copy of the generated Facebook caption with proper spacing, line breaks, emojis, and hashtags as instructed.",
              },
              explanation: {
                type: Type.STRING,
                description: "A very short (one sentence) explanation of the strategy, marketing hook, or unique viewpoint used in this choice.",
              }
            },
            required: ["caption", "explanation"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI generation.");
    }

    const captions = JSON.parse(responseText.trim());
    return res.json({ captions });

  } catch (error: any) {
    console.error("AI Generation Error in /api/generate-captions:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate captions. Please try again.",
      details: error.stack
    });
  }
});

// 2. API Endpoint: Tune/Refine an existing caption
app.post("/api/refine-caption", async (req, res) => {
  try {
    const { originalCaption, instruction, language = "Taglish" } = req.body;

    if (!originalCaption || originalCaption.trim() === "") {
      return res.status(400).json({ error: "Original caption is required." });
    }

    if (!instruction || instruction.trim() === "") {
      return res.status(400).json({ error: "Refinement instruction is required." });
    }

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API client is not configured. Please set GEMINI_API_KEY."
      });
    }

    const systemInstruction = 
      `You are an expert social media editor. Your task is to take an existing Facebook caption, modify it according to the user's specific instruction, and make it far more engaging.
      Maintain proper line spacing, paragraphs, and active conversational tone.
      Return the response in JSON format with refined caption and a brief description of what was polished.`;

    const userPrompt = 
      `Original Caption:
      "${originalCaption}"
      
      User's Refinement Instruction:
      "${instruction}"
      
      Keep the language natural (if Taglish or Bisaya, ensure authentic colloquial expressions are kept or polished appropriately).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.75,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedCaption: {
              type: Type.STRING,
              description: "The fully revised, modified, and beautifully polished Facebook caption.",
            },
            changesMade: {
              type: Type.STRING,
              description: "A short, elegant summary of what updates were executed to fulfill the instruction.",
            }
          },
          required: ["refinedCaption", "changesMade"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from refinement generation.");
    }

    const result = JSON.parse(responseText.trim());
    return res.json(result);

  } catch (error: any) {
    console.error("AI Refinement Error in /api/refine-caption:", error);
    return res.status(500).json({
      error: error.message || "Failed to refine caption.",
      details: error.stack
    });
  }
});

// Integrate Vite dev server middleware or serve production assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Started Express in development mode with Vite HMR middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Started Express in production mode serving static assets from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
