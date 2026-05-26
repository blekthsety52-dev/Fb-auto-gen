import { PresetGradient, UserPresetProfile } from "./types";

export const GRADIENTS: PresetGradient[] = [
  { id: "classic-blue", name: "Classic Blue", cssClass: "bg-blue-600", textClass: "text-white" },
  { id: "sunset-breeze", name: "Sunset Breeze", cssClass: "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600", textClass: "text-white" },
  { id: "midnight-neon", name: "Midnight Neon", cssClass: "bg-gradient-to-tr from-slate-900 via-violet-800 to-blue-900", textClass: "text-white" },
  { id: "emerald-glow", name: "Emerald Glow", cssClass: "bg-gradient-to-br from-teal-500 to-emerald-800", textClass: "text-white" },
  { id: "cotton-candy", name: "Cotton Candy", cssClass: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400", textClass: "text-slate-900" },
  { id: "fireway", name: "Volcanic Ash", cssClass: "bg-gradient-to-tr from-stone-900 via-red-800 to-orange-600", textClass: "text-white" },
  { id: "tropical-davao", name: "Durian Delight", cssClass: "bg-gradient-to-r from-lime-400 via-yellow-400 to-emerald-600", textClass: "text-stone-900" },
  { id: "cyberpunk", name: "Neo Purple", cssClass: "bg-gradient-to-r from-fuchsia-600 to-pink-500", textClass: "text-white" }
];

export const PROFILE_AVATARS = [
  { name: "Local Brand / Cafe", url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80" },
  { name: "Traveler / Blogger", url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&auto=format&fit=crop&q=80" },
  { name: "Mompreneur", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
  { name: "Tech Enthusiast", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { name: "Fitness Coach", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&auto=format&fit=crop&q=80" }
];

export const TOPIC_SUGGESTIONS = [
  "opening my cute small coffee shop in Davao today",
  "watching the golden sunset at Samal Island",
  "fun weekend family reunion after 5 years apart",
  "surviving my first 10km run in the rain",
  "we are hiring remote junior developers in Mindanao",
  "launching our homemade durian cheesecake promo",
  "quick desk space tour as a programmer"
];

// Offline fallback template structures for fast, resilient caption generation
export const TEMPLATES: Record<string, Record<string, string[]>> = {
  English: {
    Funny: [
      "Finally did it! {topic} {emoji}",
      "POV: me attempting {topic} and actually surviving 💀",
      "Plot twist: {topic} happened and I was definitely not prepared",
      "Not me crying over {topic} at this hour",
      "Achievement unlocked: {topic} is finally checked off",
      "Me vs {topic}: I won (barely)",
      "Breaking news: {topic} is officially real",
      "Day 1 of {topic} and I'm already delulu",
      "When {topic} hits different on a Tuesday",
      "Hot take: {topic} is better than everything else right now",
      "My brain: don't do it. Me: {topic} 🤡"
    ],
    Inspirational: [
      "Small wins, big smiles. {topic} today ✨",
      "Trust the process. {topic} is proof that hard work pays off.",
      "One step at a time. Proud to share {topic}!",
      "Dreams don't work unless you do. Extremely proud of {topic}.",
      "Keep going. {topic} reminds me why I started this journey.",
      "Growth looks like {topic} and finding peace in the steps.",
      "Grateful for this beautiful moment: {topic} 🙏",
      "Your breakthrough is coming. Mine looked like {topic} today."
    ],
    Heartfelt: [
      "My heart is absolutely full. Sharing {topic} with you guys.",
      "This moment means everything. {topic} represents so much love.",
      "Beyond description grateful for {topic} and all of you.",
      "Made possible by love, endless support, and constant prayers. {topic}",
      "Cherishing this with every fiber of my being: {topic} 💖",
      "Family first, always. Nothing compares to {topic}."
    ],
    Professional: [
      "Proud to announce {topic} for our community.",
      "Excited to share our latest milestone: {topic}",
      "We are officially pioneering a new chapter with {topic}.",
      "Milestone achieved: {topic}. Thank you to our wonderful team!",
      "Delivering top-tier quality through {topic}."
    ],
    Witty: [
      "Alert: {topic} has officially entered the chat.",
      "Main character energy: {topic} 💅",
      "Hot girl summer? No, it's strictly {topic} season.",
      "Serving {topic} with a healthy side of confidence.",
      "Roman Empire? No, I'm thinking about {topic}."
    ],
    Promotional: [
      "Now open! Experience {topic} today.",
      "Grand opening special: Don't miss out on {topic}!",
      "Limited time offer: get ready for {topic}!",
      "Support local Davao check! {topic} is now officially available.",
      "Your new favorite is here: check out {topic}!"
    ],
    Casual: [
      "Just sharing a bit of: {topic}",
      "Today's cozy vibe: {topic}",
      "Quick update for everyone: {topic}",
      "Random thought of the day: {topic}",
      "Life lately has been all about {topic}."
    ]
  },
  Tagalog: {
    Funny: [
      "Sa wakas! {topic}. Salamat naman sa support niyo! {emoji}",
      "Budol is real: {topic} naku po!",
      "Hindi ako iyakin, pero grabe yung saya ko sa {topic} 😭",
      "Plot twist: {topic} na pala ang rason ng pagpupuyat ko.",
      "Ako na to: welcome to my {topic} era!",
      "Yung akala mo joke lang, pero {topic} na talaga ngayon.",
      "Manifesting na naging totoong totoo: {topic}!"
    ],
    Inspirational: [
      "Hindi madali pero worth it. Proud of {topic} ✨",
      "Tiwala lang sa magandang plano. {topic} na ngayon!",
      "Step by step lang. Walang shortcut pero look at {topic}!",
      "Pangarap na unti-unting nabubuo: {topic}.",
      "Laban lang palagi. {topic} ang aking patunay na walang imposible."
    ],
    Heartfelt: [
      "Puno ang aking puso. Simple pero totoo: {topic} ❤️",
      "Para sa aking minamahal na pamilya: {topic}.",
      "Salamat sa lahat ng nagdasal at sumuporta sa {topic}.",
      "Hindi ko to magagawa mag-isa. Utang ko to sa inyo: {topic}.",
      "Sobrang grateful at punong-puno ng pagpapasalamat: {topic} 🙏"
    ],
    Professional: [
      "Opisyal na naming inilulunsad ang {topic} sa inyong lugar.",
      "Proud kaming ipakilala ang aming bagong proyekto: {topic}",
      "Bukas na po kami para maglingkod: {topic}",
      "Magandang balita para sa lahat! {topic} is now fully operational.",
      "De-kalidad at maaasahan para sa inyo: {topic}."
    ],
    Witty: [
      "Sabi ko chill lang muna, pero bakit napunta sa {topic}?",
      "Manifest na may kasamang matinding resibo: {topic}",
      "Soft launch lang muna po tayo sa {topic} 🤫",
      "Delulu turned trululu: {topic} era checked!",
      "It's giving blessed and glowing with {topic}."
    ],
    Promotional: [
      "Grand opening sale para sa {topic}! Sugod na po kayo.",
      "Limited slots or stock lang po para sa {topic}. Huwag magpahuli!",
      "PM is key! Order na po kayo ng {topic}.",
      "Suportahan po natin ang lokal: {topic} na gawang Pinoy!",
      "Libreng delivery para sa inyong {topic} order ngayon!"
    ],
    Casual: [
      "Share ko lang po ito: {topic}",
      "Ganap today: {topic}",
      "Simple lang pero masaya para sa {topic}.",
      "Just now: {topic} happening right before my eyes.",
      "Wala lang, gusto ko lang i-share ang {topic}."
    ]
  },
  Taglish: {
    Funny: [
      "Can't believe this actually happened! {topic} grabe 😂",
      "Manifesting era unlocked: we have {topic} now!",
      "Budol successfully completed: check out my {topic}!",
      "Akala ko meme lang, pero {topic} na pala sa totoong buhay.",
      "For da ferson ang peg with {topic}!",
      "Sobrang random, but {topic} made my whole week."
    ],
    Inspirational: [
      "From dream to beautiful reality: {topic} ✨",
      "Small steps lang pero slowly making a difference: {topic}!",
      "Trust the timing, worth all the wait also for {topic}.",
      "Worth ang lahat ng puyat and pagod for {topic}! Thank God.",
      "Claiming this massive win today: {topic}!"
    ],
    Heartfelt: [
      "My heart is so full dahil sa {topic} 😭❤️",
      "Para sa family ko to, they are my solid rock for {topic}.",
      "Sobrang thankful for {topic} and for everyone beside me.",
      "I couldn't have pulled this off without you guys: {topic}.",
      "This simple milestone means everything: {topic}."
    ],
    Professional: [
      "We are absolutely thrilled to introduce {topic}!",
      "Officially launching our latest venture: {topic} 🚀",
      "A proud milestone for our growing team: {topic}.",
      "Now serving Davao and nearby cities with {topic}.",
      "Comfort and quality guaranteed with our {topic}."
    ],
    Witty: [
      "Soft launch lang ng {topic} details soon!",
      "Main character energy with this {topic} right now.",
      "Plot twist of the year: I now have {topic}.",
      "It's giving successful, glowing, and obsessed with {topic}.",
      "Roman empire ko talaga itong super loved {topic}."
    ],
    Promotional: [
      "New product alert: Grab yours now for {topic}!",
      "Order na po kayo ng {topic} drop a message!",
      "Support small businesses! We are happy to launch {topic}.",
      "Limited stocks left for {topic} grab it fast!",
      "Sale is officially live for {topic}! Send direct message to buy."
    ],
    Casual: [
      "Sharing a quick update of: {topic}",
      "Life lately has been constant vibe check with {topic}.",
      "Random appreciation post for {topic}.",
      "Just because masaya lang ako today sharing {topic}.",
      "Chill day with my favorite {topic}."
    ]
  },
  Bisaya: {
    Funny: [
      "Grabe ka nindot sa {topic}! Salamat kaayo Lord {emoji}",
      "Finally! Atong dugay na gipaabot, {topic} na gyud tawn!",
      "Budol is real sa atong {topic} haha no regrets!",
      "Hala oy wa nagdahom nga {topic} na diay karon.",
      "Wa ko nag-expect sa ka nindot sa {topic} uy!",
      "Sana all naay ingon ani nga {topic} permi!"
    ],
    Inspirational: [
      "Hinay-hinay lang pero abot gihapon sa pangandoy: {topic} ✨",
      "Salamat sa Ginoo sa tubag sa pag-ampo: {topic}.",
      "Laban lang gihapon, dili mo-surrender para sa {topic}!",
      "Pangandoy kaniadto, kamatuoran na karon sa {topic}.",
      "Dili jod sayon, pero perting dakoa sa akong pasalamat sa {topic}."
    ],
    Heartfelt: [
      "Puno akong kasingkasing sa kalipay tungod sa {topic} 🥹❤️",
      "Para sa pamilya ug mga minahal sa kinabuhi: {topic}.",
      "Dili ni mahitabo kung wala ang inyong gugma para sa {topic}.",
      "Gikan sa kinahiladman sa akong kasingkasing: {topic}.",
      "Blessed kaayo ko karon tungod sa akong {topic}."
    ],
    Professional: [
      "Opisyal na namong giabli ang {topic} para sa tanan natong suki.",
      "Proud kaayo ang among team nga mo-presentar sa {topic}.",
      "Andam na kami moalagad kaninyo sugod karon: {topic}.",
      "Bag-ong serbisyo para sa inyong kasayon: {topic}.",
      "De-kalidad nga serbisyo, saktong presyo ra gyud sa {topic}."
    ],
    Witty: [
      "Soft launch lang sa atong pinakabag-ong {topic} ha.",
      "Main character vibes kaayo uban ang {topic} ✨",
      "Plot twist: ako na ang tag-iya sa {topic} karon.",
      "It's giving seryoso apan nindot kaayo nga {topic}.",
      "Kinsa may magtuo nga ma-achieve ni? {topic} checked!"
    ],
    Promotional: [
      "Now open na ang {topic} sa Davao ug kasikbit nga dapit!",
      "Order na mo sa atong lami kaayo nga {topic}!",
      "Support local business ta ninyo mga higala: {topic}!",
      "Barato kaayo apan nindot kaayo nga {topic}!",
      "PM lang direkta aron ma-secure inyong {topic} order karon!"
    ],
    Casual: [
      "Share lang nako akong malipayon nga ganap: {topic}.",
      "Karong adlawa nga vibe: sige rag {topic}.",
      "Simple ra kaayo apan malipayon gihapon uban sa {topic}.",
      "Just now: gasige ug lingaw sa {topic}.",
      "Maayong adlaw! Flex lang nako kadiyot ang {topic}."
    ]
  }
};

export const EXTENSIONS: Record<string, string[]> = {
  English: [
    "So incredibly grateful for this phase of life.",
    "Couldn't ask for a more perfect day and timing.",
    "Here's to more beautiful milestones and moments like this.",
    "Davao, you definitely have my whole heart.",
    "Small business with massive, big-time dreams.",
    "Cheers to beautiful new beginnings ahead!"
  ],
  Tagalog: [
    "Maraming salamat po sa lahat ng patuloy na sumusuporta.",
    "Sobrang saya ko talaga ngayong araw na ito.",
    "Alay ko ang tagumpay na ito para sa aking pamilya.",
    "Kahit anong pagsubok, tuloy-tuloy pa rin ang laban natin.",
    "Worth it talaga ang lahat ng pagod at puyat."
  ],
  Taglish: [
    "Grabe lang talaga kung paano nangyari lahat.",
    "Fully worth it ang bawat second ng biyahe na ito.",
    "Because small wins absolutely matter every single day.",
    "Davao vibes are indeed the best vibes ever.",
    "Manifesting more awesome blessings coming our way.",
    "Thankful era is finally unlocked and official!"
  ],
  Bisaya: [
    "Daghang salamat kaayo sa inyong walay-pukaw nga suporta.",
    "Malipayon ug mapasalamaton kaayo ko karong adlawa.",
    "Padayon lang gihapon ta ninyo gawas sa tanang dula sa kinabuhi.",
    "Mao gyud ni ang rason nga magpadayon ug maningkamot pa.",
    "Worth it kaayo ang matag tulo sa singot ug hago."
  ]
};

export const CTAS: Record<string, string[]> = {
  English: [
    "What do you think about this? Let me know in the comments!",
    "Share your thoughts or tips below! I'd love to hear them.",
    "Tag someone who needs to see or try this today!",
    "Drop a comment with your favorite emoji if you agree!"
  ],
  Tagalog: [
    "Sulat niyo naman ang komento niyo sa ibaba!",
    "Ano sa tingin niyo? I-share niyo naman sa comments!",
    "Paki-tag naman ang iyong mga kaibigan na makakarelate dito!",
    "I-like at i-share kung sang-ayon kayo!"
  ],
  Taglish: [
    "Comment down below what you think, guys!",
    "Kayo ba, ano ang solid experience niyo dito? Let me know!",
    "Share niyo naman ang inyong thoughts sa comments section!",
    "Tag your besties or workmates who definitely need this vibe!"
  ],
  Bisaya: [
    "Unsa inyong ikasulti niini? Comment mo sa ubos!",
    "Kamo, unsa man inyong thoughts ani? Let me know bi!",
    "Tag kaila ninyo nga makarelate ani og maayo!",
    "Dali! Pag-bilin og komento sa ubos aron magtsika ta!"
  ]
};

export const RELEVANT_EMOJIS: Record<string, string[]> = {
  coffee: ["☕", "🥐", "🧋", "🧁", "🍩", "✨"],
  food: ["🍜", "🍔", "🍕", "🍰", "🍇", "🍽️"],
  travel: ["✈️", "🗺️", "🚗", "📍", "🎒", "📸"],
  sunset: ["🌅", "🏝️", "🌊", "🌴", "☀️", "😎"],
  beach: ["🏖️", "🏊‍♂️", "🏄‍♀️", "🌊", "🍹", "🐬"],
  family: ["👨‍👩‍👧‍👦", "❤️", "🏡", "🤗", "🥹", "👵"],
  business: ["🚀", "💼", "📈", "🙌", "🔥", "🏪"],
  hiring: ["💼", "📝", "💻", "✨", "🌟", "🤝"],
  fitness: ["💪", "🏃‍♀️", "🏋️‍♂️", "🚴‍♂️", "🥗", "🎯"]
};

// Generates local mock captions when API is unavailable (and for instant snappy previews)
export function generateLocalFallback(
  topic: string,
  tone: string,
  lang: string,
  length: string,
  includeEmojis: boolean,
  includeHashtags: boolean,
  addCta: boolean
): string {
  const normTopic = topic.trim() || "my simple story";
  const cappedTopic = normTopic.charAt(0).toUpperCase() + normTopic.slice(1);
  
  // Find templates
  const langTemplates = TEMPLATES[lang] || TEMPLATES["English"];
  const toneTemplates = langTemplates[tone] || langTemplates["Casual"] || langTemplates[Object.keys(langTemplates)[0]];
  
  // Choose random template
  const randTemplate = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
  
  // Set emojis
  let emojiBlock = "";
  if (includeEmojis) {
    let selectedSet = RELEVANT_EMOJIS.general;
    const lowerTopic = normTopic.toLowerCase();
    for (const [key, emojis] of Object.entries(RELEVANT_EMOJIS)) {
      if (lowerTopic.includes(key)) {
        selectedSet = emojis;
        break;
      }
    }
    if (!selectedSet) {
      selectedSet = lang === "English" ? ["✨", "✨", "💖"] : ["🥹", "🫶", "🙏", "✨"];
    }
    const sliced = selectedSet.sort(() => 0.5 - Math.random()).slice(0, 2);
    emojiBlock = sliced.join(" ");
  }

  // Build root text
  let outText = randTemplate.replace("{topic}", cappedTopic).replace("{emoji}", emojiBlock).trim();
  
  // Add lengths
  const langExts = EXTENSIONS[lang] || EXTENSIONS["English"];
  if (length !== "Short" && langExts && langExts.length > 0) {
    const ext1 = langExts[Math.floor(Math.random() * langExts.length)];
    outText += ` ${ext1}`;
    
    if (length === "Long" && langExts.length > 1) {
      let ext2 = ext1;
      while (ext2 === ext1) {
        ext2 = langExts[Math.floor(Math.random() * langExts.length)];
      }
      outText += ` ${ext2}`;
    }
  }

  // Add Call-To-Action
  if (addCta) {
    const langCtas = CTAS[lang] || CTAS["English"];
    const randCta = langCtas[Math.floor(Math.random() * langCtas.length)];
    outText += ` ${randCta}`;
  }

  // Add Hashtags
  if (includeHashtags) {
    const defaultTags = baseTags[lang as keyof typeof baseTags] || ["#SupportLocal", "#FacebookGen"];
    const customTags = normTopic
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3 && !["and", "with", "your", "para", "mga", "natin", "kung"].includes(w))
      .map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
      
    const uniqueTags = [...new Set([...customTags, ...defaultTags])].slice(0, 4);
    outText += `\n\n${uniqueTags.join(" ")}`;
  }

  return outText;
}

const baseTags: Record<string, string[]> = {
  English: ["#Grateful", "#Vibes", "#PositiveMindset"],
  Tagalog: ["#GratefulPH", "#PinoyVibes", "#LokalPH"],
  Taglish: ["#MyDay", "#VibesCheck", "#HappyFerson"],
  Bisaya: ["#Mapasalamaton", "#LokalPride", "#DavaoLife"]
};
