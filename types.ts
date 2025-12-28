
export interface AnalysisResult {
  projectName: string;
  summary: string;
  structure: {
    totalFiles: number;
    directories: string[];
    criticalFiles: string[];
  };
  dependencies: {
    type: string;
    list: string[];
    outdated: string[];
  };
  androidMetadata?: {
    minSdkVersion: number;
    targetSdkVersion: number;
    permissions: { name: string; description: string }[];
    architecture: string; // e.g., "MVVM", "MVI", "Clean Architecture"
    buildSystem: string; // e.g., "Gradle (Groovy)", "Gradle (KTS)"
  };
  issues: {
    severity: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    location?: string;
    snippet?: string; // Hypothetical code snippet for context
  }[];
  recommendations: {
    title: string;
    description: string;
    priority: 'critical' | 'important' | 'nice-to-have';
  }[];
  score: number;
  developmentProgress: number; // New: Estimated % of project completion/maturity
}

export enum AnalysisStep {
  IDLE = 'IDLE',
  CLONING = 'CLONING',
  STRUCTURING = 'STRUCTURING',
  LINTING = 'LINTING',
  IDENTIFYING = 'IDENTIFYING',
  REPORTING = 'REPORTING'
}
