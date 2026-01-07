
import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../types';
import { Cpu, Layers, Sliders, Box, Grid3X3, Zap, Terminal, Activity, Eye, Users, MoveUpRight } from 'lucide-react';

interface Props {
  theme: ThemeConfig;
  onThemeUpdate: (updatedTheme: ThemeConfig) => void;
}

export const Sidebar: React.FC<Props> = ({ theme, onThemeUpdate }) => {
  const [logs, setLogs] = useState<string[]>(["STADIUM CORE ACTIVE", "LOAD_BALANCING_PASS..."]);
  
  useEffect(() => {
    const interval = setInterval(() => {
        const events = [
            `OCCUPANCY_FLOW: ${Math.floor(Math.random() * 100)}%`,
            `CROWD_PRESSURE: ${Math.floor(Math.random() * 50)}psi`,
            "EXIT_ROUTE_CALCULATED",
            "SIGHTLINE_STABLE",
            "SEATING_DENSITY_OPTIMIZED",
            "STRUCTURAL_LOAD_SAFE"
        ];
        setLogs(prev => [events[Math.floor(Math.random() * events.length)], ...prev].slice(0, 6));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (key: keyof ThemeConfig, value: any) => {
    onThemeUpdate({ ...theme, [key]: value });
  };

  return (
    <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 w-84">
      {/* Stadium Diagnostic Panel */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-cyan-500/10 p-7 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-shimmer"></div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 text-cyan-400">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-inner">
                <Users size={20} />
            </div>
            <div>
                <h3 className="text-[13px] font-black uppercase tracking-widest text-white">Arena Stats</h3>
                <p className="text-[9px] text-cyan-600 font-mono tracking-tighter">PROJECT_ID: {Math.random().toString(16).slice(2,8).toUpperCase()}</p>
            </div>
          </div>
          <Zap size={14} className="text-yellow-500/40 animate-pulse" />
        </div>

        <div className="space-y-7">
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <label className="text-[8px] text-slate-500 uppercase font-black block mb-1">Capacity</label>
                <div className="text-lg font-space font-bold text-cyan-400">{(theme.seatingCapacity || 5000).toLocaleString()}</div>
             </div>
             <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <label className="text-[8px] text-slate-500 uppercase font-black block mb-1">Viewing Angle</label>
                <div className="text-lg font-space font-bold text-cyan-400">{theme.viewingAngle || 35}°</div>
             </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                <Activity size={11} className="text-slate-600" />
                Structural Topology
            </label>
            <div className="text-xl font-space font-bold text-white tracking-tighter bg-slate-950/50 px-4 py-3 rounded-2xl border border-slate-800/50 flex justify-between items-center">
                {theme.geometryType.toUpperCase()}
                <span className="text-[11px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">R_MOD</span>
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                <Eye size={11} className="text-slate-600" />
                Visualization Mode
             </label>
             <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1.5 shadow-inner">
               <button 
                 onClick={() => handleChange('wireframe', false)}
                 className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${!theme.wireframe ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900'}`}
               >
                 <Box size={16} />
                 SOLID
               </button>
               <button 
                 onClick={() => handleChange('wireframe', true)}
                 className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${theme.wireframe ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900'}`}
               >
                 <Grid3X3 size={16} />
                 MESH
               </button>
             </div>
          </div>

          {/* Engine Parameters */}
          <div className="pt-7 border-t border-slate-800/50 space-y-6">
            <div className="flex items-center gap-2 text-cyan-700/80 mb-1">
              <Sliders size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Surface Physics</span>
            </div>

            {[
                { id: 'roughness', label: 'Anti-Slip Friction', max: 1 },
                { id: 'metalness', label: 'Material Rigidity', max: 1 },
                { id: 'emissiveIntensity', label: 'Visual Guidance', max: 2 }
            ].map((ctrl) => (
                <div key={ctrl.id} className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{ctrl.label}</label>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 rounded-md">{(theme as any)[ctrl.id].toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max={ctrl.max} step="0.01" 
                    value={(theme as any)[ctrl.id]} 
                    onChange={(e) => handleChange(ctrl.id as any, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-colors"
                  />
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-slate-950/70 backdrop-blur-2xl border border-cyan-500/5 p-5 rounded-2xl shadow-2xl relative overflow-hidden h-44">
        <div className="flex items-center gap-3 text-cyan-800 mb-4 border-b border-cyan-500/10 pb-3">
            <Terminal size={15} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safety & Flow Log</span>
        </div>
        <div className="space-y-2.5 font-mono text-[9px] overflow-hidden">
            {logs.map((log, i) => (
                <div key={i} className={`flex gap-4 transition-all duration-500 ${i === 0 ? 'text-cyan-400 font-bold opacity-100' : 'text-slate-700 opacity-60'}`}>
                    <span className="shrink-0">[{new Date().toLocaleTimeString()}]</span>
                    <span className="uppercase truncate tracking-tighter">{log}</span>
                </div>
            ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
