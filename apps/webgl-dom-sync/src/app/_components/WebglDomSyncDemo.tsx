"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Scroll,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { useMemo } from "react";
import { MathUtils } from "three";
import {
  usePersistedBoolean,
  usePersistedNullableBoolean,
} from "@microsites/controls";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Section = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

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

export function WebglDomSyncDemo() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: "intro",
        eyebrow: "Section 01",
        title: "A 3D layer that never fights the content.",
        body: "This pattern keeps DOM text readable while a WebGL scene reacts to scroll. The page is still a normal document — the 3D layer is just a backdrop.",
      },
      {
        id: "sync",
        eyebrow: "Section 02",
        title: "Scroll drives state, not chaos.",
        body: "Tie the scene to a single scroll progress value. Keep transforms smooth, avoid per-frame heavy computations, and respect reduced motion.",
      },
      {
        id: "perf",
        eyebrow: "Section 03",
        title: "Performance knobs matter.",
        body: "Provide a simple perf mode: lower DPR and disable expensive effects. This demo caps DPR and keeps materials simple.",
      },
      {
        id: "handoff",
        eyebrow: "Section 04",
        title: "Hand off to the next microsite.",
        body: "Once this pattern is solid, it can be reused for product pages, editorial scrollytelling, or neon cinematic experiences — without rewriting everything.",
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] =
    usePersistedNullableBoolean("microsites:webgl-dom-sync:reduced-motion");
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const reducedMotionUsesSystem = reducedMotionOverride === null;

  const [perfMode, setPerfMode] = usePersistedBoolean(
    "microsites:webgl-dom-sync:perf-mode",
  );

  const pages = sections.length + 0.25;
  const dpr: [number, number] = perfMode ? [1, 1.25] : [1, 1.75];

  return (
    <div
      className="min-h-screen bg-black text-zinc-50"
      data-testid="microsite-root"
      data-microsite="webgl-dom-sync"
    >
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-white text-sm font-semibold text-black">
              μ
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">
                webgl-dom-sync
              </div>
              <div className="text-sm text-zinc-400">
                r3f + sticky DOM narrative
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm font-medium text-zinc-100">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-white"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotionOverride(e.target.checked)}
                />
                Reduced motion
              </label>
              {reducedMotionUsesSystem ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-zinc-200">
                  System
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setReducedMotionOverride(null)}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-zinc-200 transition hover:bg-white/10"
                  aria-label="Reset reduced motion to system preference"
                  title="Use system prefers-reduced-motion"
                >
                  System
                </button>
              )}
            </div>

            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm font-medium text-zinc-100">
              <input
                type="checkbox"
                className="accent-white"
                checked={perfMode}
                onChange={(e) => setPerfMode(e.target.checked)}
              />
              Perf mode
            </label>

            <Link
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="fixed inset-0">
          <Canvas
            dpr={dpr}
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
                      <span className="font-mono">ScrollControls</span> to keep
                      DOM sections and the 3D scene in lockstep.
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
                      chapter boundaries — while keeping perf mode and reduced
                      motion solid.
                    </div>
                  </div>
                </div>
              </Scroll>
            </ScrollControls>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
