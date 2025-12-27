
import React, { useState, useEffect } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import { analyzeRepository } from './services/geminiService';
import RepoInput from './components/RepoInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Box, 
  Search, 
  CheckCircle2, 
  Github,
  Zap,
  AlertCircle
} from 'lucide-react';

const STEPS = [
  { id: AnalysisStep.CLONING, label: 'Cloning Repository', icon: Github, desc: 'Initializing secure sandbox and cloning source code...' },
  { id: AnalysisStep.STRUCTURING, label: 'Project Mapping', icon: Box, desc: 'Analyzing directory structures and identifying build configurations...' },
  { id: AnalysisStep.LINTING, label: 'Quality Assurance', icon: ShieldCheck, desc: 'Running automated linting and scanning for security vulnerabilities...' },
  { id: AnalysisStep.IDENTIFYING, label: 'Error Detection', icon: Search, desc: 'Detecting build errors, runtime exceptions, and dependency gaps...' },
  { id: AnalysisStep.REPORTING, label: 'Finalizing Report', icon: CheckCircle2, desc: 'Compiling findings and strategic recommendations...' },
];

function App() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setError(null);
    setResult(null);
    
    // Step-by-step UI simulation for the agent experience
    try {
      setCurrentStep(AnalysisStep.CLONING);
      await new Promise(r => setTimeout(r, 1500));
      
      setCurrentStep(AnalysisStep.STRUCTURING);
      await new Promise(r => setTimeout(r, 1500));
      
      setCurrentStep(AnalysisStep.LINTING);
      await new Promise(r => setTimeout(r, 1500));
      
      setCurrentStep(AnalysisStep.IDENTIFYING);
      const data = await analyzeRepository(url);
      
      setCurrentStep(AnalysisStep.REPORTING);
      await new Promise(r => setTimeout(r, 1000));
      
      setResult(data);
      setCurrentStep(AnalysisStep.IDLE);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. The repository might be private or inaccessible. Please check the URL.');
      setCurrentStep(AnalysisStep.IDLE);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Navbar / Logo */}
      <nav className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-cyan-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-900/40">
            <Cpu className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            DEV<span className="text-cyan-400">AGENT</span> AI
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">API Keys</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
        </div>
      </nav>

      {/* Hero Section */}
      {currentStep === AnalysisStep.IDLE && !result && (
        <div className="text-center space-y-8 mb-16 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-bold border border-cyan-400/20 uppercase tracking-widest">
            <Zap size={14} /> New: Gemini 3 Integration Active
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Technical Analysis
            </span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Upload your GitHub repository for a comprehensive AI-driven audit. 
            Detect bugs, analyze architecture, and get instant structural improvements.
          </p>
          <RepoInput onAnalyze={handleAnalyze} isLoading={false} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
            {[
              { label: 'Code Quality', icon: ShieldCheck, color: 'text-cyan-400' },
              { label: 'Structure Map', icon: Box, color: 'text-blue-400' },
              { label: 'Bug Detection', icon: Search, color: 'text-purple-400' },
              { label: 'Optimization', icon: Zap, color: 'text-yellow-400' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <feature.icon className={feature.color} size={24} />
                <span className="text-slate-500 text-sm font-semibold">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Progress View */}
      {currentStep !== AnalysisStep.IDLE && (
        <div className="max-w-3xl mx-auto space-y-12 py-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-white">Agent Scanning In Progress</h3>
            <p className="text-slate-400">Initializing secure virtualization for sandbox analysis...</p>
          </div>

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const isPending = STEPS.findIndex(s => s.id === currentStep) < index;
              const isActive = step.id === currentStep;
              const isDone = STEPS.findIndex(s => s.id === currentStep) > index;

              return (
                <div 
                  key={step.id} 
                  className={`relative flex items-center gap-6 p-6 rounded-2xl border transition-all duration-500 ${
                    isActive 
                      ? 'bg-slate-900 border-cyan-500/50 shadow-2xl shadow-cyan-900/20' 
                      : isDone 
                        ? 'bg-slate-950 border-slate-800 opacity-60' 
                        : 'bg-slate-950 border-slate-900 opacity-40'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    isActive ? 'bg-cyan-500 text-white animate-pulse' : isDone ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.label}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                      <div className="scanner-line"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dashboard Result */}
      {result && !error && currentStep === AnalysisStep.IDLE && (
        <AnalysisDashboard data={result} />
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-900/10 border border-red-500/20 rounded-2xl text-center space-y-4">
          <AlertCircle className="text-red-400 mx-auto" size={48} />
          <p className="text-red-400 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Technical Log View (Hidden/Collapsible maybe) */}
      {currentStep !== AnalysisStep.IDLE && (
        <div className="mt-12 max-w-3xl mx-auto p-4 bg-black rounded-xl border border-slate-800 font-mono text-[10px] text-green-500 h-32 overflow-hidden relative shadow-inner">
          <div className="space-y-1 animate-pulse">
            <p>> [AGENT] Authenticating with VCS...</p>
            <p>> [VCS] Connection established. Branch: main</p>
            <p>> [SANDBOX] Mounting volume /tmp/project_analysis...</p>
            <p>> [LINTER] Scanning AST trees for complexity scores...</p>
            <p>> [DEPENDENCY] Fetching manifest from lockfile...</p>
            <p>> [SYSTEM] Aggregating results for JSON parser...</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default App;
