"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import {
  DemoControlBar,
  usePersistedBoolean,
  usePersistedNullableBoolean,
  usePageVisibility,
  usePrefersReducedMotion,
} from "@microsites/controls";
import type { WebglSection } from "@/app/_components/WebglScrollStage";

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

const loadWebglScrollStage = () => import("./WebglScrollStage");

const WebglScrollStage = dynamic(
  () =>
    loadWebglScrollStage().then((module) => ({
      default: module.WebglScrollStage,
    })),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black" aria-hidden />,
  },
);

export function WebglDomSyncDemo() {
  const sections: WebglSection[] = useMemo(
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
  const pageVisible = usePageVisibility();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pageVisible || reducedMotion) return;

    const runtimeWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let cancelled = false;
    const prefetch = () => {
      if (cancelled) return;
      void loadWebglScrollStage();
    };

    let timeoutHandle: number | null = null;
    let idleHandle: number | null = null;

    if (typeof runtimeWindow.requestIdleCallback === "function") {
      idleHandle = runtimeWindow.requestIdleCallback(prefetch, { timeout: 1800 });
    } else {
      timeoutHandle = window.setTimeout(prefetch, 700);
    }

    return () => {
      cancelled = true;
      if (
        idleHandle !== null &&
        typeof runtimeWindow.cancelIdleCallback === "function"
      ) {
        runtimeWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [pageVisible, reducedMotion]);

  const pages = sections.length + 0.25;
  const dpr: [number, number] = perfMode ? [1, 1.25] : [1, 1.75];
  const frameLoop: "always" | "demand" | "never" = pageVisible
    ? reducedMotion
      ? "demand"
      : "always"
    : "never";

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

          <DemoControlBar
            reducedMotion={reducedMotion}
            reducedMotionUsesSystem={reducedMotionUsesSystem}
            onReducedMotionChange={setReducedMotionOverride}
            onReducedMotionSystem={() => setReducedMotionOverride(null)}
            perfMode={perfMode}
            onPerfModeChange={setPerfMode}
            repoUrl={repoUrl}
            tone="dark"
          />
        </div>
      </div>

      <div className="relative">
        <WebglScrollStage
          dpr={dpr}
          frameLoop={frameLoop}
          pages={pages}
          perfMode={perfMode}
          reducedMotion={reducedMotion}
          sections={sections}
        />
      </div>
    </div>
  );
}
