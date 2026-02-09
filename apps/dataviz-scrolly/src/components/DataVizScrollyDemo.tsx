import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  usePersistedBoolean,
  usePersistedNullableBoolean,
} from "@microsites/controls";
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

type SimpleLineChartProps = {
  chapterId: string;
  color: string;
  perfMode: boolean;
  reducedMotion: boolean;
  series: Point[];
};

const chartSize = {
  width: 640,
  height: 320,
  padding: {
    top: 18,
    right: 14,
    bottom: 30,
    left: 38,
  },
} as const;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toFixedValue(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function SimpleLineChart({
  chapterId,
  color,
  perfMode,
  reducedMotion,
  series,
}: SimpleLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { xMin, xMax, yMin, yMax, yTicks } = useMemo(() => {
    const xMinRaw = Math.min(...series.map((point) => point.x));
    const xMaxRaw = Math.max(...series.map((point) => point.x));
    const yMinRaw = Math.min(...series.map((point) => point.y));
    const yMaxRaw = Math.max(...series.map((point) => point.y));

    const yPadding = Math.max(2, Math.round((yMaxRaw - yMinRaw) * 0.15));
    const xMin = Number.isFinite(xMinRaw) ? xMinRaw : 0;
    const xMax = Number.isFinite(xMaxRaw) ? xMaxRaw : 24;
    const yMin = Number.isFinite(yMinRaw) ? yMinRaw - yPadding : 0;
    const yMax = Number.isFinite(yMaxRaw) ? yMaxRaw + yPadding : 100;

    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }, (_, index) => {
      const t = index / (tickCount - 1);
      return yMax - (yMax - yMin) * t;
    });

    return { xMin, xMax, yMin, yMax, yTicks };
  }, [series]);

  const frameWidth =
    chartSize.width - chartSize.padding.left - chartSize.padding.right;
  const frameHeight =
    chartSize.height - chartSize.padding.top - chartSize.padding.bottom;

  const xToPx = (value: number) =>
    chartSize.padding.left + ((value - xMin) / Math.max(1, xMax - xMin)) * frameWidth;

  const yToPx = (value: number) =>
    chartSize.padding.top + ((yMax - value) / Math.max(1, yMax - yMin)) * frameHeight;

  const polylinePoints = series
    .map((point) => `${xToPx(point.x)},${yToPx(point.y)}`)
    .join(" ");

  const areaPoints = [
    `${xToPx(series[0]?.x ?? xMin)},${yToPx(yMin)}`,
    ...series.map((point) => `${xToPx(point.x)},${yToPx(point.y)}`),
    `${xToPx(series[series.length - 1]?.x ?? xMax)},${yToPx(yMin)}`,
  ].join(" ");

  const hoveredPoint =
    hoveredIndex !== null && hoveredIndex >= 0 ? series[hoveredIndex] : null;

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0) return;

    const pointerRatio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const nextIndex = Math.round(pointerRatio * (series.length - 1));
    setHoveredIndex(nextIndex);
  };

  return (
    <svg
      key={chapterId}
      role="img"
      aria-label="Chapter line chart"
      className="h-full w-full"
      viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoveredIndex(null)}
    >
      <defs>
        <linearGradient id={`area-${chapterId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={perfMode ? 0.2 : 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={chartSize.padding.left}
            y1={yToPx(tick)}
            x2={chartSize.width - chartSize.padding.right}
            y2={yToPx(tick)}
            stroke="rgba(148,163,184,0.25)"
            strokeDasharray={perfMode ? "0" : "4 4"}
          />
          <text
            x={chartSize.padding.left - 8}
            y={yToPx(tick) + 4}
            textAnchor="end"
            fill="rgba(148,163,184,0.95)"
            fontSize="11"
            fontWeight="500"
          >
            {toFixedValue(tick)}
          </text>
        </g>
      ))}

      {[0, 6, 12, 18, 24].map((tick) => (
        <text
          key={tick}
          x={xToPx(tick)}
          y={chartSize.height - chartSize.padding.bottom + 17}
          textAnchor="middle"
          fill="rgba(148,163,184,0.95)"
          fontSize="11"
          fontWeight="500"
        >
          {tick}
        </text>
      ))}

      <polygon points={areaPoints} fill={`url(#area-${chapterId})`} />

      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={perfMode ? 2.5 : 3}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={
          reducedMotion || perfMode
            ? ""
            : "transition-[opacity,stroke] duration-300 ease-out"
        }
      />

      {hoveredPoint ? (
        <g>
          <line
            x1={xToPx(hoveredPoint.x)}
            y1={chartSize.padding.top}
            x2={xToPx(hoveredPoint.x)}
            y2={chartSize.height - chartSize.padding.bottom}
            stroke="rgba(226,232,240,0.6)"
            strokeDasharray="4 4"
          />
          <circle
            cx={xToPx(hoveredPoint.x)}
            cy={yToPx(hoveredPoint.y)}
            r={5}
            fill={color}
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={2}
          />
          <g
            transform={`translate(${clamp(
              xToPx(hoveredPoint.x) + 10,
              chartSize.padding.left + 8,
              chartSize.width - chartSize.padding.right - 118,
            )}, ${clamp(
              yToPx(hoveredPoint.y) - 36,
              chartSize.padding.top + 4,
              chartSize.height - chartSize.padding.bottom - 48,
            )})`}
          >
            <rect
              width="108"
              height="38"
              rx="9"
              fill="rgba(9,9,11,0.88)"
              stroke="rgba(255,255,255,0.12)"
            />
            <text x="10" y="16" fill="rgba(226,232,240,0.92)" fontSize="11">
              Sample {hoveredPoint.x}
            </text>
            <text
              x="10"
              y="30"
              fill="rgba(248,250,252,0.95)"
              fontSize="12"
              fontWeight="600"
            >
              Value {toFixedValue(hoveredPoint.y)}
            </text>
          </g>
        </g>
      ) : null}
    </svg>
  );
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
  const [reducedMotionOverride, setReducedMotionOverride] =
    usePersistedNullableBoolean("microsites:dataviz-scrolly:reduced-motion");
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const [perfMode, setPerfMode] = usePersistedBoolean(
    "microsites:dataviz-scrolly:perf-mode",
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const elements = chapterRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];
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

              <label className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <input
                  type="checkbox"
                  className="accent-zinc-900 dark:accent-white"
                  checked={perfMode}
                  onChange={(e) => setPerfMode(e.target.checked)}
                />
                Perf mode
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
                <SimpleLineChart
                  chapterId={active.id}
                  color={active.color}
                  perfMode={perfMode}
                  reducedMotion={reducedMotion}
                  series={active.series}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <div className="font-semibold">Implementation note</div>
                <div className="mt-1">
                  Chapter activation uses IntersectionObserver. The chart is pure
                  SVG with a lightweight hover probe, and extra motion is
                  disabled in reduced-motion/perf mode.
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
                    { k: "Chart", v: "SVG line + hover probe" },
                    { k: "Motion", v: reducedMotion ? "Reduced" : "Standard" },
                    { k: "Performance", v: perfMode ? "Perf mode" : "Standard" },
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
              band” highlight on active ranges with low-cost fallbacks.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
