import { useEffect, useMemo, useRef, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

type Point = { x: number; y: number };
type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  series: Point[];
  color: string;
};

function makeSeries(seed: number) {
  const points: Point[] = [];
  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    const base = Math.sin((t + seed * 0.07) * Math.PI * 2) * 10;
    const trend = (seed - 1.5) * 6 * t;
    const pulse = Math.sin((t * 6 + seed) * Math.PI) * 3;
    points.push({ x: i, y: Math.round((50 + base + trend + pulse) * 10) / 10 });
  }
  return points;
}

export function DataVizScrollyDemo() {
  const chapters: Chapter[] = useMemo(
    () => [
      {
        id: "baseline",
        eyebrow: "Chapter 01",
        title: "Baseline: what does “normal” look like?",
        body: "Start with a stable chart and clear axes. Your first job is to build trust and legibility before you animate anything.",
        series: makeSeries(0),
        color: "#0ea5e9",
      },
      {
        id: "shift",
        eyebrow: "Chapter 02",
        title: "Shift: introduce a clear change.",
        body: "Use scroll to switch datasets at chapter boundaries. Keep animation durations short and consistent.",
        series: makeSeries(2),
        color: "#22c55e",
      },
      {
        id: "volatility",
        eyebrow: "Chapter 03",
        title: "Volatility: tell a story with variance.",
        body: "Highlight what matters: label peaks, call out anomalies, and keep the chart readable on small screens.",
        series: makeSeries(5),
        color: "#f97316",
      },
      {
        id: "resolution",
        eyebrow: "Chapter 04",
        title: "Resolution: recap the takeaway.",
        body: "End with a summary that matches the visual evidence. Scrollytelling should feel like a guided analysis, not a magic trick.",
        series: makeSeries(8),
        color: "#a855f7",
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] = useState<
    boolean | null
  >(null);
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;

  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const elements = chapterRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const idx = elements.indexOf(visible.target as HTMLElement);
        if (idx >= 0) setActiveIndex(idx);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65, 0.8] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = chapters[activeIndex] ?? chapters[0]!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-950 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-black">
                μ
              </div>
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight">
                  dataviz-scrolly
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  sticky chart + chapters
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <input
                  type="checkbox"
                  className="accent-zinc-900 dark:accent-white"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotionOverride(e.target.checked)}
                />
                Reduced motion
              </label>

              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Scrollytelling for charts: simple, legible, and reusable.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Sticky chart on the left, narrative chapters on the right. Each
                chapter swaps the dataset and updates the highlight color.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Active chapter
              </div>
              <div className="mt-2 text-base font-semibold tracking-tight">
                {active.eyebrow}: {active.title}
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Scroll the chapters to change the chart.
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Chart
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {activeIndex + 1}/{chapters.length}
                </div>
              </div>

              <div className="mt-4 h-[320px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={active.series}>
                    <XAxis
                      dataKey="x"
                      tick={{ fill: "rgba(160,160,160,0.9)" }}
                      axisLine={false}
                      tickLine={false}
                      hide={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(160,160,160,0.9)" }}
                      axisLine={false}
                      tickLine={false}
                      width={34}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10,10,10,0.85)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 12,
                      }}
                      labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                      itemStyle={{ color: "rgba(255,255,255,0.9)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={active.color}
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={!reducedMotion}
                      animationDuration={450}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <div className="font-semibold">Implementation note</div>
                <div className="mt-1">
                  Chapter activation uses IntersectionObserver. Animation is
                  disabled when reduced motion is enabled.
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
                    { k: "Chart", v: "Line (single series)" },
                    { k: "Motion", v: reducedMotion ? "Reduced" : "Standard" },
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
              Next: add annotations (callouts), multiple series, and a “focus
              band” highlight on active ranges.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

