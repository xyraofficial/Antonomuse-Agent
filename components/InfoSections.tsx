
import React from 'react';
import { 
  X, 
  BookOpen, 
  Key, 
  CreditCard, 
  Check, 
  Cpu, 
  Shield, 
  Zap, 
  Globe, 
  Lock,
  ExternalLink
} from 'lucide-react';

interface InfoSectionsProps {
  activeSection: 'docs' | 'api' | 'pricing' | null;
  onClose: () => void;
}

const InfoSections: React.FC<InfoSectionsProps> = ({ activeSection, onClose }) => {
  if (!activeSection) return null;

  const renderDocs = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-cyan-500 pl-4 py-2 bg-cyan-500/5">
        <h3 className="text-2xl font-bold text-white">System Documentation</h3>
        <p className="text-slate-400">Technical manual for DevAgent AI v2.0</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-cyan-400">
            <Cpu size={24} />
            <h4 className="font-bold">Core Architecture</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            DevAgent AI utilizes a hybrid analysis engine. First, it maps the repository structure using a recursive file-system crawler. Then, it feeds critical metadata (Manifests, Gradle, Package.json) into Gemini 3 Pro for deep logical auditing.
          </p>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 text-green-400">
            <Shield size={24} />
            <h4 className="font-bold">Security Protocols</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            All repository scanning is performed in a stateless virtualized environment. We analyze exported components, hardcoded secrets, and permission leaks specifically for mobile and web architectures.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          Analysis Pipeline
        </h4>
        <div className="space-y-3">
          {[
            { t: 'Cloning', d: 'Secure snapshot of public/private repository source.' },
            { t: 'Project Mapping', d: 'Identification of build systems (Gradle, Maven, NPM).' },
            { t: 'AST Scanning', d: 'Abstract Syntax Tree analysis for code complexity.' },
            { t: 'AI Logic Audit', d: 'LLM-powered detection of architectural anti-patterns.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-cyan-500 font-mono font-bold text-sm">0{i+1}</span>
              <div>
                <p className="text-white font-semibold text-sm">{item.t}</p>
                <p className="text-slate-500 text-xs">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiKey = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-500/5">
        <h3 className="text-2xl font-bold text-white">API Configuration</h3>
        <p className="text-slate-400">Manage your engine connection</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
          <Lock className="text-purple-400" size={32} />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white">Secure Key Management</h4>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            DevAgent AI uses environment-level API keys to interact with Google Gemini. Your personal keys are never stored on our client-side storage.
          </p>
        </div>
        
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 inline-block">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-400">SYSTEM STATUS:</span>
            <span className="text-xs font-mono text-green-400 font-bold uppercase tracking-widest">Gemini Engine Connected</span>
          </div>
        </div>

        <div className="pt-4">
          <a 
            href="https://aistudio.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors"
          >
            Get your own Gemini API Key <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-500/5">
        <h3 className="text-2xl font-bold text-white">Pricing Tiers</h3>
        <p className="text-slate-400">Scale your technical auditing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            name: 'Hacker', 
            price: '$0', 
            features: ['5 Scans / day', 'Public Repos Only', 'Standard AI Model', 'Community Support'],
            color: 'slate',
            current: true
          },
          { 
            name: 'Pro', 
            price: '$19', 
            features: ['Unlimited Scans', 'Private Repo Support', 'Gemini 3 Pro Engine', 'Priority Queue', 'Export PDF Reports'],
            color: 'cyan',
            current: false,
            best: true
          },
          { 
            name: 'Enterprise', 
            price: 'Custom', 
            features: ['SSO Integration', 'On-Premise Analysis', 'Custom AI Rulesets', '24/7 Dedicated Support', 'API Access'],
            color: 'purple',
            current: false
          }
        ].map((tier, idx) => (
          <div 
            key={idx} 
            className={`relative p-6 rounded-2xl border transition-all ${
              tier.best ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-900/10 scale-105 z-10' : 'bg-slate-950 border-slate-800'
            }`}
          >
            {tier.best && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                Most Popular
              </span>
            )}
            <h4 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-1">{tier.name}</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-white">{tier.price}</span>
              {tier.price !== 'Custom' && <span className="text-slate-500 text-sm">/mo</span>}
            </div>
            <ul className="space-y-3 mb-8">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <Check size={14} className={tier.best ? 'text-cyan-400' : 'text-slate-600'} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              tier.current 
                ? 'bg-slate-800 text-slate-500 cursor-default' 
                : tier.best 
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-900/30' 
                  : 'border border-slate-700 text-white hover:bg-slate-900'
            }`}>
              {tier.current ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const getIcon = () => {
    switch (activeSection) {
      case 'docs': return <BookOpen className="text-cyan-400" />;
      case 'api': return <Key className="text-purple-400" />;
      case 'pricing': return <CreditCard className="text-yellow-400" />;
    }
  };

  const getTitle = () => {
    switch (activeSection) {
      case 'docs': return 'Documentation';
      case 'api': return 'API Status';
      case 'pricing': return 'Pricing';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              {getIcon()}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {activeSection === 'docs' && renderDocs()}
          {activeSection === 'api' && renderApiKey()}
          {activeSection === 'pricing' && renderPricing()}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Back to Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoSections;
