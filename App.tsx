
import React, { useState, useEffect } from 'react';
import { AnalysisResult, AnalysisStep } from './types';
import { analyzeRepository } from './services/geminiService';
import RepoInput from './components/RepoInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import InfoSections from './components/InfoSections';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Box, 
  Search, 
  CheckCircle2, 
  Github,
  Zap,
  AlertCircle,
  Smartphone,
  Loader2
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
  const [activeInfoSection, setActiveInfoSection] = useState<'docs' | 'api' | 'pricing' | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleAnalyze = async (url: string) => {
    setError(null);
    setResult(null);
    setProgress(0);
    
    try {
      // Step 1: Cloning
      setCurrentStep(AnalysisStep.CLONING);
      setStatusMsg("Establishing handshake with GitHub...");
      await wait(800); setProgress(10);
      setStatusMsg("Cloning source tree into ephemeral container...");
      await wait(1000); setProgress(20);
      
      // Step 2: Structuring
      setCurrentStep(AnalysisStep.STRUCTURING);
      setStatusMsg("Analyzing project layout and architecture...");
      await wait(800); setProgress(30);
      setStatusMsg("Detecting build system and entry points...");
      await wait(1000); setProgress(40);
      
      // Step 3: Linting
      setCurrentStep(AnalysisStep.LINTING);
      setStatusMsg("Initializing security scanning engine...");
      await wait(800); setProgress(50);
      setStatusMsg("Running static analysis on dependencies...");
      await wait(1000); setProgress(60);
      
      // Step 4: Identifying (AI Analysis)
      setCurrentStep(AnalysisStep.IDENTIFYING);
      setStatusMsg("Uploading context to Gemini 3 Pro reasoning engine...");
      
      const analysisPromise = analyzeRepository(url);
      
      // Dynamic status updates while waiting for AI
      const aiStatusInterval = setInterval(() => {
        const msgs = [
          "AI is auditing business logic patterns...",
          "Searching for architectural anti-patterns...",
          "Evaluating Android Manifest security...",
          "Analyzing dependency graph for vulnerabilities...",
          "Checking for hardcoded secrets and leaked tokens...",
          "Simulating build process for dependency verification..."
        ];
        setStatusMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 3000);

      const data = await analysisPromise;
      clearInterval(aiStatusInterval);
      setProgress(90);
      
      // Step 5: Reporting
      setCurrentStep(AnalysisStep.REPORTING);
      setStatusMsg("Structuring findings into comprehensive report...");
      await wait(1000); setProgress(100);
      
      setResult(data);
      setCurrentStep(AnalysisStep.IDLE);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. The repository might be private or inaccessible. Please check the URL.');
      setCurrentStep(AnalysisStep.IDLE);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Navbar / Logo */}
      <nav className="flex justify-between items-center mb-16 no-print">
        <div 
          onClick={() => { setResult(null); setCurrentStep(AnalysisStep.IDLE); }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="bg-cyan-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-900/40">
            <Cpu className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            DEV<span className="text-cyan-400">AGENT</span> AI
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <button 
            onClick={() => setActiveInfoSection('docs')} 
            className="hover:text-cyan-400 transition-colors"
          >
            Documentation
          </button>
          <button 
            onClick={() => setActiveInfoSection('api')} 
            className="hover:text-cyan-400 transition-colors"
          >
            API Status
          </button>
          <button 
            onClick={() => setActiveInfoSection('pricing')} 
            className="hover:text-cyan-400 transition-colors"
          >
            Pricing
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {currentStep === AnalysisStep.IDLE && !result && (
        <div className="text-center space-y-8 mb-16 animate-in slide-in-from-bottom-8 duration-1000 no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-bold border border-cyan-400/20 uppercase tracking-widest">
            <Zap size={14} /> New: Android & Mobile Audit v2.0
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Technical Analysis
            </span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Upload your GitHub repository for a comprehensive AI-driven audit. 
            Detect bugs, analyze Android architecture, and get instant structural improvements.
          </p>
          <RepoInput onAnalyze={handleAnalyze} isLoading={false} />
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-12 max-w-5xl mx-auto">
            {[
              { label: 'Code Quality', icon: ShieldCheck, color: 'text-cyan-400' },
              { label: 'Structure Map', icon: Box, color: 'text-blue-400' },
              { label: 'Bug Detection', icon: Search, color: 'text-purple-400' },
              { label: 'Android Audit', icon: Smartphone, color: 'text-green-400' },
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
        <div className="max-w-3xl mx-auto space-y-12 py-12 no-print">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-2">
              <Loader2 className="animate-spin" size={14} /> system audit active
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">Processing Repository</h3>
            
            {/* Main Progress Bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-1">
              <span>Initialization</span>
              <span>{progress}% Complete</span>
              <span>Analysis</span>
            </div>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isDone = STEPS.findIndex(s => s.id === currentStep) > index;

              return (
                <div 
                  key={step.id} 
                  className={`relative flex items-center gap-6 p-5 rounded-2xl border transition-all duration-500 ${
                    isActive 
                      ? 'bg-slate-900 border-cyan-500/50 shadow-2xl shadow-cyan-900/20' 
                      : isDone 
                        ? 'bg-slate-950 border-slate-800 opacity-60 scale-[0.98]' 
                        : 'bg-slate-950 border-slate-900 opacity-30 scale-95'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors duration-500 ${
                    isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : isDone ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 size={24} /> : <step.icon size={24} className={isActive ? 'animate-pulse' : ''} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className={`font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.label}</h4>
                      {isActive && (
                        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase animate-pulse">
                          Running
                        </span>
                      )}
                    </div>
                    <p className={`text-sm transition-colors ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {isActive ? statusMsg : step.desc}
                    </p>
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

          {/* Technical Log View */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-green-500 h-32 overflow-hidden relative shadow-inner">
            <div className="space-y-1">
              <p className="opacity-40">> [BOOT] Engine v2.0.4 build-4928...</p>
              <p className="opacity-60">> [AUTH] Authenticating session...</p>
              <p className="opacity-80">> [AGENT] Target repository confirmed.</p>
              <p className="text-cyan-400">> [LIVE] {statusMsg}</p>
              <p className="animate-pulse">> [SYSTEM] Tracking thread PID: {Math.floor(Math.random() * 9000 + 1000)}</p>
              <p className="opacity-30">> [CACHE] Searching for previous metadata snapshots...</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>
        </div>
      )}

      {/* Dashboard Result */}
      {result && !error && currentStep === AnalysisStep.IDLE && (
        <AnalysisDashboard data={result} />
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-900/10 border border-red-500/20 rounded-2xl text-center space-y-4 no-print">
          <AlertCircle className="text-red-400 mx-auto" size={48} />
          <p className="text-red-400 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Info Sections Modal */}
      <InfoSections 
        activeSection={activeInfoSection} 
        onClose={() => setActiveInfoSection(null)} 
      />
    </div>
  );
}

export default App;
