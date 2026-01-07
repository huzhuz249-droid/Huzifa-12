
import React from 'react';
import { Ruler, Terminal, Activity, Zap, BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-8 md:p-12 flex justify-between items-start pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto cursor-default group">
        <div className="relative w-14 h-14 bg-slate-900 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-cyan-500 transition-all duration-500">
          <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <BarChart3 size={24} className="text-cyan-400 relative z-10" />
        </div>
        <div>
          <h1 className="text-2xl font-space font-black tracking-tighter uppercase leading-none text-white flex items-center gap-2">
            HUZIFA <span className="text-cyan-500 italic">ENG</span>
            <span className="text-[10px] font-mono bg-cyan-500 text-black px-1.5 py-0.5 rounded ml-2">ARENA_STAT_v4</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase mt-2 opacity-70">Statistical Stadium & Bleacher Modeler</p>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center gap-6 pointer-events-auto">
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-[10px] text-cyan-500/80 font-mono shadow-xl">
              <Activity size={12} className="text-cyan-400 animate-pulse" />
              ENGINE_STABILITY: 100%
            </div>
            <span className="text-[8px] text-slate-600 mt-1 font-mono">NODE: ARAB_GULF_ARENA_CLUSTER</span>
        </div>
        <button className="relative group bg-slate-950 text-cyan-400 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-cyan-500/30 hover:border-cyan-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10">Generate Report</span>
        </button>
      </div>
    </header>
  );
};
