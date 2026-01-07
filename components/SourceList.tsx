
import React from 'react';
import { ExternalLink, Link2 } from 'lucide-react';
import { GroundingSource } from '../types';

interface Props {
  sources: GroundingSource[];
}

export const SourceList: React.FC<Props> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="absolute bottom-40 left-12 z-10 w-64 pointer-events-none">
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-cyan-500/10 p-4 rounded-xl shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-2 text-cyan-500 mb-3 border-b border-cyan-500/10 pb-2">
          <Link2 size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">Research Data</span>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
          {sources.map((source, i) => (
            <a 
              key={i} 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-start gap-2 hover:bg-cyan-500/5 p-1.5 rounded transition-all"
            >
              <div className="shrink-0 mt-0.5">
                <ExternalLink size={10} className="text-slate-500 group-hover:text-cyan-400" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 group-hover:text-cyan-100 leading-tight line-clamp-2">
                {source.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
