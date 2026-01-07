
import { GoogleGenAI, Type } from "@google/genai";
import { ThemeConfig, ThemeResponse, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSceneTheme = async (userPrompt: string): Promise<ThemeResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are HUZIFA-ENG Statistical Stadium Architect. 
      Interpret this request for a stadium seating or bleacher construct: "${userPrompt}". 
      
      Use Google Search to find seating standards, stadium capacities, or crowd safety regulations.
      
      TECHNICAL CONSTRAINTS:
      - Geometry: 'box', 'cylinder', 'sphere', 'torus', 'pipe', 'lattice', 'stadium'. Use 'stadium' for tiered bleacher structures.
      - Colors: Use professional stadium palettes (e.g., Arena Blue, Turf Green, Safety Orange).
      - Scale: Proportions [x, y, z] to represent the physical presence.
      - Material Detail: High-fidelity technical classification (e.g. 'Reinforced Polymer Seating', 'Anti-Slip Aluminum').
      - Extra Stats: Provide 'seatingCapacity' (number) and 'viewingAngle' (number in degrees).
      - Description: Visionary summary of the statistical efficiency and architectural vision.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            geometryType: { type: Type.STRING, enum: ['box', 'cylinder', 'sphere', 'torus', 'pipe', 'lattice', 'stadium'] },
            wireframe: { type: Type.BOOLEAN },
            scale: { 
              type: Type.ARRAY, 
              items: { type: Type.NUMBER },
              minItems: 3,
              maxItems: 3
            },
            materialDetail: { type: Type.STRING },
            description: { type: Type.STRING },
            roughness: { type: Type.NUMBER },
            metalness: { type: Type.NUMBER },
            emissiveIntensity: { type: Type.NUMBER },
            seatingCapacity: { type: Type.NUMBER },
            viewingAngle: { type: Type.NUMBER }
          },
          required: ["primaryColor", "secondaryColor", "backgroundColor", "geometryType", "wireframe", "scale", "materialDetail", "description", "roughness", "metalness", "emissiveIntensity"]
        }
      }
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || "Search Result",
        uri: chunk.web?.uri || ""
      }))
      .filter(source => source.uri !== "");

    if (text) {
      return {
        theme: JSON.parse(text) as ThemeConfig,
        sources
      };
    }
    return null;
  } catch (error) {
    console.error("Neural synthesis error:", error);
    return null;
  }
};
