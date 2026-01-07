
import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { Header } from './components/Header';
import { SceneContent } from './components/SceneContent';
import { Sidebar } from './components/Sidebar';
import { AIStatus } from './components/AIStatus';
import { ViewportToolbar } from './components/ViewportToolbar';
import { SourceList } from './components/SourceList';
import { generateSceneTheme } from './services/geminiService';
import { ThemeConfig, GroundingSource } from './types';

const defaultTheme: ThemeConfig = {
  primaryColor: '#00e5ff',
  secondaryColor: '#06b6d4',
  backgroundColor: '#010409',
  geometryType: 'lattice',
  wireframe: true,
  scale: [1, 1, 1],
  materialDetail: "Holographic Nanocrystal",
  description: "Terminal HUZIFA-ENG v4.0 Online. Standing by for hyper-parameterized structural input.",
  roughness: 0.1,
  metalness: 1.0,
  emissiveIntensity: 0.8
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const cameraControlsRef = useRef<CameraControls>(null!);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await generateSceneTheme(prompt);
      if (response) {
        setTheme(response.theme);
        setSources(response.sources);
      }
    } catch (error) {
      console.error("Engineering generation failed", error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleThemeUpdate = (updatedTheme: ThemeConfig) => {
    setTheme(updatedTheme);
  };

  return (
    <div className="relative w-full h-screen bg-[#010409] text-white overflow-hidden selection:bg-cyan-500/30">
      <Header />
      
      {/* 3D Background & Main Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={40} />
          <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <SceneContent theme={theme} isGenerating={isGenerating} />
            <Environment preset="night" />
            
            <EffectComposer disableNormalPass>
              <Bloom 
                intensity={1.2} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                mipmapBlur 
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
              <Noise opacity={0.03} />
              <ChromaticAberration offset={[0.0008, 0.0008] as any} />
            </EffectComposer>
          </Suspense>
          <CameraControls 
            ref={cameraControlsRef}
            minDistance={3} 
            maxDistance={30} 
            makeDefault
            smoothTime={0.5}
          />
        </Canvas>
      </div>

      {/* Camera Viewport Presets UI */}
      <ViewportToolbar controlsRef={cameraControlsRef} />

      {/* HUD - Search Sources Panel */}
      <SourceList sources={sources} />

      {/* HUD - Dynamic Metrics Overlay */}
      <div className="absolute top-36 left-12 pointer-events-none hidden xl:block">
        <div className="font-mono text-[10px] text-cyan-500/40 space-y-2 border-l border-cyan-500/20 pl-4">
          <div className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500"></span> LATENCY: 12MS</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500"></span> COMPUTE: HUZIFA_QUANTUM_01</div>
          <div className="flex items-center gap-2"><span className="w-1 h-1 bg-cyan-500"></span> NODES: 256_ACTIVE</div>
          <div className="pt-4 text-cyan-400 font-bold flex flex-col gap-1">
            <span>STRUCTURAL_INTEGRITY: 99.9%</span>
            <div className="w-40 h-0.5 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-500 w-[99.9%] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-10 px-4 md:px-8 flex flex-col items-center">
         <AIStatus description={theme.description} isGenerating={isGenerating} />
         
         <form 
           onSubmit={handleGenerate}
           className="mt-6 w-full max-w-4xl bg-slate-900/40 backdrop-blur-3xl border border-cyan-500/20 p-2 rounded-2xl flex items-center shadow-[0_0_100px_rgba(0,0,0,0.9)] focus-within:border-cyan-500/50 transition-all group"
         >
           <div className="pl-4 text-cyan-500 font-mono text-xs hidden md:flex items-center gap-2">
             <div className="relative">
                <span className="w-2 h-2 rounded-full bg-cyan-500 block"></span>
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
             </div>
             HUZIFA_ENGINE>
           </div>
           <input 
             type="text" 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder="Describe structure (e.g., 'A giant rotating reactor core with emerald green energy')..."
             className="flex-1 bg-transparent px-4 py-4 outline-none text-sm font-mono tracking-wide placeholder:text-slate-600 text-cyan-50"
             disabled={isGenerating}
           />
           <button 
             type="submit"
             disabled={isGenerating || !prompt.trim()}
             className="relative overflow-hidden group bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 transition-all text-white px-12 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] active:scale-95 flex items-center gap-3"
           >
             {isGenerating ? (
               <>
                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                 SYNTHESIZING...
               </>
             ) : (
               'BUILD PROJECT'
             )}
           </button>
         </form>
         
         <div className="mt-4 flex gap-12">
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> 
                HUZIFA-ENG NEURAL CORE
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> 
                HYPER_RENDER_PIPELINE
            </div>
         </div>
      </div>

      <Sidebar theme={theme} onThemeUpdate={handleThemeUpdate} />
    </div>
  );
};

export default App;
