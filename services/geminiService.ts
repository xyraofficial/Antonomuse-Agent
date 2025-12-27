
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRepository = async (repoUrl: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this technical blueprint or GitHub repository: ${repoUrl}. 
  This agent acts as a Senior Android & Web Developer. 
  
  If it is an Android Project:
  - Identify SDK versions (min, target).
  - List requested Android Permissions from AndroidManifest.xml.
  - Detect architecture (MVVM, Clean, etc.).
  - Check for specific security risks (exported activities, debuggable true, hardcoded keys).
  - Evaluate Gradle configuration.

  If it is any other project:
  - Perform standard technical audit of dependencies and structure.

  Provide a comprehensive audit report in JSON format following the schema provided.`;

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
          androidMetadata: {
            type: Type.OBJECT,
            properties: {
              minSdkVersion: { type: Type.NUMBER },
              targetSdkVersion: { type: Type.NUMBER },
              permissions: { type: Type.ARRAY, items: { type: Type.STRING } },
              architecture: { type: Type.STRING },
              buildSystem: { type: Type.STRING },
            },
            required: ["minSdkVersion", "targetSdkVersion", "permissions", "architecture", "buildSystem"]
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

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(text);
};
