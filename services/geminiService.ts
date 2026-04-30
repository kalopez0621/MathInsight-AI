
import { GoogleGenAI, Type } from "@google/genai";
import { StudentRecord, AIAnalysisResult } from "../types";

export const getMathInsights = async (students: StudentRecord[], subgroupName: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const studentDataSummary = students.map(s => ({
    name: s.name,
    ell: s.ell,
    ese: s.ese,
    absences: s.absences,
    pm1: { score: s.fastPm1Score, level: s.fastPm1Level },
    pm2: { score: s.fastPm2Score, level: s.fastPm2Level },
    priorPm3: s.priorFastPm3Score,
    indicator: s.l25l35Indicator
  }));

  const prompt = `Analyze the following student assessment data for the subgroup "${subgroupName}".
  Provide concise instructional insights focusing on:
  1. Overall PM1 to PM2 growth trends.
  2. Specific regression flags (students who dropped in score/level).
  3. Scoring floor patterns or common struggle areas.
  4. Reteaching and grouping suggestions based on performance levels.
  
  Do not invent missing data. If data for a field is blank, treat it as missing. 
  Maintain a professional, teacher-friendly tone. 
  
  Student Data: ${JSON.stringify(studentDataSummary)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          growthTrends: { type: Type.STRING },
          regressionFlags: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                studentName: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["studentName", "reason"]
            }
          },
          groupingSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                groupName: { type: Type.STRING },
                students: { type: Type.ARRAY, items: { type: Type.STRING } },
                focusArea: { type: Type.STRING }
              },
              required: ["groupName", "students", "focusArea"]
            }
          },
          instructionalStrategies: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "growthTrends", "regressionFlags", "groupingSuggestions", "instructionalStrategies"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
