export interface TarotCard {
  name: string;
  arcana: 'Major' | 'Minor';
  meaning: string;
  image: string;
}

// Fisher-Yates Shuffle for true randomness
export function shuffleDeck<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { name: "The Fool", arcana: "Major", meaning: "New beginnings, optimism, trust in life", image: "https://picsum.photos/seed/aura-fool-cute/400/600" },
  { name: "The Magician", arcana: "Major", meaning: "Action, the power to manifest", image: "https://picsum.photos/seed/aura-magician-cute/400/600" },
  { name: "The High Priestess", arcana: "Major", meaning: "Inaction, going within, the subconscious", image: "https://picsum.photos/seed/aura-priestess-cute/400/600" },
  { name: "The Empress", arcana: "Major", meaning: "Abundance, nurturing, fertility", image: "https://picsum.photos/seed/aura-empress-cute/400/600" },
  { name: "The Emperor", arcana: "Major", meaning: "Structure, stability, authority", image: "https://picsum.photos/seed/aura-emperor-cute/400/600" },
  { name: "The Hierophant", arcana: "Major", meaning: "Institutions, tradition, society", image: "https://picsum.photos/seed/aura-hierophant-cute/400/600" },
  { name: "The Lovers", arcana: "Major", meaning: "Relationships, choices, alignment", image: "https://picsum.photos/seed/aura-lovers-cute/400/600" },
  { name: "The Chariot", arcana: "Major", meaning: "Direction, control, willpower", image: "https://picsum.photos/seed/aura-chariot-cute/400/600" },
  { name: "Strength", arcana: "Major", meaning: "Fortitude, patience, compassion", image: "https://picsum.photos/seed/aura-strength-cute/400/600" },
  { name: "The Hermit", arcana: "Major", meaning: "Introspection, searching, guidance", image: "https://picsum.photos/seed/aura-hermit-cute/400/600" },
  { name: "Wheel of Fortune", arcana: "Major", meaning: "Change, cycles, inevitable fate", image: "https://picsum.photos/seed/aura-wheel-cute/400/600" },
  { name: "Justice", arcana: "Major", meaning: "Cause and effect, clarity, truth", image: "https://picsum.photos/seed/aura-justice-cute/400/600" },
  { name: "The Hanged Man", arcana: "Major", meaning: "Sacrifice, release, new perspective", image: "https://picsum.photos/seed/aura-hanged-cute/400/600" },
  { name: "Death", arcana: "Major", meaning: "Endings, transition, transformation", image: "https://picsum.photos/seed/aura-death-cute/400/600" },
  { name: "Temperance", arcana: "Major", meaning: "Balance, moderation, patience", image: "https://picsum.photos/seed/aura-temperance-cute/400/600" },
  { name: "The Devil", arcana: "Major", meaning: "Bondage, addiction, materialism", image: "https://picsum.photos/seed/aura-devil-cute/400/600" },
  { name: "The Tower", arcana: "Major", meaning: "Sudden upheaval, broken pride, disaster", image: "https://picsum.photos/seed/aura-tower-cute/400/600" },
  { name: "The Star", arcana: "Major", meaning: "Hope, serenity, inspiration", image: "https://picsum.photos/seed/aura-star-cute/400/600" },
  { name: "The Moon", arcana: "Major", meaning: "Illusion, fear, anxiety, subconscious", image: "https://picsum.photos/seed/aura-moon-cute/400/600" },
  { name: "The Sun", arcana: "Major", meaning: "Happiness, success, vitality", image: "https://picsum.photos/seed/aura-sun-cute/400/600" },
  { name: "Judgement", arcana: "Major", meaning: "Rebirth, inner calling, absolution", image: "https://picsum.photos/seed/aura-judgement-cute/400/600" },
  { name: "The World", arcana: "Major", meaning: "Completion, integration, travel", image: "https://picsum.photos/seed/aura-world-cute/400/600" },
];
