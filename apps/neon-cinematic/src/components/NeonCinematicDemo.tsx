import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  usePersistedBoolean,
  usePersistedNullableBoolean,
  usePageVisibility,
  usePrefersReducedMotion,
} from "@microsites/controls";

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  hueDeg: number;
};

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

export function NeonCinematicDemo() {
  const scenes: Scene[] = useMemo(
    () => [
      {
        id: "scene-1",
        eyebrow: "Scene 01",
        title: "Neon is contrast + restraint.",
        body: "Keep your type crisp and motion purposeful. Let the glow be a supporting character, not the plot.",
        hueDeg: 210,
      },
      {
        id: "scene-2",
        eyebrow: "Scene 02",
        title: "Scroll as a camera move.",
        body: "Drive a single timeline with transforms and opacity. Avoid layout-heavy properties; keep it GPU-friendly.",
        hueDeg: 290,
      },
      {
        id: "scene-3",
        eyebrow: "Scene 03",
        title: "Layered depth, not chaos.",
        body: "Multiple soft layers (grid, haze, orb) create depth. Tune blur and opacity so it stays readable.",
        hueDeg: 330,
      },
      {
        id: "scene-4",
        eyebrow: "Scene 04",
        title: "End with a clean landing.",
        body: "Resolve the story. Provide a recap and a clear next step — cinematic doesn't mean confusing.",
        hueDeg: 30,
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] =
    usePersistedNullableBoolean("microsites:neon-cinematic:reduced-motion");
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const reducedMotionUsesSystem = reducedMotionOverride === null;

  const [perfMode, setPerfMode] = usePersistedBoolean(
    "microsites:neon-cinematic:perf-mode",
  );
  const pageVisible = usePageVisibility();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // When backgrounded, pause GSAP's global ticker to avoid idle CPU/GPU churn.
    // Always wake on cleanup to avoid leaving the app in a "sleeping" state.
    if (pageVisible) {
      gsap.ticker.wake();
      ScrollTrigger.refresh();
    } else {
      gsap.ticker.sleep();
    }
    return () => gsap.ticker.wake();
  }, [pageVisible, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const triggers: ScrollTrigger[] = [];
      chapterRefs.current.forEach((el, index) => {
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          }),
        );
      });
      return () => triggers.forEach((t) => t.kill());
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (!rootRef.current || !stageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const stage = stageRef.current!;
      stage.style.setProperty("--hue", `${scenes[0]?.hueDeg ?? 220}deg`);
      stage.style.setProperty("--orbX", "0px");
      stage.style.setProperty("--orbY", "0px");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * scenes.length}`,
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
        },
      });

      scenes.forEach((scene, index) => {
        const t = index / Math.max(1, scenes.length - 1);
        tl.to(
          stage,
          {
            duration: 1,
            ease: "none",
            "--hue": `${scene.hueDeg}deg`,
            "--orbX": `${Math.round((t - 0.5) * 120)}px`,
            "--orbY": `${Math.round(Math.sin(t * Math.PI * 2) * 40)}px`,
          },
          index,
        );
      });

      tl.to(
        ".nc-orb",
        {
          rotate: 18,
          scale: 1.08,
          ease: "none",
        },
        0,
      );

      if (!perfMode) {
        tl.to(
          ".nc-grid",
          {
            opacity: 0.45,
            ease: "none",
          },
          0,
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [perfMode, reducedMotion, scenes]);

  const active = scenes[activeIndex] ?? scenes[0]!;

  return (
    <div
      className="min-h-screen bg-black text-zinc-50"
      data-testid="microsite-root"
      data-microsite="neon-cinematic"
    >
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-white text-sm font-semibold text-black">
              μ
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">
                neon-cinematic
              </div>
              <div className="text-sm text-zinc-400">
                layered motion + glow
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

            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div ref={rootRef} className="relative">
        <div ref={stageRef} className="relative h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.10),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_55%)]" />

            <div
              className={[
                "absolute -inset-[20%] opacity-90",
                perfMode ? "blur-2xl" : "blur-3xl",
              ].join(" ")}
              style={{
                filter: "hue-rotate(var(--hue))",
              }}
            >
              <div className="absolute left-1/4 top-1/4 size-[60vmin] rounded-full bg-fuchsia-500/25" />
              <div className="absolute right-1/4 top-1/3 size-[55vmin] rounded-full bg-sky-500/25" />
              <div className="absolute bottom-1/4 left-1/3 size-[65vmin] rounded-full bg-emerald-500/20" />
            </div>

            <div
              className={[
                "nc-grid absolute inset-0 opacity-25",
                perfMode ? "opacity-15" : "opacity-25",
              ].join(" ")}
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
                maskImage:
                  "radial-gradient(circle at 50% 35%, black 35%, transparent 70%)",
              }}
            />
          </div>

          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="relative w-full max-w-4xl">
              <div
                className={[
                  "nc-orb pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full",
                  perfMode ? "blur-2xl" : "blur-3xl",
                ].join(" ")}
                style={{
                  width: "min(60vmin, 520px)",
                  height: "min(60vmin, 520px)",
                  transform:
                    "translate(-50%, -50%) translate(var(--orbX), var(--orbY))",
                  filter: "hue-rotate(var(--hue))",
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.12), transparent 55%), radial-gradient(circle at 50% 50%, rgba(236,72,153,0.22), rgba(14,165,233,0.12), rgba(16,185,129,0.10))",
                }}
              />

              <div className="relative rounded-3xl border border-white/10 bg-black/35 p-8 shadow-2xl shadow-black/60 backdrop-blur sm:p-10">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {active.eyebrow}
                </div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  {active.title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                  {active.body}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-zinc-200">
                    Scroll-driven timeline
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-zinc-200">
                    Transform/opacity only
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-zinc-200">
                    Reduced motion supported
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {scenes.map((scene, index) => (
            <section
              key={scene.id}
              ref={(el) => {
                chapterRefs.current[index] = el;
              }}
              className="mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-6 py-16"
            >
              <div className="max-w-xl rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur sm:p-8">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {scene.eyebrow}
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {scene.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
                  {scene.body}
                </p>
                <div className="mt-5 text-sm text-zinc-400">
                  {index === activeIndex ? "Active" : "Keep scrolling"}
                </div>
              </div>
            </section>
          ))}

          <section className="mx-auto w-full max-w-6xl px-6 pb-20">
            <div className="rounded-3xl border border-white/10 bg-black/45 p-6 text-sm leading-6 text-zinc-300 backdrop-blur sm:p-8">
              <div className="font-semibold text-zinc-100">Next improvements</div>
              <div className="mt-2">
                Swap gradients for images/video, add real narrative annotations, and
                tune blur/overdraw. Keep the fallback path clean for reduced-motion
                users.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
