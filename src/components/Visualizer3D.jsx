import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useCallback, useEffect } from 'react';

function Scene({ currentSong }) {
  const texture = useTexture(currentSong?.cover || '/images/cover-1.jpg');
  const groupRef = useRef();
  const ringRef = useRef();
  const barsRef = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.35;
      ringRef.current.rotation.x += delta * 0.18;
    }

    const energy = 0.2 + Math.sin(state.clock.elapsedTime * 2.5) * 0.1 + Math.cos(state.clock.elapsedTime * 1.1) * 0.03;

    if (ringRef.current?.material) {
      ringRef.current.material.emissiveIntensity = 0.5 + energy * 0.8;
    }

    barsRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const wave = Math.sin(state.clock.elapsedTime * 2 + index * 0.55) * 0.5 + 0.5;
      mesh.scale.y = 0.7 + wave * 2.1;
      mesh.scale.z = 0.95 + wave * 0.2;
      mesh.material.emissiveIntensity = 0.25 + wave * 0.8;
    });
  });

  const bars = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 4, 3]} intensity={1.4} color="#67e8f9" />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#8b5cf6" />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial map={texture} metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.05, 16, 80]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0f766e" emissiveIntensity={0.5} />
      </mesh>
      {bars.map((bar, index) => {
        const angle = (index / bars.length) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        return (
          <mesh key={bar} position={[x, 0, z]} ref={(node) => (barsRef.current[index] = node)}>
            <boxGeometry args={[0.14, 1, 0.18]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#22d3ee" emissiveIntensity={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Visualizer3D({ currentSong }) {
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const handleCreated = useCallback(({ gl }) => {
    const el = gl.domElement;
    const onLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost');
      setContextLost(true);
    };
    const onRestored = () => {
      console.info('WebGL context restored');
      setContextLost(false);
      // remount canvas to ensure fresh renderer
      setCanvasKey((k) => k + 1);
    };
    el.addEventListener('webglcontextlost', onLost, false);
    el.addEventListener('webglcontextrestored', onRestored, false);

    // cleanup: remove listeners when canvas is torn down
    return () => {
      try {
        el.removeEventListener('webglcontextlost', onLost);
        el.removeEventListener('webglcontextrestored', onRestored);
      } catch (err) {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    if (!contextLost) return;
    const onVisibility = () => {
      // try to remount when tab becomes visible again
      if (document.visibilityState === 'visible') setCanvasKey((k) => k + 1);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [contextLost]);

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 shadow-[0_0_45px_rgba(34,211,238,0.12)] relative">
      {contextLost ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <div className="text-sm text-rose-300">Visualizer lost GPU context.</div>
          <div className="text-xs text-slate-400">Try reloading or click Retry to recreate the visualizer.</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => window.location.reload()} className="rounded-full bg-rose-500/20 px-3 py-2 text-sm text-rose-300">Reload</button>
            <button onClick={() => { setContextLost(false); setCanvasKey((k) => k + 1); }} className="rounded-full bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Retry</button>
          </div>
        </div>
      ) : (
        <Canvas key={canvasKey} onCreated={handleCreated} camera={{ position: [0, 0, 5], fov: 40 }}>
          <Scene currentSong={currentSong} />
        </Canvas>
      )}
    </div>
  );
}
