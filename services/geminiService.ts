
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRepository = async (repoUrl: string): Promise<AnalysisResult> => {
  // Always use {apiKey: process.env.API_KEY} for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this technical blueprint/GitHub repository URL: ${repoUrl}. 
  Since you cannot access private repos directly without a token, if it's public, use your knowledge of it. 
  If it's private or unknown, generate a highly realistic technical audit based on typical projects of this URL's signature.
  Provide a comprehensive audit report in JSON format. 
  Focus on structure, dependencies (Node/Android/Python), linting issues, and architectural recommendations.`;

  // Upgraded to gemini-3-pro-preview for complex technical analysis tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          summary: { type: Type.STRING },
          structure: {
            type: Type.OBJECT,
            properties: {
              totalFiles: { type: Type.NUMBER },
              directories: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["totalFiles", "directories", "criticalFiles"]
          },
          dependencies: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              list: { type: Type.ARRAY, items: { type: Type.STRING } },
              outdated: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["type", "list", "outdated"]
          },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
              },
              required: ["severity", "category", "description"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["critical", "important", "nice-to-have"] },
              },
              required: ["title", "description", "priority"]
            }
          },
          score: { type: Type.NUMBER },
        },
        required: ["projectName", "summary", "structure", "dependencies", "issues", "recommendations", "score"]
      },
    },
  });

  // response.text is a property, not a method
  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(text);
};
