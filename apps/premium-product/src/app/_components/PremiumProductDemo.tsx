"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DemoControlBar,
  usePersistedBoolean,
  usePersistedNullableBoolean,
  usePageVisibility,
  usePrefersReducedMotion,
} from "@microsites/controls";

type Step = {
  title: string;
  description: string;
  spec: string;
  accentFrom: string;
  accentTo: string;
};

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

export function PremiumProductDemo() {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Glass UI, real hierarchy",
        description:
          "Pinned layout with restrained motion. The product stays anchored while the story moves.",
        spec: "Pinned + reveal",
        accentFrom: "from-indigo-500/20",
        accentTo: "to-sky-500/20",
      },
      {
        title: "Scroll-triggered progression",
        description:
          "Each section takes over with a clean enter/exit. No jitter, no layout thrash.",
        spec: "ScrollTrigger steps",
        accentFrom: "from-emerald-500/20",
        accentTo: "to-teal-500/20",
      },
      {
        title: "Subtle parallax, not gimmicks",
        description:
          "Micro-depth cues on the hero card that stop immediately in reduced-motion mode.",
        spec: "Parallax (subtle)",
        accentFrom: "from-fuchsia-500/20",
        accentTo: "to-rose-500/20",
      },
      {
        title: "Designed for performance",
        description:
          "Animations are transform/opacity-driven and scoped to a single page section.",
        spec: "Perf-friendly",
        accentFrom: "from-amber-500/20",
        accentTo: "to-orange-500/20",
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] =
    usePersistedNullableBoolean("microsites:premium-product:reduced-motion");
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const [perfMode, setPerfMode] = usePersistedBoolean(
    "microsites:premium-product:perf-mode",
  );
  const reducedMotionUsesSystem = reducedMotionOverride === null;
  const pageVisible = usePageVisibility();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<Array<HTMLElement | null>>([]);
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

      stepsRef.current.forEach((el, index) => {
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

      return () => {
        triggers.forEach((t) => t.kill());
      };
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const active = steps[activeIndex] ?? steps[0]!;

  return (
    <div
      ref={rootRef}
      data-testid="microsite-root"
      data-microsite="premium-product"
      className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-950 dark:from-black dark:via-zinc-950 dark:to-black dark:text-zinc-50"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-black">
                μ
              </div>
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight">
                  premium-product
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  pinned scroll demo
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
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Premium product pages with motion that feels expensive.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                A minimal, reusable pattern: sticky product card + scroll-driven
                narrative steps. Uses GSAP ScrollTrigger for step activation and
                respects <span className="font-medium">prefers-reduced-motion</span>.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Active step
              </div>
              <div className="mt-2 text-base font-semibold tracking-tight">
                {active.title}
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {active.spec}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div
                className={[
                  "relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br p-6 shadow-inner dark:border-zinc-800",
                  active.accentFrom,
                  active.accentTo,
                ].join(" ")}
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur dark:border-zinc-800 dark:bg-black/30 dark:text-zinc-100">
                    <span className="inline-block size-1.5 rounded-full bg-zinc-900 dark:bg-white" />
                    Aurora Glass
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight">
                    {active.title}
                  </div>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {active.description}
                  </p>
                </div>

                <div
                  className={[
                    "pointer-events-none absolute inset-0 opacity-70 transition-opacity",
                    perfMode ? "blur-xl duration-200" : "blur-2xl duration-700",
                    reducedMotion ? "opacity-40" : "opacity-70",
                  ].join(" ")}
                >
                  <div className="absolute -left-24 -top-24 size-72 rounded-full bg-white/60 dark:bg-white/15" />
                  <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-white/40 dark:bg-white/10" />
                </div>

                <div
                  className={[
                    "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent dark:from-black/30",
                    reducedMotion || perfMode ? "" : "transition-transform duration-700",
                  ].join(" ")}
                  style={{
                    transform: reducedMotion
                      ? undefined
                      : `translateY(${Math.max(0, (3 - activeIndex) * (perfMode ? 2 : 4))}px)`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Battery", value: "24h" },
                  { label: "Weight", value: "310g" },
                  { label: "Latency", value: "8ms" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {s.label}
                    </div>
                    <div className="mt-1 font-semibold tracking-tight">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">
                Tip: scroll the right column to see step activation.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {steps.map((step, index) => (
              <article
                key={step.title}
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                className="min-h-[75vh] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Step {index + 1}
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  </div>

                  <div
                    className={[
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
                      index === activeIndex
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
                    ].join(" ")}
                  >
                    {index === activeIndex ? "Active" : "Scroll"}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { k: "Pattern", v: step.spec },
                    {
                      k: "Motion",
                      v: reducedMotion ? "Reduced" : "Standard",
                    },
                    {
                      k: "Performance",
                      v: perfMode ? "Perf mode" : "Standard",
                    },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {row.k}
                      </div>
                      <div className="mt-1 font-semibold tracking-tight">
                        {row.v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  <div className="font-semibold">Implementation note</div>
                  <div className="mt-1">
                    Each step is a normal document section. ScrollTrigger listens
                    for <span className="font-mono">onEnter</span> /{" "}
                    <span className="font-mono">onEnterBack</span> to update the
                    sticky card state — minimal work, maximal clarity.
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              Next: add Lenis smoothing (optional) and a more image-forward
              hero while keeping reduced-motion and perf-mode behavior solid.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
