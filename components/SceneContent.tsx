
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeConfig } from '../types';

interface Props {
  theme: ThemeConfig;
  isGenerating?: boolean;
}

const StadiumGeometry = ({ rows = 8, width = 6 }: { rows?: number, width?: number }) => {
  const steps = useMemo(() => {
    const arr = [];
    for (let i = 0; i < rows; i++) {
      // Create a step: position moves up and back
      arr.push({
        position: [0, i * 0.4, i * 0.5] as [number, number, number],
        args: [width, 0.1, 0.6] as [number, number, number]
      });
      // Backing/riser
      arr.push({
        position: [0, i * 0.4 - 0.2, i * 0.5 + 0.3] as [number, number, number],
        args: [width, 0.4, 0.05] as [number, number, number]
      });
    }
    return arr;
  }, [rows, width]);

  return (
    <group>
      {steps.map((step, idx) => (
        <mesh key={idx} position={step.position}>
          <boxGeometry args={step.args} />
        </mesh>
      ))}
    </group>
  );
};

export const SceneContent: React.FC<Props> = ({ theme, isGenerating }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const scannerRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }
    
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(time * 1.5) * 2.5;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008;
      ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  const renderGeometry = () => {
    switch (theme.geometryType) {
      case 'box': return <mesh><boxGeometry args={[3, 3, 3]} /></mesh>;
      case 'cylinder': return <mesh><cylinderGeometry args={[1.5, 1.5, 4.5, 64]} /></mesh>;
      case 'sphere': return <mesh><sphereGeometry args={[2.2, 64, 64]} /></mesh>;
      case 'torus': return <mesh><torusGeometry args={[2.5, 0.6, 32, 128]} /></mesh>;
      case 'pipe': return <mesh><torusGeometry args={[2.5, 0.2, 16, 128, Math.PI]} /></mesh>;
      case 'lattice': return <mesh><boxGeometry args={[3, 3, 3, 16, 16, 16]} /></mesh>;
      case 'stadium': return <StadiumGeometry />;
      default: return <mesh><boxGeometry /></mesh>;
    }
  };

  const material = isGenerating ? (
    <MeshDistortMaterial 
      speed={6} 
      distort={0.5} 
      color={theme.primaryColor} 
      wireframe 
      emissive={theme.primaryColor}
      emissiveIntensity={3}
    />
  ) : (
    <meshStandardMaterial 
      color={theme.primaryColor} 
      wireframe={theme.wireframe}
      roughness={theme.roughness}
      metalness={theme.metalness}
      emissive={theme.primaryColor}
      emissiveIntensity={theme.emissiveIntensity}
      side={THREE.DoubleSide}
    />
  );

  return (
    <>
      <color attach="background" args={[theme.backgroundColor]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={2} color={theme.secondaryColor} />
      <spotLight 
        position={[-15, 25, 10]} 
        angle={0.2} 
        penumbra={1} 
        intensity={3} 
        castShadow 
        color={theme.primaryColor}
      />

      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        sectionSize={2.5} 
        cellSize={0.5} 
        sectionColor={theme.secondaryColor} 
        cellColor="#020617" 
        sectionThickness={2}
        position={[0, -5, 0]}
      />

      {/* Laser Scanning Beam */}
      <mesh ref={scannerRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[8, 8, 0.02, 64]} />
        <meshBasicMaterial color={theme.primaryColor} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7.5, 0.015, 16, 100]} />
          <meshBasicMaterial color={theme.primaryColor} transparent opacity={0.3} />
        </mesh>
      </group>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group scale={theme.scale} ref={meshRef}>
            {/* Inject material into children of the geometry group */}
            {React.cloneElement(renderGeometry() as React.ReactElement, {
                children: React.Children.map((renderGeometry() as React.ReactElement).props.children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement, { children: material });
                    }
                    // For stadium custom component, we need to apply material to its meshes
                    return child;
                })
            })}
            
            {/* Fallback for complex group geometry like Stadium */}
            {theme.geometryType === 'stadium' && (
                <group>
                    <StadiumGeometry rows={10} width={8} />
                    {/* Apply material via traversal logic in threejs or just standard assignment if possible */}
                    <mesh scale={[1,1,1]} visible={false}>
                        <boxGeometry />
                        {material}
                    </mesh>
                </group>
            )}

            {/* Default mesh with material if not stadium */}
            {theme.geometryType !== 'stadium' && (
                <mesh>
                    {(renderGeometry() as any).props.children.props.children}
                    {material}
                </mesh>
            )}
        </group>
      </Float>

      <Text
        position={[0, -7, 0]}
        fontSize={0.25}
        color={theme.primaryColor}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff"
        fillOpacity={0.5}
        letterSpacing={0.3}
      >
        HUZIFA_STADIUM_ANALYSIS // STATS: {theme.materialDetail.toUpperCase()}
      </Text>
    </>
  );
};
