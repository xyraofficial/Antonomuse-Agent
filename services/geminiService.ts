
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeRepository = async (repoUrl: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are an Expert Android Software Architect and Security Lead. Analyze this repository: ${repoUrl}.

  STRICT INSTRUCTIONS:
  1. PROJECT FOCUS: This is an Android Technical Audit. If the repository is identified as an Android project (look for 'build.gradle', 'AndroidManifest.xml', 'app/src/main'), focus EXCLUSIVELY on Android-specific components.
  2. EXCLUDE IRRELEVANT DATA: Do not analyze or provide code snippets for Python, JavaScript, Ruby, or other non-Android languages unless they are specifically part of a cross-platform bridge (like JNI or Flutter/React Native integration).
  3. COMPREHENSIVE FOLDER ANALYSIS:
     - Audit 'app/src/main/java' or 'app/src/main/kotlin'.
     - Audit 'res/' folders (layout, drawable, values, xml).
     - Audit 'assets/' and 'jniLibs/' if present.
     - Analyze the root vs module-level 'build.gradle' (KTS or Groovy).
  4. DEPENDENCY & BUILD SYSTEM AUDIT:
     - Identify SDK versions (Compile, Target, Min).
     - Detect key libraries: Jetpack Compose, Hilt/Dagger, Retrofit/OkHttp, Room, Navigation, WorkManager.
     - Identify if the project uses modern Gradle features (Version Catalogs, KTS).
  5. PROGRESS ESTIMATION (developmentProgress):
     - Calculate 0-100 based on:
        a) Presence of core features (UI vs Data Layer vs Logic).
        b) Implementation of best practices (Unit tests, Architecture patterns).
        c) "Stubble" vs "Production-Ready" code (Presence of TODOs, empty classes, or placeholder strings).
  6. ISSUE DETECTION:
     - Detect memory leaks (Static Contexts, anonymous Listeners).
     - Detect Security flaws (Hardcoded API Keys, exported components, unsafe Intents).
     - Detect Architectural debt (Large activities, tight coupling, lack of DI).

  Use [[HL]] and [[/HL]] inside snippets to highlight specific lines that cause issues.

  Return a JSON report strictly following the provided schema.`;

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
              type: { type: Type.STRING, description: "e.g., Android (Gradle-Groovy) or Android (Gradle-KTS)" },
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
              permissions: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              architecture: { type: Type.STRING, description: "MVVM, MVI, MVC, or Unknown" },
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
                location: { type: Type.STRING, description: "Full path to the file" },
                snippet: { type: Type.STRING, description: "Code snippet with [[HL]] tags" },
              },
              required: ["severity", "category", "description", "location"]
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
          score: { type: Type.NUMBER, description: "Overall project health score 0-100" },
          developmentProgress: { type: Type.NUMBER, description: "Estimated completion percentage 0-100" },
        },
        required: ["projectName", "summary", "structure", "dependencies", "issues", "recommendations", "score", "developmentProgress"]
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI");
  }

  return JSON.parse(text);
};
