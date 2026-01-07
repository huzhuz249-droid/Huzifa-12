
import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  description: string;
  isGenerating: boolean;
}

export const AIStatus: React.FC<Props> = ({ description, isGenerating }) => {
  return (
    <div className="flex flex-col items-center max-w-lg text-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest transition-opacity ${isGenerating ? 'animate-pulse' : ''}`}>
        <Sparkles size={12} />
        {isGenerating ? 'Synthesizing...' : 'AI Engine Ready'}
      </div>
      <h2 className="text-xl md:text-2xl font-space font-medium tracking-tight text-white/90 leading-tight h-16 flex items-center">
        {isGenerating ? (
            <span className="opacity-50 italic">Dreaming up a new world for you...</span>
        ) : (
            description
        )}
      </h2>
    </div>
  );
};
