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

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  mediaTitle: string;
  mediaBody: string;
  gradient: string;
};

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

export function EditorialScrollyDemo() {
  const chapters: Chapter[] = useMemo(
    () => [
      {
        id: "cold-open",
        eyebrow: "Chapter 01",
        title: "Cold open: establish the stakes.",
        body: "Editorial scrollytelling works when you treat scroll as pacing. Start with a clear headline, a grounded claim, and a single visual that stays with the reader.",
        mediaTitle: "Lead visual",
        mediaBody: "A sticky media panel that persists while text advances.",
        gradient: "from-sky-500/25 via-indigo-500/15 to-transparent",
      },
      {
        id: "context",
        eyebrow: "Chapter 02",
        title: "Context: build a mental model.",
        body: "Use a sticky sidecar for continuity. Let the right column change the narrative with short sections, not giant blocks of text.",
        mediaTitle: "Continuity",
        mediaBody: "Keep one anchor element stable while content scrolls.",
        gradient: "from-emerald-500/25 via-teal-500/15 to-transparent",
      },
      {
        id: "reveal",
        eyebrow: "Chapter 03",
        title: "Reveal: change the scene.",
        body: "Transition the media state at chapter boundaries: crossfades, zooms, and subtle color shifts (transform/opacity only).",
        mediaTitle: "State change",
        mediaBody: "Media crossfades between chapters with tiny motion.",
        gradient: "from-fuchsia-500/25 via-rose-500/15 to-transparent",
      },
      {
        id: "resolution",
        eyebrow: "Chapter 04",
        title: "Resolution: summarize and hand off.",
        body: "End with a compact recap and clear next actions. Editorial pages should feel like a guided reading experience, not a slideshow.",
        mediaTitle: "Recap",
        mediaBody: "Conclude with a clean summary and links.",
        gradient: "from-amber-500/25 via-orange-500/15 to-transparent",
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] =
    usePersistedNullableBoolean("microsites:editorial-scrolly:reduced-motion");
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const [perfMode, setPerfMode] = usePersistedBoolean(
    "microsites:editorial-scrolly:perf-mode",
  );
  const reducedMotionUsesSystem = reducedMotionOverride === null;
  const pageVisible = usePageVisibility();

  const rootRef = useRef<HTMLDivElement | null>(null);
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

  const active = chapters[activeIndex] ?? chapters[0]!;

  return (
    <div
      ref={rootRef}
      data-testid="microsite-root"
      data-microsite="editorial-scrolly"
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
                  editorial-scrolly
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  sticky media + chapters
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

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Scrollytelling that reads like an article.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                A classic editorial pattern: the media stays sticky on the left,
                while chapters scroll on the right. Chapter boundaries update the
                media state.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Now reading
              </div>
              <div className="mt-2 text-base font-semibold tracking-tight">
                {active.eyebrow}: {active.title}
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Scroll the chapter column to advance.
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Sticky media
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activeIndex + 1}/{chapters.length}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div
                  className={[
                    "relative aspect-[4/3] bg-gradient-to-br",
                    active.gradient,
                    perfMode ? "saturate-75" : "",
                  ].join(" ")}
                >
                  {!perfMode ? (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.6),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_55%)]" />
                  ) : null}
                  <div
                    className={[
                      "absolute inset-0 transition-opacity",
                      perfMode ? "duration-200" : "duration-500",
                      reducedMotion ? "" : "opacity-100",
                    ].join(" ")}
                  />

                  <div className="absolute inset-0 p-5">
                    <div className="rounded-xl border border-white/30 bg-white/65 p-4 backdrop-blur dark:border-white/10 dark:bg-black/25">
                      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-200">
                        {active.mediaTitle}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {active.mediaBody}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {chapters.map((c, i) => (
                        <div
                          key={c.id}
                          className={[
                            "h-1.5 w-full overflow-hidden rounded-full border border-white/30 bg-white/35 dark:border-white/10 dark:bg-white/10",
                            reducedMotion || perfMode
                              ? ""
                              : "transition-colors duration-300",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "h-full rounded-full",
                              i <= activeIndex
                                ? "bg-zinc-900/70 dark:bg-white/70"
                                : "bg-transparent",
                              reducedMotion || perfMode
                                ? ""
                                : "transition-all duration-500",
                            ].join(" ")}
                            style={{
                              width:
                                i < activeIndex
                                  ? "100%"
                                  : i === activeIndex
                                    ? "70%"
                                    : "0%",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <div className="font-semibold">Implementation note</div>
                <div className="mt-1">
                  Keep chapters as normal document sections and update sticky
                  state on enter/enterBack. Avoid pinning the whole page unless
                  you truly need it.
                </div>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-10">
            {chapters.map((c, index) => (
              <article
                key={c.id}
                ref={(el) => {
                  chapterRefs.current[index] = el;
                }}
                className="min-h-[80vh] rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {c.eyebrow}
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {c.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {c.body}
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

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    { k: "Layout", v: "Sticky media + chapters" },
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
              </article>
            ))}

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              Next: replace the gradient “media” with images/video and add
              narrative annotations while keeping it readable, fast, and
              perf-mode friendly.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
