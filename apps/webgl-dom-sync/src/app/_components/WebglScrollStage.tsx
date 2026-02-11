"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Scroll,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { MathUtils } from "three";

export type WebglSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

type WebglScrollStageProps = {
  dpr: [number, number];
  frameLoop: "always" | "demand" | "never";
  pages: number;
  perfMode: boolean;
  reducedMotion: boolean;
  sections: WebglSection[];
};

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = scroll.offset; // 0..1 across all pages

    state.camera.position.x = MathUtils.lerp(
      state.camera.position.x,
      Math.sin(t * Math.PI * 2) * 0.8,
      1 - Math.pow(0.001, delta),
    );
    state.camera.position.y = MathUtils.lerp(
      state.camera.position.y,
      0.2 + Math.sin(t * Math.PI) * 0.4,
      1 - Math.pow(0.001, delta),
    );
    state.camera.position.z = MathUtils.lerp(
      state.camera.position.z,
      3.6 - t * 0.8,
      1 - Math.pow(0.001, delta),
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 2, 2]} intensity={1.1} />
      <Environment preset="city" />

      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.7} floatIntensity={0.6}>
        <mesh>
          <torusKnotGeometry args={[0.7, 0.22, 240, 32]} />
          <meshStandardMaterial
            color="#7c3aed"
            roughness={0.25}
            metalness={0.65}
            emissive="#1d4ed8"
            emissiveIntensity={0.55}
          />
        </mesh>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#060712" roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

export function WebglScrollStage({
  dpr,
  frameLoop,
  pages,
  perfMode,
  reducedMotion,
  sections,
}: WebglScrollStageProps) {
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={dpr}
        frameloop={frameLoop}
        camera={{ position: [0, 0.2, 3.6], fov: 55 }}
        gl={{ antialias: !perfMode, powerPreference: "high-performance" }}
      >
        <ScrollControls pages={pages} damping={reducedMotion ? 0 : 0.2}>
          <Scene reducedMotion={reducedMotion} />
          <Scroll html>
            <div className="mx-auto w-full max-w-6xl px-6 pt-[18svh] pb-[10svh]">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  WebGL + DOM sync
                </div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Scroll drives the scene.
                  <span className="block text-zinc-400">
                    The content stays readable.
                  </span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
                  This page uses{" "}
                  <span className="font-mono">ScrollControls</span> to keep DOM
                  sections and the 3D scene in lockstep.
                </p>
              </div>

              <div className="mt-[10svh] flex flex-col gap-[10svh]">
                {sections.map((s) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="max-w-xl rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur sm:p-8"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {s.eyebrow}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
                      {s.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-[10svh] max-w-2xl rounded-3xl border border-white/10 bg-black/45 p-6 text-sm leading-6 text-zinc-300 backdrop-blur sm:p-8">
                <div className="font-semibold text-zinc-100">Next</div>
                <div className="mt-2">
                  Swap the torus for a branded 3D asset and sync key beats to
                  chapter boundaries while keeping perf mode and reduced motion
                  solid.
                </div>
              </div>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
