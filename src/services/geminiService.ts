import { GoogleGenAI } from "@google/genai";
import { TarotCard } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ReadingResult {
  interpretation: string;
  advice: string;
  actionSteps: string[];
}

export interface InitialReveal {
  cardMeanings: { name: string; essence: string; message: string }[];
  overallVibe: string;
}

export async function getInitialReveal(cards: TarotCard[], category: string, language: string): Promise<InitialReveal> {
  const prompt = `
    You are a master tarot reader, philosophical thinker, and psychological analyst. 
    The user has just drawn ${cards.length} cards for a reading regarding "${category}".
    
    The cards are:
    ${cards.map((c, i) => `${i + 1}. ${c.name}`).join("\n")}

    Explain the "essence" and "message" of each card in this specific spread. 
    Then provide an "overallVibe" of the spread.
    
    Tone Guidelines:
    - Be bold, technical, and down-to-earth. 
    - Avoid ambiguous "mystical fluff". 
    - Use psychological and philosophical frameworks to explain the archetypes.
    - If the reading doesn't fit, state that it might not be the right timing.
    - Respond in the following language: ${language}.

    Return a JSON object:
    {
      "cardMeanings": [
        { "name": "Card Name in ${language}", "essence": "Technical essence", "message": "Direct philosophical message" }
      ],
      "overallVibe": "A technical and philosophical analysis of the spread's energy."
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text || "{}");
}

export async function getFinalReading(
  cards: TarotCard[],
  category: string,
  userElaboration: string,
  initialReveal: InitialReveal,
  language: string
): Promise<ReadingResult> {
  const prompt = `
    You are a master tarot reader, psychiatric consultant, and deep philosopher. 
    You previously gave an initial reveal for these cards:
    ${cards.map(c => c.name).join(", ")}
    
    Initial Vibe: ${initialReveal.overallVibe}
    
    The user has now shared their specific situation:
    "${userElaboration}"
    
    Category: ${category}

    Provide a deeply personalized final reading that connects the cards specifically to their story using a technical, psychological, and philosophical lens. 
    
    Tone Guidelines:
    - Be bold and direct. 
    - Validate their reality but challenge their perspectives using psychiatric insights.
    - Provide concrete, down-to-earth advice.
    - Respond in the following language: ${language}.

    Return a JSON object:
    {
      "interpretation": "The final technical and philosophical interpretation",
      "advice": "Direct psychological/practical advice",
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text || "{}");
}
