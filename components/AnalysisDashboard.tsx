
import React from 'react';
import { AnalysisResult } from '../types';
import { 
  FileCode, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Zap, 
  TrendingUp,
  ExternalLink,
  Download
} from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'important': return 'bg-orange-500';
      case 'nice-to-have': return 'bg-cyan-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileCode className="text-cyan-400" />
              {data.projectName}
            </h2>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">{data.summary}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 min-w-[140px]">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Health Score</span>
            <span className={`text-5xl font-black ${data.score > 80 ? 'text-green-400' : data.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {data.score}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Structure & Dependencies */}
        <div className="space-y-8">
          {/* Structure */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers size={20} className="text-cyan-400" />
              Structure Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Files</span>
                <span className="text-white font-mono">{data.structure.totalFiles}</span>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Key Directories</span>
                <div className="flex flex-wrap gap-2">
                  {data.structure.directories.map(dir => (
                    <span key={dir} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono">
                      /{dir}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Critical Config Files</span>
                <ul className="space-y-1">
                  {data.structure.criticalFiles.map(file => (
                    <li key={file} className="text-xs text-cyan-400 font-mono flex items-center gap-2">
                      <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              Dependencies
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Project Type</span>
                <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full text-xs font-bold uppercase">
                  {data.dependencies.type}
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Outdated Packages</span>
                {data.dependencies.outdated.length > 0 ? (
                  <ul className="space-y-2">
                    {data.dependencies.outdated.map(pkg => (
                      <li key={pkg} className="text-xs text-red-400 bg-red-400/5 p-2 rounded border border-red-400/10 flex items-center justify-between">
                        {pkg}
                        <AlertCircle size={12} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle2 size={12} /> All packages up to date
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Issues */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" />
                Identified Issues & Bugs
              </h3>
              <span className="text-slate-500 text-sm">{data.issues.length} Items Found</span>
            </div>
            <div className="space-y-4">
              {data.issues.map((issue, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-slate-950 border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-slate-600 text-[10px] font-mono">{issue.location || 'Root'}</span>
                  </div>
                  <h4 className="text-white font-semibold mb-1">{issue.category}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Strategic Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{rec.priority}</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{rec.title}</h4>
                  <p className="text-slate-400 text-xs">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <Download size={20} />
          Export PDF Report
        </button>
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 px-8 py-3 border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          New Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
