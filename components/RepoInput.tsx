
import React, { useState } from 'react';

interface RepoInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && url.includes('github.com')) {
      onAnalyze(url);
    } else {
      alert('Please enter a valid GitHub URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          disabled={isLoading}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 text-slate-100 placeholder-slate-500"
        />
        <div className="absolute inset-y-0 right-2 flex items-center pr-2">
           <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-cyan-900/20"
          >
            {isLoading ? 'Scanning...' : 'Analyze'}
          </button>
        </div>
      </div>
      <p className="text-center text-slate-500 text-sm">
        Supports Public Repositories (Simulation mode enabled for Private/Local Blueprint)
      </p>
    </form>
  );
};

export default RepoInput;
