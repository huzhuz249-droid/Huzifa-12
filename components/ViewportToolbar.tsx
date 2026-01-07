
import React from 'react';
import { CameraControls } from '@react-three/drei';
import { Box, Move, RotateCcw, LayoutGrid, Eye } from 'lucide-react';

interface Props {
  controlsRef: React.MutableRefObject<CameraControls>;
}

export const ViewportToolbar: React.FC<Props> = ({ controlsRef }) => {
  const setView = (position: [number, number, number]) => {
    controlsRef.current?.setLookAt(position[0], position[1], position[2], 0, 0, 0, true);
  };

  const views = [
    { label: 'TOP', pos: [0, 10, 0] as [number, number, number], icon: 'T' },
    { label: 'FRONT', pos: [0, 0, 10] as [number, number, number], icon: 'F' },
    { label: 'SIDE', pos: [10, 0, 0] as [number, number, number], icon: 'S' },
    { label: 'ISO', pos: [7, 7, 7] as [number, number, number], icon: 'I' },
  ];

  return (
    <div className="absolute right-8 bottom-32 z-20 flex flex-col gap-2">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 rounded-lg flex flex-col gap-1 shadow-xl">
        <div className="px-2 py-1 mb-1 border-b border-slate-800 flex items-center gap-2">
            <Eye size={10} className="text-cyan-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Viewport</span>
        </div>
        
        {views.map((view) => (
          <button
            key={view.label}
            onClick={() => setView(view.pos)}
            className="w-10 h-10 flex items-center justify-center rounded bg-slate-800/50 hover:bg-cyan-600/20 hover:text-cyan-400 transition-all group relative"
            title={`${view.label} View`}
          >
            <span className="text-[10px] font-mono font-bold">{view.icon}</span>
            <span className="absolute right-full mr-2 px-2 py-1 bg-black text-[9px] text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-800">
                {view.label} VIEW
            </span>
          </button>
        ))}

        <div className="h-px bg-slate-800 my-1" />

        <button
          onClick={() => controlsRef.current?.reset(true)}
          className="w-10 h-10 flex items-center justify-center rounded bg-slate-800/50 hover:bg-red-600/20 hover:text-red-400 transition-all group relative"
          title="Reset View"
        >
          <RotateCcw size={14} />
          <span className="absolute right-full mr-2 px-2 py-1 bg-black text-[9px] text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-800">
              RESET VIEW
          </span>
        </button>
      </div>
      
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 rounded-lg text-[8px] font-mono text-slate-500 uppercase text-center leading-tight">
        LMB: Rotate<br/>
        RMB: Pan<br/>
        SCR: Zoom
      </div>
    </div>
  );
};
