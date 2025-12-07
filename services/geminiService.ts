import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorldData } from '../types';

// Schema definition matching WorldData structure for structured JSON output
const worldSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    basics: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        setting: { type: Type.STRING },
        population: { type: Type.STRING },
        description: { type: Type.STRING },
      }
    },
    geography: {
      type: Type.OBJECT,
      properties: {
        naturalWorld: { type: Type.STRING },
        floraFauna: { type: Type.STRING },
        creatures: { type: Type.STRING },
        landscape: { type: Type.STRING },
        diseases: { type: Type.STRING },
      }
    },
    locations: {
      type: Type.OBJECT,
      properties: {
        majorCities: { type: Type.STRING },
        capitalCity: { type: Type.STRING },
        flagsSymbols: { type: Type.STRING },
      }
    },
    weather: {
      type: Type.OBJECT,
      properties: {
        patterns: { type: Type.STRING },
        climate: { type: Type.STRING },
      }
    },
    people: {
      type: Type.OBJECT,
      properties: {
        racesSpecies: { type: Type.STRING },
        physicalBuild: { type: Type.STRING },
        mannerisms: { type: Type.STRING },
        customsRituals: { type: Type.STRING },
      }
    },
    languages: {
      type: Type.OBJECT,
      properties: {
        listAndOrigins: { type: Type.STRING },
        sayings: { type: Type.STRING },
        accents: { type: Type.STRING },
        greetings: { type: Type.STRING },
      }
    },
    socialFrameworks: {
      type: Type.OBJECT,
      properties: {
        perception: { type: Type.STRING },
        classSystem: { type: Type.STRING },
        familyStructure: { type: Type.STRING },
        marriage: { type: Type.STRING },
      }
    },
    civilization: {
      type: Type.OBJECT,
      properties: {
        history: { type: Type.STRING },
        myths: { type: Type.STRING },
        culture: { type: Type.STRING },
        literatureArt: { type: Type.STRING },
        clothing: { type: Type.STRING },
        cuisine: { type: Type.STRING },
      }
    },
    religion: {
      type: Type.OBJECT,
      properties: {
        worshipMethods: { type: Type.STRING },
        godsDeities: { type: Type.STRING },
        holyTexts: { type: Type.STRING },
        prophets: { type: Type.STRING },
      }
    },
    education: {
      type: Type.OBJECT,
      properties: {
        formalEducation: { type: Type.STRING },
        magicEducation: { type: Type.STRING },
        literacy: { type: Type.STRING },
      }
    },
    leisure: {
      type: Type.OBJECT,
      properties: {
        entertainment: { type: Type.STRING },
        sports: { type: Type.STRING },
      }
    },
    magicTechWeapons: {
      type: Type.OBJECT,
      properties: {
        magicSystem: { type: Type.STRING },
        magicRules: { type: Type.STRING },
        magicians: { type: Type.STRING },
        technology: { type: Type.STRING },
        weaponry: { type: Type.STRING },
        commonWeapons: { type: Type.STRING },
      }
    },
    economy: {
      type: Type.OBJECT,
      properties: {
        tradeCommerce: { type: Type.STRING },
        currency: { type: Type.STRING },
        importsExports: { type: Type.STRING },
        naturalResources: { type: Type.STRING },
      }
    },
    transportation: {
      type: Type.OBJECT,
      properties: {
        modes: { type: Type.STRING },
        infoDissemination: { type: Type.STRING },
      }
    },
    business: {
      type: Type.OBJECT,
      properties: {
        trades: { type: Type.STRING },
        workSchedule: { type: Type.STRING },
      }
    },
    politics: {
      type: Type.OBJECT,
      properties: {
        government: { type: Type.STRING },
        law: { type: Type.STRING },
        justiceSystem: { type: Type.STRING },
        warSystems: { type: Type.STRING },
      }
    },
  }
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeTextAndFillWorld = async (text: string, currentData: WorldData): Promise<WorldData> => {
  const ai = getClient();
  
  // Chunking logic to handle large files and avoid token limits
  // Significantly reduced safe chunk size to ~100k chars (~25k tokens) to be absolutely safe against limits
  const CHUNK_SIZE = 100000;
  const chunks: string[] = [];
  
  if (text.length > CHUNK_SIZE) {
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      chunks.push(text.slice(i, i + CHUNK_SIZE));
    }
  } else {
    chunks.push(text);
  }

  let mergedData = { ...currentData };

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    const prompt = `
      Você é um assistente especialista em Worldbuilding.
      Analise o texto fornecido abaixo (Parte ${i + 1} de ${chunks.length}).
      Sua tarefa é extrair o máximo de informações possível para preencher o seguinte formulário de worldbuilding.
      
      Se uma informação não estiver explicitamente no texto, mas puder ser fortemente inferida, faça a inferência.
      Se a informação não existir, deixe o campo como uma string vazia "".
      
      Retorne APENAS um objeto JSON válido seguindo estritamente o schema fornecido. Mantenha os valores em Português.
      
      Texto para análise:
      ${chunk}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: worldSchema,
        },
      });

      const extractedData = JSON.parse(response.text || "{}") as Partial<WorldData>;
      
      // Smart Merge: Concatenate or Update
      (Object.keys(extractedData) as Array<keyof WorldData>).forEach((key) => {
        const section = extractedData[key];
        if (section && typeof section === 'object') {
          const currentSection = mergedData[key];
          // Ensure we have a new object reference
          const updatedSection = { ...currentSection };
          
          Object.keys(section).forEach((subKey) => {
             // @ts-ignore
             const newVal = section[subKey];
             // @ts-ignore
             const oldVal = updatedSection[subKey];
             
             // Only process if we have a valid string value
             if (newVal && typeof newVal === 'string' && newVal.trim().length > 0) {
                 if (oldVal && oldVal.trim().length > 0) {
                     // If data exists, append it with a separator if it's different enough
                     // This prevents overwriting data from previous chunks
                     if (!oldVal.includes(newVal.substring(0, Math.min(newVal.length, 50)))) {
                         // @ts-ignore
                         updatedSection[subKey] = oldVal + "\n\n" + newVal;
                     }
                 } else {
                     // If empty, just set it
                     // @ts-ignore
                     updatedSection[subKey] = newVal;
                 }
             }
          });
          // Fix TS error: Type '{ ... }' is not assignable to type '{ ... } & ...'
          (mergedData as any)[key] = updatedSection;
        }
      });

    } catch (error) {
      console.error(`Error analyzing chunk ${i + 1}:`, error);
      // Continue processing other chunks even if one fails
    }

    // Small backoff to respect rate limits if multiple chunks
    if (chunks.length > 1) {
      await delay(500);
    }
  }

  return mergedData;
};
