
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { 
  FileCode, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Zap, 
  TrendingUp,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Check,
  MapPin,
  Lock,
  Flame,
  ShieldAlert,
  Lightbulb,
  Terminal,
  Package,
  Search,
  ExternalLink,
  Settings
} from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [dependenciesExpanded, setDependenciesExpanded] = useState(false);
  const [dependencyFilter, setDependencyFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState<number | null>(null);

  const toggleIssue = (index: number) => {
    const next = new Set(expandedIssues);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedIssues(next);
  };

  const handleCopySnippet = async (index: number, snippet: string) => {
    const cleanSnippet = snippet.replace(/\[\[HL\]\]|\[\[\/HL\]\]/g, '');
    try {
      await navigator.clipboard.writeText(cleanSnippet);
      setSnippetCopied(index);
      setTimeout(() => setSnippetCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy snippet:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical': 
        return {
          card: 'bg-red-500/5 border-red-500/20 hover:border-red-500/40 shadow-lg shadow-red-900/5',
          tag: 'bg-red-500/10 text-red-500 border-red-500/20',
          dot: 'bg-red-500',
          icon: <Flame size={12} className="text-red-500" />
        };
      case 'important': 
        return {
          card: 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40',
          tag: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          dot: 'bg-orange-500',
          icon: <ShieldAlert size={12} className="text-orange-500" />
        };
      case 'nice-to-have': 
        return {
          card: 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
          tag: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          dot: 'bg-blue-500',
          icon: <Lightbulb size={12} className="text-blue-500" />
        };
      default: 
        return {
          card: 'bg-slate-500/5 border-slate-500/20',
          tag: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
          dot: 'bg-slate-500',
          icon: <Zap size={12} />
        };
    }
  };

  const handleCopyIssues = async () => {
    let reportText = `📋 TECHNICAL AUDIT REPORT: ${data.projectName}\n`;
    reportText += `Health Score: ${data.score}/100\n`;
    reportText += `Dev Progress: ${data.developmentProgress}%\n`;
    reportText += `Summary: ${data.summary}\n\n`;
    reportText += `❌ IDENTIFIED ISSUES (${data.issues.length}):\n`;
    reportText += `------------------------------------------\n`;

    data.issues.forEach((issue, idx) => {
      const cleanSnippet = issue.snippet?.replace(/\[\[HL\]\]|\[\[\/HL\]\]/g, '') || '';
      
      reportText += `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.category}\n`;
      reportText += `   Location: ${issue.location || 'Root'}\n`;
      reportText += `   Description: ${issue.description}\n`;
      if (cleanSnippet) {
        reportText += `   Code Snippet:\n   \`\`\`\n   ${cleanSnippet}\n   \`\`\`\n`;
      }
      reportText += `\n`;
    });

    reportText += `🚀 RECOMMENDATIONS:\n`;
    reportText += `------------------------------------------\n`;
    data.recommendations.forEach((rec, idx) => {
      reportText += `- [${rec.priority.toUpperCase()}] ${rec.title}: ${rec.description}\n`;
    });

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Gagal menyalin laporan.');
    }
  };

  const renderSnippetContent = (snippet: string) => {
    const lines = snippet.split('\n');
    return (
      <div className="flex bg-[#020617] rounded-b-xl overflow-hidden text-[11px] leading-relaxed">
        <div className="bg-slate-900/30 px-3 py-4 text-slate-600 text-right select-none font-mono border-r border-slate-800/50">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="p-4 overflow-x-auto custom-scrollbar-horizontal w-full">
          <pre className="font-mono text-slate-300">
            {lines.map((line, i) => {
              const parts = line.split(/(\[\[HL\].*?\[\[\/HL\]\])/gs);
              return (
                <div key={i} className="whitespace-pre">
                  {parts.map((part, j) => {
                    if (part.startsWith('[[HL]]') && part.endsWith('[[/HL]]')) {
                      const content = part.replace('[[HL]]', '').replace('[[/HL]]', '');
                      return (
                        <span key={j} className="bg-red-500/20 text-red-100 border-b border-red-500 font-bold px-0.5 rounded-sm">
                          {content}
                        </span>
                      );
                    }
                    return <span key={j}>{part}</span>;
                  })}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    );
  };

  const filteredDependencies = data.dependencies.list.filter(pkg => 
    pkg.toLowerCase().includes(dependencyFilter.toLowerCase())
  );

  const isAndroid = data.dependencies.type.toLowerCase().includes('android') || !!data.androidMetadata;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4 flex-1 w-full">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                  <FileCode className="text-cyan-400" size={28} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight break-all">
                  {data.projectName}
                </h2>
              </div>
              {isAndroid && (
                <div className="bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded border border-green-500/20 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                  <Smartphone size={12} />
                  <span>ANDROID PROJECT</span>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl">{data.summary}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 flex-1 md:min-w-[140px] shadow-inner">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">HEALTH SCORE</span>
              <span className={`text-5xl font-black ${data.score > 80 ? 'text-green-400' : data.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {data.score}
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 flex-1 md:min-w-[140px] shadow-inner">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">DEV PROGRESS</span>
              <div className="relative flex items-center justify-center">
                <span className="text-5xl font-black text-cyan-400">
                  {data.developmentProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-1000" 
                  style={{ width: `${data.developmentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          {/* Mobile Audit Data */}
          {data.androidMetadata && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Smartphone size={20} className="text-green-400" />
                Mobile Audit Data
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Min SDK</p>
                    <p className="text-white font-mono text-xl">{data.androidMetadata.minSdkVersion}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target SDK</p>
                    <p className="text-white font-mono text-xl">{data.androidMetadata.targetSdkVersion}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Architecture</p>
                    <p className="text-cyan-400 text-sm font-semibold">{data.androidMetadata.architecture}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Build System</p>
                    <div className="flex items-center gap-2">
                      <Settings size={12} className="text-slate-500" />
                      <p className="text-amber-400 text-sm font-semibold truncate">{data.androidMetadata.buildSystem}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => setPermissionsExpanded(!permissionsExpanded)}
                    className="w-full flex justify-between items-center group py-1"
                  >
                    <p className="text-[10px] text-slate-500 uppercase font-bold group-hover:text-slate-400 transition-colors">
                      Manifest Permissions ({data.androidMetadata.permissions.length})
                    </p>
                    {permissionsExpanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </button>
                  
                  {permissionsExpanded ? (
                    <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {data.androidMetadata.permissions.map((perm, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                          <div className="flex items-center gap-2">
                            <Lock size={12} className="text-green-500 flex-shrink-0" />
                            <span className="text-[11px] font-mono text-white font-semibold break-all">
                              {perm.name.replace('android.permission.', '')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {perm.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {data.androidMetadata.permissions.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono break-all">
                          {perm.name.replace('android.permission.', '')}
                        </span>
                      ))}
                      {data.androidMetadata.permissions.length > 3 && (
                        <span className="text-[9px] px-1.5 py-0.5 text-slate-500 font-mono">
                          +{data.androidMetadata.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Structure Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers size={20} className="text-cyan-400" />
              Structure Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium text-sm">Total Files</span>
                <span className="text-white font-mono text-sm">{data.structure.totalFiles}</span>
              </div>
              <div className="space-y-3">
                <span className="text-slate-400 text-sm font-medium">Key Directories</span>
                <div className="flex flex-wrap gap-2">
                  {data.structure.directories.map(dir => (
                    <span key={dir} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 font-mono border border-slate-700 break-all">
                      /{dir}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-slate-400 text-sm font-medium">Critical Config Files</span>
                <ul className="space-y-2">
                  {data.structure.criticalFiles.map(file => (
                    <li key={file} className="text-[11px] text-cyan-400 font-mono flex items-start gap-2 leading-tight">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></span>
                      <span className="break-all">{file}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dependencies Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap size={20} className="text-yellow-400" />
                  Dependencies
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {data.dependencies.type}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                  {data.dependencies.list.length} Items
                </span>
                {data.dependencies.outdated.length > 0 && (
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-tight flex items-center gap-1">
                    <AlertCircle size={10} /> {data.dependencies.outdated.length} Outdated
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Package Audit</h4>
                 <button 
                  onClick={() => {
                    setDependenciesExpanded(!dependenciesExpanded);
                    if (dependenciesExpanded) setDependencyFilter(''); // Reset filter on collapse
                  }}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all px-3 py-1 rounded-md border ${
                    dependenciesExpanded 
                    ? 'bg-slate-800 text-slate-300 border-slate-700' 
                    : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20'
                  }`}
                 >
                  {dependenciesExpanded ? 'Collapse' : 'View All'}
                 </button>
              </div>

              {dependenciesExpanded && (
                <div className="relative group animate-in slide-in-from-top-2 duration-200">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={14} />
                  <input 
                    type="text"
                    placeholder="Search packages by name..."
                    value={dependencyFilter}
                    onChange={(e) => setDependencyFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                  />
                  {dependencyFilter && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-600 uppercase">
                      {filteredDependencies.length} results
                    </span>
                  )}
                </div>
              )}

              <div className={`space-y-2 overflow-y-auto custom-scrollbar pr-1 transition-all duration-300 ${dependenciesExpanded ? 'max-h-[400px]' : 'max-h-[200px]'}`}>
                {(dependenciesExpanded ? filteredDependencies : data.dependencies.list.slice(0, 6)).map((pkg, idx) => {
                  const isOutdated = data.dependencies.outdated.some(o => {
                    const cleanPkg = pkg.split(':')[0]; // Gradle format check
                    return o.includes(cleanPkg) || pkg.includes(o);
                  });
                  
                  return (
                    <div key={idx} className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isOutdated 
                        ? 'bg-red-400/5 border-red-500/20 text-red-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-lg border ${isOutdated ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900 border-slate-800 group-hover:border-cyan-500/30'}`}>
                          {isOutdated ? <AlertCircle size={12} /> : <Package size={12} className="group-hover:text-cyan-400 transition-colors" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[10px] font-bold truncate tracking-tight">{pkg}</span>
                          {isOutdated && <span className="text-[8px] font-black uppercase tracking-tighter opacity-80 mt-0.5">Recommended Update Available</span>}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ExternalLink size={10} className="text-slate-600 cursor-pointer" />
                      </div>
                    </div>
                  );
                })}

                {dependenciesExpanded && filteredDependencies.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-600 space-y-2 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                    <Search size={24} className="opacity-20" />
                    <p className="text-xs font-medium">No matches for "{dependencyFilter}"</p>
                  </div>
                )}

                {!dependenciesExpanded && data.dependencies.list.length > 6 && (
                  <div className="pt-2">
                    <button 
                      onClick={() => setDependenciesExpanded(true)}
                      className="w-full py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-slate-950 rounded-xl border border-dashed border-slate-800 hover:text-slate-400 hover:border-slate-700 transition-all"
                    >
                      + {data.dependencies.list.length - 6} more packages
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Issues & Bugs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" />
                Identified Issues & Bugs
              </h3>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{data.issues.length} Items Found</span>
            </div>
            <div className="space-y-6">
              {data.issues.map((issue, idx) => {
                const isExpanded = expandedIssues.has(idx);
                return (
                  <div key={idx} className="rounded-xl border bg-slate-950 border-slate-800 hover:border-slate-700 transition-all overflow-hidden group">
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className="text-slate-500 text-[10px] font-mono break-all opacity-80 flex-1 min-w-0">
                          {issue.location || 'Root'}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">{issue.category}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{issue.description}</p>
                      
                      {issue.snippet && (
                        <button 
                          onClick={() => toggleIssue(idx)}
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 px-3 rounded-lg border ${
                            isExpanded 
                            ? 'bg-slate-800 text-slate-300 border-slate-700' 
                            : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20'
                          }`}
                        >
                          {isExpanded ? <><ChevronUp size={14} /> Collapse Code</> : <><Code2 size={14} /> View Affected Code</>}
                        </button>
                      )}
                    </div>

                    {isExpanded && issue.snippet && (
                      <div className="bg-slate-900/40 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <Terminal size={12} className="text-cyan-400 flex-shrink-0" />
                            <span className="text-[10px] font-mono text-slate-400 truncate">
                              {issue.location || 'Unknown File'}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleCopySnippet(idx, issue.snippet!)}
                            className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-[10px] font-bold ${
                              snippetCopied === idx ? 'bg-green-500/10 text-green-400' : 'hover:bg-slate-800 text-slate-500 hover:text-white'
                            }`}
                          >
                            {snippetCopied === idx ? <Check size={12} /> : <Copy size={12} />}
                            {snippetCopied === idx ? 'COPIED' : 'COPY'}
                          </button>
                        </div>
                        {renderSnippetContent(issue.snippet)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Strategic Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recommendations.map((rec, idx) => {
                const styles = getPriorityStyles(rec.priority);
                return (
                  <div key={idx} className={`p-5 rounded-2xl border transition-all flex flex-col h-full ${styles.card}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${styles.tag}`}>
                        {styles.icon}
                        {rec.priority}
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} shadow-[0_0_8px_currentColor]`}></div>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-2 leading-snug flex items-center gap-2">
                      <div className="flex-shrink-0">{styles.icon}</div>
                      {rec.title}
                    </h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed flex-1">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-12 no-print">
        <button 
          onClick={handleCopyIssues} 
          className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold transition-all shadow-xl active:scale-95 ${
            copied ? 'bg-green-500 text-white' : 'bg-white text-slate-950 hover:bg-slate-200'
          }`}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'BERHASIL DISALIN!' : 'SALIN LAPORAN ISSUE'}
        </button>
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-3 px-10 py-4 border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
        >
          MULAI ANALISIS BARU
        </button>
      </div>

      <div className="text-center text-slate-600 text-[10px] pt-12 border-t border-slate-800">
        <p className="uppercase tracking-widest">Technical Analysis Report • Generated by DevAgent AI • {new Date().toLocaleString()}</p>
        <p className="mt-2 opacity-50">© {new Date().getFullYear()} Autonomous Developer Agent Systems</p>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
